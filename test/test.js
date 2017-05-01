const marked = require('marked')
const Delta = require('quill-delta')

const reg = /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/

console.log(reg.exec('p\n\n\np\n'))

