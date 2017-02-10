import Parser from '../scripts/Parser.js'
import Lexer from '../scripts/lexer/blockLexer.js'
import marked from 'marked'

const str = `\`\`\`javascript
function foo ()  {
  let bar = ''
}
\`\`\``

let tokens = Lexer.lex(str)
let delta = Parser.parse(tokens)
let html = marked(str)

console.log(JSON.stringify(tokens))
console.log(delta)
console.log(html)
