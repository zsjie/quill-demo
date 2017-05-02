import { expect } from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

describe('marker', () => {
  it('should recognize empty lines between paragraphs', () => {
    let md = 'p\n\n\np\n'
    let delta = new Delta().insert(md)
    expect(stringify(marker(md))).to.equal(stringify(delta))
  })
  
  it('should recognize empty lines between header and paragraph', () => {
    let md = '# h1\n\n\np\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta().insert('h1')
          .insert('\n', { header: 1 })
          .insert('\n\np\n')
      )
    )
  })
  
  it('should recognize blockquote', () => {
    let md = '> p\n'
    expect(stringify(marker(md))).to.equal(
      stringify(
        new Delta()
          .insert('p')
          .insert('\n', { blockquote: true })
      )
    )
  })
})

function stringify (obj) {
  return JSON.stringify(obj)
}
