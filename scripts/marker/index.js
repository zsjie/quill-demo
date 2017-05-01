import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

if (typeof window !== 'undefined') {
  window.Lexer = Lexer
  window.Parser = Parser
}

function marker (str) {
  let tokens = Lexer.lex(str)
  return { ops: Parser.parse(tokens) }
}

marker.Lexer = Lexer
marker.Parser = Parser

export default marker
