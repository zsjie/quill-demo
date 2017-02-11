import defaults from './defaults'
import DeltaMaker from './deltaMaker'
import InlineLexer from './lexer/inlineLexer'

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = []
  this.token = null
  this.options = options || defaults
  this.options.deltaMaker = this.options.deltaMaker || new DeltaMaker
  this.deltaMaker = this.options.deltaMaker
  this.deltaMaker.options = this.options
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, deltaMaker) {
  let parser = new Parser(options, deltaMaker)
  return parser.parse(src)
}

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.deltaMaker)
  this.tokens = src.reverse()
  let debug = false
  debug && this.tokens.forEach(ele => {
    console.log(ele)
  })
  
  let out = []
  while (this.next()) {
    out = out.concat(this.tok())
  }
  
  return out
}

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop()
}

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0
}

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  let body = this.token.text
  
  while (this.peek().type === 'text') {
    body += '\n' + this.next().text
  }
  
  return this.inline.output(body)
}

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return [{ insert: '' }]
    }
    case 'hr': {
      return this.deltaMaker.hr()
    }
    case 'heading': {
      return this.deltaMaker.heading(
        this.inline.output(this.token.text),
        this.token.depth)
    }
    case 'code': {
      return this.deltaMaker.code(this.token.text,
        this.token.lang,
        this.token.escaped)
    }
    case 'table': {
      let header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j
      
      // header
      cell = ''
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] }
        cell += this.deltaMaker.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        )
      }
      header += this.deltaMaker.tablerow(cell)
      
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i]
        
        cell = ''
        for (j = 0; j < row.length; j++) {
          cell += this.deltaMaker.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          )
        }
        
        body += this.deltaMaker.tablerow(cell)
      }
      return this.deltaMaker.table(header, body)
    }
    case 'blockquote_start': {
      let deltas = []
      
      while (this.next().type !== 'blockquote_end') {
        deltas = deltas.concat(this.tok())
      }
      deltas.push({
        insert: '\n',
        attributes: {
          blockquote: true
        }
      })
      
      return this.deltaMaker.blockquote(deltas)
    }
    case 'list_start': {
      let deltas = [{ insert: '\n' }]
      let type = this.token.ordered ? 'ordered' : 'bullet'
      
      while (this.next().type !== 'list_end') {
        deltas = deltas.concat(this.tok())
        deltas.push({
          attributes: { list: type },
          insert: '\n'
        })
      }
      
      return this.deltaMaker.list(deltas)
    }
    case 'list_item_start': {
      let body = []
      let deltas = []
      
      while (this.next().type !== 'list_item_end') {
        body = this.token.type === 'text'
          ? this.parseText()
          : this.tok()
        deltas = deltas.concat(body)
      }
      
      return this.deltaMaker.listitem(deltas)
    }
    case 'loose_item_start': {
      let deltas = []
      
      while (this.next().type !== 'list_item_end') {
        deltas.push(this.tok())
      }
      
      return this.deltaMaker.listitem(deltas)
    }
    case 'html': {
      let html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text
      return this.deltaMaker.html(html)
    }
    case 'paragraph': {
      let deltas = this.inline.output(this.token.text)
      return this.deltaMaker.paragraph(deltas)
    }
    case 'text': {
      return this.parseText()
    }
  }
}

export default Parser
