const marked = require('marked')
const Delta = require('quill-delta')

let reg = /(?:[*+-]|\d+) [\s\S]+?(?:\n{2,}(?! )(?!(?:[*+-]|\d+) )\n*|\s*$)/
let bull = /(?:[*+-]|\d+)/
let list = '- ab\nc\n- d\n- e\n\nfgh'
let reg3 = /(?:[*+-]) [\s\S]+?(?:\n(?! )(?!(?:[*+-]|\d+) )\n*)/
let item = /^( *)((?:[*+-]|\d+)) [^\n]*(?:(?!\1(?:[*+-]|\d+) )[^\n]*)*/gm

console.log(list.match(reg))
console.log(marked(list))
console.log(list.match(item))



