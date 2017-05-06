import defaults from './defaults'
import DeltaMaker from './deltaMaker'
import InlineLexer from './lexer/inlineLexer'
import { emptyLines, mergeOps } from './helpers'

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
  
  this.inBlockquote = false
  this.attachments = this.options.attachments || {}
}

/**
 * Static Parse Method
 */

Parser.parse = async function (src, options, deltaMaker) {
  let parser = new Parser(options, deltaMaker)
  return await parser.parse(src)
}

/**
 * Parse Loop
 */

Parser.prototype.parse = async function (src) {
  this.inline = new InlineLexer(src.links, this.options, this.deltaMaker)
  this.tokens = src.reverse()
  
  let out = []
  while (this.next()) {
    out = out.concat(await this.tok())
  }
  
  return mergeOps(out)
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

Parser.prototype.parseText = async function () {
  let body = this.token.text
  
  while (this.peek().type === 'text') {
    body += '\n' + this.next().text
  }
  
  return await this.inline.output(body)
}

/**
 * Parse Current Token
 */

Parser.prototype.tok = async function () {
  switch (this.token.type) {
    case 'space': {
      return this.deltaMaker.text('')
    }
    case 'newline': {
      let text = emptyLines(this.token.lines)
      
      while (this.peek().type === 'newline' ||
      this.peek().type === 'paragraph'
        ) {
        let next = this.next()
        
        if (next.type === 'newline') {
          text += emptyLines(next.lines)
        }
        
        if (next.type === 'paragraph') {
          text += (next.text + '\n')
        }
      }
      
      return this.deltaMaker.newline(text)
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
        , body   = ''
        , i
        , row
        , cell
        , flags
        , j
      
      // header
      cell = ''
      for (i = 0; i < this.token.header.length; i++) {
        flags = {header: true, align: this.token.align[i]}
        cell += this.deltaMaker.tablecell(
          this.inline.output(this.token.header[i]),
          {header: true, align: this.token.align[i]}
        )
      }
      header += this.deltaMaker.tablerow(cell)
      
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i]
        
        cell = ''
        for (j = 0; j < row.length; j++) {
          cell += this.deltaMaker.tablecell(
            this.inline.output(row[j]),
            {header: false, align: this.token.align[j]}
          )
        }
        
        body += this.deltaMaker.tablerow(cell)
      }
      return this.deltaMaker.table(header, body)
    }
    case 'blockquote_start': {
      let deltas        = []
      this.inBlockquote = true
      while (this.next().type !== 'blockquote_end') {
        deltas = deltas.concat(await this.tok())
      }
      this.inBlockquote = false
      
      if (/\n+/.test(deltas[deltas.length - 1].insert)) {
        deltas.pop()
      }
      
      deltas.push({
        insert:     '\n',
        attributes: {
          blockquote: true
        }
      })
      
      return this.deltaMaker.blockquote(deltas)
    }
    case 'list_start': {
      let deltas = []
      let type   = this.token.ordered ? 'ordered' : 'bullet'
      
      while (this.next().type !== 'list_end') {
        deltas = deltas.concat(await this.tok())
        deltas.push({
          insert:     '\n',
          attributes: {list: type}
        })
      }
      
      return this.deltaMaker.list(deltas)
    }
    case 'list_item_start': {
      let body   = []
      let deltas = []
      
      while (this.next().type !== 'list_item_end') {
        body = this.token.type === 'text'
          ? await this.parseText()
          : await this.tok()
        deltas = deltas.concat(body)
      }
      
      return this.deltaMaker.listitem(deltas)
    }
    case 'loose_item_start': {
      let deltas = []
      
      while (this.next().type !== 'list_item_end') {
        deltas = deltas.concat(await this.tok())
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
      if (this.inBlockquote) {
        let text  = this.token.text
        let delta = this.inline.output(text)
        
        if (this.peek().type === 'newline') {
          delta.push({
            insert:     emptyLines(this.next().lines + 1),
            attributes: {blockquote: true}
          })
        }
        else {
          delta.push({
            insert:     emptyLines(1),
            attributes: {blockquote: true}
          })
        }
        
        return delta
      }
      else {
        let text = this.token.text + '\n'
        
        while (this.peek().type === 'newline' ||
        this.peek().type === 'paragraph'
          ) {
          let next = this.next()
          
          if (next.type === 'newline') {
            text += emptyLines(next.lines)
          }
          
          if (next.type === 'paragraph') {
            text += (next.text + '\n')
          }
        }
        
        let deltas = this.inline.output(text)
        
        return this.deltaMaker.paragraph(deltas)
      }
    }
    case 'text': {
      return await this.parseText()
    }
  }
}

export default Parser
