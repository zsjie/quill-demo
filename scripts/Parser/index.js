import defaults from '../defaults'
import DeltaMaker from '../DeltaMaker'
import InlineLexer from '../lexer/inlineLexer'

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
      return ''
    }
    case 'hr': {
      return this.deltaMaker.hr()
    }
    case 'heading': {
      return this.deltaMaker.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text)
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
      let body = ''
      
      while (this.next().type !== 'blockquote_end') {
        body += this.tok()
      }
      
      return this.deltaMaker.blockquote(body)
    }
    case 'list_start': {
      let body = ''
        , ordered = this.token.ordered
      
      while (this.next().type !== 'list_end') {
        body += this.tok()
      }
      
      return this.deltaMaker.list(body, ordered)
    }
    case 'list_item_start': {
      let body = ''
      
      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok()
      }
      
      return this.deltaMaker.listitem(body)
    }
    case 'loose_item_start': {
      let body = ''
      
      while (this.next().type !== 'list_item_end') {
        body += this.tok()
      }
      
      return this.deltaMaker.listitem(body)
    }
    case 'html': {
      let html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text
      return this.deltaMaker.html(html)
    }
    case 'paragraph': {
      return this.inline.output(this.token.text)
    }
    case 'text': {
      return this.parseText()
    }
  }
}

export default Parser
