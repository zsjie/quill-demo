import { expect } from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

describe('marker', () => {
  it('should recognize empty lines between paragraphs', () => {
    let md = 'p\n\n\np'
    expect(marker(md)).to.equal(new Delta().insert('p1\n\n\np2'))
  })
})
