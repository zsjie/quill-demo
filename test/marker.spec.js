import chai from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

const expect = chai.expect

describe('marker', () => {
  it('should recognize multi empty lines', () => {
    let deltas = new Delta().insert('title')
      .insert('\n', { header: 1 })
      .insert('\n\n')
      .insert('sometext')
    let md = '# title\n\nsometext'
    console.log(JSON.stringify(marker(md)))
    console.log(JSON.stringify(deltas))
    expect(marker(md)).to.equal(deltas)
  })
})
