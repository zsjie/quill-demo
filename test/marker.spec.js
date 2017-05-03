import { expect } from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

describe('marker', () => {
  it('should make out empty lines between paragraphs', () => {
    let md = 'p\n\n\np\n'
    let delta = new Delta().insert(md)
    expect(stringify(marker(md))).to.equal(stringify(delta))
  })
  
  it('should make out empty lines between header and paragraph', () => {
    let md = '# h1\n\n\np\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta().insert('h1')
          .insert('\n', { header: 1 })
          .insert('\n\np\n')
      )
    )
  })
  
  it('should make out blockquote', () => {
    let md = '> p\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta()
          .insert('p')
          .insert('\n', { blockquote: true })
      )
    )
  })
  
  it('should make out empty lines in blockquote', () => {
    let md = '> p\n\n\n> p\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta()
          .insert('p')
          .insert('\n\n\n', { blockquote: true })
          .insert('p')
          .insert('\n', { blockquote: true })
      )
    )
  })
  
  it('should make out paragraph line break in blockquote', () => {
    let md = '> p\np\n\n> p\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta()
          .insert('p')
          .insert('\n', { blockquote: true })
          .insert('p')
          .insert('\n\n', { blockquote: true })
          .insert('p')
          .insert('\n', { blockquote: true })
      )
    )
  })
  
  it('should make out list', () => {
    let md = '- a\n- b\n'
    expect(stringify( marker(md))).to.eql(
      stringify(
        new Delta()
          .insert('a')
          .insert('\n', { list: 'bullet' })
          .insert('b')
          .insert('\n', { list: 'bullet' })
      )
    )
  })
  
  it('should make out the empty line in list', () => {
    let md = '- a\n\n- b\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta()
          .insert('a')
          .insert('\n', { list: 'bullet' })
          .insert('b')
          .insert('\n', { list: 'bullet' })
      )
    )
  })
})

function stringify (obj) {
  return JSON.stringify(obj)
}
