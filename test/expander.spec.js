import Delta from 'quill-delta'
import expander from '../scripts/expander'
import chai from 'chai'

const expect = chai.expect

describe('expander', () => {
  it('should expand list delta', () => {
    expect(expander(new Delta()
      .insert('foo')
      .insert('\n', { list: 'bullet' })
      .insert('bar')
      .insert('\n', { list: 'bullet' })
    )).to.equal('- foo\n- bar\n')
  })
  
  it('should expand blockquote', () => {
    expect(expander(new Delta()
      .insert('p')
      .insert('\n', { blockquote: true })
    )).to.equal('> p\n')
    
    expect(expander(new Delta()
      .insert('p')
      .insert('\n', { blockquote: true })
    )).to.equal('> p\n')
  })
  
  it('should expand blockquote with empty lines', () => {
    expect(expander(new Delta()
      .insert('p')
      .insert('\n\n', { blockquote: true })
      .insert('p')
      .insert('\n', { blockquote: true })
    )).to.equal('> p\n\n> p\n')
  })
})
