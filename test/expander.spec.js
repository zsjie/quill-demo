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
  
  it('should expand code block', () => {
    let deltas = new Delta()
      .insert('let a = 1')
      .insert('\n\n\n', { 'code-block': true })
      .insert('let b = 2')
      .insert('\n', { 'code-block': true })
    
    expect(expander(deltas)).to.equal('```\nlet a = 1\n\n\nlet b = 2\n```\n')
  })
  
  it('should expand bold format', () => {
    let delta = new Delta()
      .insert('foo', { bold: true })
      .insert(' bar\n')
    expect(expander(delta)).to.equal('**foo** bar\n')
  })
  
  it('should expand bold format in blockquote', () => {
    let delta = new Delta()
      .insert('foo', { bold: true })
      .insert(' bar')
      .insert('\n', { blockquote: true })
    expect(expander(delta)).to.equal('> **foo** bar\n')
  })
  
  it('should expand bold format in list', () => {
    let delta = new Delta()
      .insert('foo', { bold: true })
      .insert('\n', { list: 'bullet' })
      .insert('bar')
      .insert('\n', { list: 'bullet' })
    expect(expander(delta)).to.equal('- **foo**\n- bar\n')
  })
  
  it('should expand strike format', () => {
    let delta = new Delta()
      .insert('foo', { strike: true })
      .insert(' bar\n')
    expect(expander(delta)).to.equal('~~foo~~ bar\n')
  })
  
  it('should expand italic format', () => {
    let delta = new Delta()
      .insert('foo', { italic: true })
      .insert(' bar\n')
    expect(expander(delta)).to.equal('*foo* bar\n')
  })
  
  it('should expand underline format', () => {
    let delta = new Delta()
      .insert('foo', { underline: true })
      .insert(' bar\n')
    expect(expander(delta)).to.equal('++foo++ bar\n')
  })
  
  it('should expand multi format', () => {
    let delta = new Delta()
      .insert('foo', { strike: true, bold: true })
      .insert(' bar\n')
    expect(expander(delta)).to.equal('**~~foo~~** bar\n')
  })
})
