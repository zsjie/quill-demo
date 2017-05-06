const marked = require('marked')
const Delta = require('quill-delta')

console.log(marked('+abc+'))

function InlineLexer () {
  this.renderer = new Renderer()
  this.rules = {
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    u: /^\+\+([\s\S]+?)\+\+(?!\+)/,
  }
}

InlineLexer.prototype.output = async function (src) {
  let out = ''
  let cap
  
  while (src) {
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length)
      out += await this.renderer.strong((await this.output(cap[2]) || cap[1]))
      continue
    }
    
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length)
      out += this.renderer.em((await this.output(cap[2])) || cap[1])
      continue
    }
  
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length)
      out += this.renderer.del(this.output(cap[1]))
    }
  }
  
  return out
}

InlineLexer.prototype.outputLink = async function () {
  return await Promise.resolve('a')
}

function Renderer () {

}

// span level renderer
Renderer.prototype.strong = async function(text) {
  return '<strong>' + text + '</strong>'
}

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>'
}

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>'
}

Renderer.prototype.u = function(text) {
  return '<u>' + text + '</u>'
}

function Parser () {
  this.token
  this.tokens = [1,2,3,4]
}

Parser.parse = async function () {
  let parser = new Parser()
  return await parser.parse()
}

Parser.prototype.parse = async function () {
  let result = 0
  
  while (await this.next()) {
    result += this.token
  }
  
  return result
}

Parser.prototype.next = async function () {
  return this.token = this.tokens.shift()
}
