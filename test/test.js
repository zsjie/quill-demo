const marked = require('marked')
const Delta = require('quill-delta')

let rules = {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n|$)/
}

rules.mathBlock = /^ *(\${2})\s*([\s\S]*?)\s*\1 *(?:\n|$)/
rules.mathInline = /^\$([\s\S]+?)\$(?!\$)/

let abc = '$abc$ cdedfafa'

console.log(rules.mathBlock.exec(abc))
console.log(rules.mathInline.exec(abc))
