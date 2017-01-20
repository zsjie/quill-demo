function DeltaMaker(options) {
  this.options = options || {}
}

DeltaMaker.prototype.code = function (code, lang, escaped) {}

DeltaMaker.prototype.blockquote = function (quote) {}

DeltaMaker.prototype.html = function (html) {}

DeltaMaker.prototype.heading = function (text, level, raw) {}

DeltaMaker.prototype.hr = function () {}

DeltaMaker.prototype.list = function (body, ordered) {}

DeltaMaker.prototype.listitem = function (text) {}

DeltaMaker.prototype.paragraph = function (text) {
  return { insert: text }
}

DeltaMaker.prototype.table = function (header, body) {}

DeltaMaker.prototype.tablerow = function (content) {}

DeltaMaker.prototype.tablecell = function (content, flags) {}

// span level DeltaMaker
DeltaMaker.prototype.strong = function (deltas) {
  console.log(deltas)
  if (Array.isArray(deltas)) {
    return deltas.map((delta) => {
      delta.attributes = delta.attributes || {}
      delta.attributes.bold = true
      
      return delta
    })
  }
  
  return [{
    insert: deltas,
    attributes: { bold: true }
  }]
}

DeltaMaker.prototype.em = function (deltas) {
  console.log(deltas)
  if (Array.isArray(deltas)) {
    return deltas.map((delta) => {
      delta.attributes = delta.attributes || {}
      delta.attributes.italic = true
      
      return delta
    })
  }
  
  return [{
    insert: deltas,
    attributes: { italic: true }
  }]
}

DeltaMaker.prototype.codespan = function (text) {}

DeltaMaker.prototype.br = function () {
  return {
    insert: '\n'
  }
}

DeltaMaker.prototype.del = function (text) {}

DeltaMaker.prototype.link = function (href, title, text) {}

DeltaMaker.prototype.image = function (href, title, text) {}

DeltaMaker.prototype.text = function (text) {
  return { insert: text }
}

DeltaMaker.prototype.escape = function (text) {
  return { insert: text }
}

DeltaMaker.prototype.tag = function (text) {
  return { insert: text }
}

export default DeltaMaker
