import Quill from 'quill'
import lstorage from './utils/lstorage'
import Lexer from './lexer/blockLexer'
import Parser from './Parser'
import marked from 'marked'

const Delta = Quill.import('delta')
let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{
        header: [1, 2, false]
      }],
      ['bold', 'italic', 'link'],
      ['image', { list: 'ordered' }]
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
  let content = {
    ops: [{"insert":"Open your "},{"insert":"developer","attributes":{"bold":true}},{"insert":" console and try out Quill’s APIs "},{"insert":"on your new bold and italic","attributes":{"bold":true}},{"insert":" formats"},{"insert":"! Make sure to set the "},{"insert":"context","attributes":{"bold":true}},{"insert":" to the correct CodePen iframe to be able to "},{"insert":"access","attributes":{"bold":true}},{"insert":" the quill variable in the demo"}]
  }
  if (content) {
    quill.setContents(content)
  }
}

function save(content) { // using localStorage
  lstorage.set('content', content)
}

let str = 'Open your ***developer*** console and try out Quill’s APIs **on your new bold and italic** formats! Make sure to set the **context** to the correct CodePen iframe to be able to **access** the quill variable in the demo'

console.log(Parser.parse(Lexer.lex('***c***')))
