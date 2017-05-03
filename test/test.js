const marked = require('marked')
const Delta = require('quill-delta')

let listReg = /^( *)(bull) [\s\S]+?(?:hr|def|\n(?!\1bull )|\s*$)/
let bull = /(?:[*+-]|\d+)/
let list = '- ab\n- d\n- e\n\n\n\na\nfgh'
let reg3 = /(?:[*+-]) [\s\S]+?(?:\n(?! )(?!(?:[*+-]|\d+) )\n*)/
let item = /^( *)((?:[*+-]|\d+)) [^\n]*(?:(\1(?:[*+-]|\d+) )[^\n]*)*/gm

listReg = replace(listReg)
  (/bull/g, bull)
  ()

function replace(regex, opt) {
  regex = regex.source
  opt = opt || ''
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt)
    val = val.source || val
    val = val.replace(/(^|[^\[])\^/g, '$1')
    regex = regex.replace(name, val)
    return self
  }
}

console.log(list.match(listReg))
console.log(marked(list))
console.log(list.match(item))



