import chai from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'
import marked from 'marked'

const expect = chai.expect

describe('marker', () => {
  it('should recognize empty lines after header', () => {
    let deltas = {"ops":[{"insert":"title"},{"insert":"\n","attributes":{"header":1}},{"insert":"\n\n"},{"insert":"sometext"},{"insert":"\n"}]}
    let md = '# title\n\n\nsometext'
    expect(JSON.stringify(marker(md))).to.equal(JSON.stringify(deltas))
  })
  
  it('should recognize empty lines after paragraph', () => {
    let deltas = {"ops":[{"insert":"foo"},{"insert":"\n"},{"insert":"\n\n"},{"insert":"bar"},{"insert":"\n"}]}
    let md = 'foo\n\n\nbar'
    expect(JSON.stringify(marker(md))).to.equal(JSON.stringify(deltas))
  })
  
  it('should recognize list', () => {
    let md = '1. test\n1. foo\n'
  })
  
  it('should recognize blockquote', () => {
    let md = '> foo bar'
    console.log(JSON.stringify(marker(md)))
    console.log(JSON.stringify(marked.lexer(md)))
  })
})

// {"ops":[{"insert":"test"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"foo"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"bar"},{"attributes":{"list":"ordered"},"insert":"\n"}]}

// wrong
// [{"type":"list_start","ordered":true},{"type":"list_item_start"},{"type":"text","text":"test"},{"type":"list_item_end"},{"type":"list_item_start"},{"type":"text","text":"foo"},{"type":"list_item_end"},{"type":"list_item_start"},{"type":"text","text":"bar"},{"type":"newline","lines":1},{"type":"list_item_end"},{"type":"list_end"}]

// correct
// [{"type":"list_start","ordered":true},{"type":"list_item_start"},{"type":"text","text":"test"},{"type":"list_item_end"},{"type":"list_item_start"},{"type":"text","text":"foo"},{"type":"list_item_end"},{"type":"list_item_start"},{"type":"text","text":"bar"},{"type":"list_item_end"},{"type":"list_end"}]'



