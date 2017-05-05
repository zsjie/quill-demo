function DeltaMaker(options) {
  this.options = options || {}
}

DeltaMaker.prototype.newline = function (text) {
  return [{ insert: text }]
}

DeltaMaker.prototype.code = function (code, lang, escaped) {
  let attributes = { 'code-block': true }
  let lines = code.split('\n')
  let deltas = []
  let cur
  
  while (cur = lines.shift()) {
    if (lines[0] !== '') {
      deltas.push(
        { insert: cur },
        { insert: '\n', attributes }
      )
      continue
    }
    
    let emptyLines = '\n'
    while (lines[0] === '') {
      emptyLines += '\n'
      lines.shift()
    }
    
    deltas.push(
      { insert: cur },
      { insert: emptyLines, attributes }
    )
  }
  
  return deltas
}

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
  return deltas.map((delta) => {
    delta.attributes = delta.attributes || {}
    delta.attributes.bold = true
    
    return delta
  })
}

DeltaMaker.prototype.strike = function (deltas) {
  return deltas.map((delta) => {
    delta.attributes = delta.attributes || {}
    delta.attributes.strike = true
    
    return delta
  })
}

DeltaMaker.prototype.em = function (deltas) {
  return deltas.map((delta) => {
    delta.attributes = delta.attributes || {}
    delta.attributes.italic = true
    
    return delta
  })
}

DeltaMaker.prototype.u = function (deltas) {
  return deltas.map((delta) => {
    delta.attributes = delta.attributes || {}
    delta.attributes.underline = true
    
    return delta
  })
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

DeltaMaker.prototype.image = function (url) {
  return [{ insert: { image: url } }]
}

DeltaMaker.prototype.text = function (text) {
  return [{ insert: text }]
}

DeltaMaker.prototype.escape = function (text) {
  return { insert: text }
}

DeltaMaker.prototype.tag = function (text) {
  return { insert: text }
}

export default DeltaMaker
