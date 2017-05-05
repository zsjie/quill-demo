const marked = require('marked')
const Delta = require('quill-delta')

let str = '\na'

let Store = {
  foo: 'bar',
  getFoo
}

function getFoo () {
  return this.foo
}

console.log(Store.getFoo())
