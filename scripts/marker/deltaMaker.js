function DeltaMaker(options) {
  this.options = options || {}
}

DeltaMaker.prototype.code = function (code, lang, escaped) {
  let lines = code.split('\n')
  return lines.reduce((preVal, line) => {
    preVal.push(
      {
        insert: line
      },
      {
        insert: '\n',
        attributes: {
          'code-block': true
        }
      }
    )
    
    return preVal
  }, [])
}

DeltaMaker.prototype.blockquote = function (deltas) {
  let newLine = { insert: '\n' }
  deltas.unshift(newLine)
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

DeltaMaker.prototype.image = function (href, title, alt) {
  return {
    insert: {
      image: {
        url: href,
        title: title,
        alt: alt
      }
    }
  }
}

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
