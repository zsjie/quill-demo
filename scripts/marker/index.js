import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

window.Lexer = Lexer
window.Parser = Parser

export default function (str) {
  let tokens = Lexer.lex(str)
  return Parser.parse(tokens)
}
