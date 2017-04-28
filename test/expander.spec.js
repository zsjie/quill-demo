import Delta from 'quill-delta'
import expander from '../scripts/expander'
import chai from 'chai'

const expect = chai.expect

describe('expander', () => {
  before(() => {
  
  })
  it('should expand list delta', () => {
    expect(expander(new Delta()
      .insert('foo')
      .insert('\n', { list: 'bullet' })
      .insert('bar')
      .insert('\n', { list: 'bullet' })
    )).to.equal(`- foo\n- bar`)
  });
})
