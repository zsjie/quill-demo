import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

window.Lexer = Lexer
window.Parser = Parser

export default function (str) {
  let tokens = Lexer.lex(str)
  console.log(JSON.stringify(tokens))
  return { ops: Parser.parse(tokens) }
}
