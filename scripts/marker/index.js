import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

if (typeof window !== 'undefined') {
  window.Lexer = Lexer
  window.Parser = Parser
}

export default function (str) {
  let tokens = Lexer.lex(str)
  return { ops: Parser.parse(tokens) }
}
