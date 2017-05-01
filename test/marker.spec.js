import { expect } from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

describe('marker', () => {
  it('should recognize empty lines between paragraphs', () => {
    let md = 'p\n\n\np\n'
    expect(getInsert(marker(md))).to.equal(getInsert(new Delta().insert(md)))
  })
})

function getInsert (delta) {
  return delta.ops[0].insert
}
