import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

export default function (str) {
  return Parser.parse(Lexer.lex(str))
}
