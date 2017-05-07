import Lexer from './lexer/blockLexer'
import Parser from './parser.js'

async function marker (str, attachments) {
  let tokens = Lexer.lex(str)
let ops    = await Parser.parse(tokens, {attachments})
  return { ops }
}

marker.Lexer = Lexer
marker.Parser = Parser

export default marker
