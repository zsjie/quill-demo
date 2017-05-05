import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

if (typeof window !== 'undefined') {
  window.Lexer = Lexer
  window.Parser = Parser
}

function marker (str, attachments) {
  let tokens = Lexer.lex(str)
  return { ops: Parser.parse(tokens, { attachments }) }
}

marker.Lexer = Lexer
marker.Parser = Parser

export default marker
