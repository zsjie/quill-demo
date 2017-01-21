import Quill from 'quill'
import lstorage from './utils/lstorage'
import Lexer from './lexer/blockLexer'
import Parser from './Parser'
import marked from 'marked'

const Delta = Quill.import('delta')
let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote', 'image']
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow' // or 'bubble'
});

let change = new Delta()
quill.on('text-change', function(delta) {
  change = change.compose(delta)
})

loadContent()

setInterval(function() {
  if (change.length() > 0) {
    let content = quill.getContents()
    save(content)
    change = new Delta()
  }
}, 5 * 1000)

function loadContent() {
  let str = '[**quill** *js*](quilljs.com)'
  let tokens = Lexer.lex(str)
  let content = Parser.parse(tokens)
  console.log(content)
  if (content) {
    quill.setContents(content)
  }
}

function save(content) { // using localStorage
  lstorage.set('content', content)
}
