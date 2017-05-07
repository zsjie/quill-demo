import { expect } from 'chai'
import Delta from 'quill-delta'
import marker from '../scripts/marker'

describe('marker', () => {
  it('should make out empty lines between paragraphs', () => {
    let md = 'p\n\n\np\n'
    let delta = new Delta().insert(md)
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out empty lines between header and paragraph', () => {
    let md = '# h1\n\n\np\n'
    let delta = new Delta().insert('h1')
      .insert('\n', { header: 1 })
      .insert('\n\np\n')
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out blockquote', () => {
    let md = '> p\n'
    let delta = new Delta()
      .insert('p')
      .insert('\n', { blockquote: true })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out empty lines in blockquote', () => {
    let md = '> p\n\n\n> p\n'
    let delta = new Delta()
      .insert('p')
      .insert('\n\n\n', { blockquote: true })
      .insert('p')
      .insert('\n', { blockquote: true })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out paragraph line break in blockquote', () => {
    let md = '> p\np\n\n> p\n'
    let delta = new Delta()
      .insert('p')
      .insert('\n', { blockquote: true })
      .insert('p')
      .insert('\n\n', { blockquote: true })
      .insert('p')
      .insert('\n', { blockquote: true })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out list', () => {
    let md = '- a\n- b\n'
    let delta = new Delta()
      .insert('a')
      .insert('\n', { list: 'bullet' })
      .insert('b')
      .insert('\n', { list: 'bullet' })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out the empty line between lists', () => {
    let md = '- a\n\n- b\n'
    let delta = new Delta()
      .insert('a')
      .insert('\n', { list: 'bullet' })
      .insert('\nb')
      .insert('\n', { list: 'bullet' })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out code block', () => {
    let md = '    let a = 1\n    let b = 2\n'
    let delta = new Delta()
      .insert('let a = 1')
      .insert('\n', { 'code-block': true })
      .insert('let b = 2')
      .insert('\n', { 'code-block': true })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out code block of gfm style', () => {
    let md = '```\nlet a = 1\n\n\nlet b = 2```\n'
    let delta = new Delta()
      .insert('let a = 1')
      .insert('\n\n\n', { 'code-block': true })
      .insert('let b = 2')
      .insert('\n', { 'code-block': true })
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
  
  it('should make out inline formula', () => {
    let md = `foo $e=mc^2$bar\n`
    let delta  = new Delta()
      .insert('foo ')
      .insert({ formula: 'e=mc^2' })
      .insert('bar\n')
    return marker(md).then(mDelta => {
      expect(stringify(mDelta)).to.equal(stringify(delta))
    })
  })
})

function stringify (obj) {
  return JSON.stringify(obj)
}
