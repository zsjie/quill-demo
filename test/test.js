import Parser from '../scripts/Parser.js'
import Lexer from '../scripts/lexer/blockLexer.js'
import marked from 'marked'

const str = `## 存储格式
使用 Markdown
> quote
## 安全性`

let tokens =Lexer.lex(str)
let delta = Parser.parse(tokens)
let html = marked(str)

console.log(tokens.reverse())
console.log(delta)
console.log(html)
