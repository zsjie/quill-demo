const marked = require('marked')
const Delta = require('quill-delta')

let md1 = '    let a = 1\n    let b = 2\n\n\nabcd'
let md2 = '```\nlet a = 1\nlet b = 2```\n\n\n\nabcd'
let codeBlock = /^( {4}[^\n]+\n?)+/
let fences = /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n|$)/

let str = 'let a = 1\nlet b = 2\n\n\nlet c = 3'

console.log(md1.match(codeBlock))
console.log(md2.match(fences))
console.log(str.split('\n'))




