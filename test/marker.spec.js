import chai from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

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
})
