const marked = require('marked')
const Delta = require('quill-delta')

let delta = new Delta()
  .insert('h1')
  .insert('\n', { header: 1 })

console.log(JSON.stringify(delta))
console.log(marked('> acc\n\na\n\n\n>cba'))
