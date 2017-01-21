function DeltaMaker(options) {
  this.options = options || {}
}

DeltaMaker.prototype.code = function (code, lang, escaped) {}

DeltaMaker.prototype.blockquote = function (deltas) {
  return deltas
}

DeltaMaker.prototype.html = function (html) {}

DeltaMaker.prototype.heading = function (deltas, level) {
  deltas.push({
    insert: '\n',
    attributes: {
      header: level
    }
  })
  
  return deltas
}

DeltaMaker.prototype.hr = function () {}

DeltaMaker.prototype.list = function (deltas) {
  return deltas
}

DeltaMaker.prototype.listitem = function (deltas) {
  return deltas
}

DeltaMaker.prototype.paragraph = function (deltas) {
  return deltas
}

DeltaMaker.prototype.table = function (header, body) {}

DeltaMaker.prototype.tablerow = function (content) {}

DeltaMaker.prototype.tablecell = function (content, flags) {}

// span level DeltaMaker
DeltaMaker.prototype.strong = function (deltas) {
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

DeltaMaker.prototype.link = function (href, title, deltas) {
  return deltas.map((delta) => {
    delta.attributes = delta.attributes || {}
    delta.attributes.link = href
    
    return delta
  })
}

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
