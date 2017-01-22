import Quill from 'quill'
import lstorage from './utils/lstorage'
import Lexer from './lexer/blockLexer'
import Parser from './Parser'
import marked from 'marked'
import expandDelta from './expandDelta'

let str = '++quill++'
let tokens = Lexer.lex(str)
let dt = Parser.parse(tokens)
console.log(dt)

let b = {"ops":[{"insert":"测试标题包含各种格式"},{"attributes":{"bold":true},"insert":"粗体"},{"attributes":{"italic":true},"insert":"斜体"},{"attributes":{"underline":true},"insert":"下划线"},{"attributes":{"link":"quilljs.com"},"insert":"链接"},{"attributes":{"header":1},"insert":"\n"},{"insert":"\n普通段落包含各种格式"},{"attributes":{"bold":true},"insert":"粗体"},{"attributes":{"italic":true},"insert":"斜体"},{"attributes":{"underline":true},"insert":"下划线"},{"attributes":{"link":"http://localhost:8080/quilljs.com"},"insert":"链接"},{"insert":"\n\n"},{"attributes":{"italic":true,"bold":true,"link":"quilljs.com"},"insert":"item1"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"underline":true},"insert":"item2"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"item3"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n普通段落\n\nitem1"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"item2"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"item3"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"\n"},{"attributes":{"italic":true},"insert":"引用"},{"insert":"里也会"},{"attributes":{"bold":true},"insert":"包含"},{"insert":"很多"},{"attributes":{"link":"quilljs.com"},"insert":"格式"},{"insert":"\\n- item1\\n- item2"},{"attributes":{"blockquote":true},"insert":"\n"}]}
console.log(expandDelta(b))

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
  theme: 'bubble' // or 'bubble'
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
  let content = lstorage.get('content')
  console.log(content)
  if (content) {
    quill.setContents(content)
  }
}

function save(content) { // using localStorage
  lstorage.set('content', content)
}
