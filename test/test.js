const marked = require('marked')
const Delta = require('quill-delta')

let foo = {
  foo: 'bar'
}
let bar = {
  foo: 'foo'
}

function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

console.log(sanitize('abc.com'))

function InlineLexer () {
  this.renderer = new Renderer()
  this.rules = {
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
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
    
    if (cap = this.rules.u.exec(src)) {
      src = src.substring(cap[0].length)
      out += this.renderer.u((await this.output(cap[2])) || cap[1])
      continue
    }
  
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length)
      out += this.renderer.del(await this.output(cap[1]))
    }
  }
  
  return out
}

function Renderer () {}

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

let inlineLexer = new InlineLexer()
inlineLexer.output('**~~++abc++~~**').then(out => {
  console.log(out)
})