import Quill from 'quill'
import lstorage from './utils/lstorage'
import Lexer from './lexer/blockLexer'
import Parser from './Parser'
import expandDelta from './expandDelta'

let str = '++quill++'
let tokens = Lexer.lex(str)
let dt = Parser.parse(tokens)
console.log(dt)

/**
 * quill
 */

// init quill
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

loadContent()

function loadContent() {
  let content = lstorage.get('content')
  console.log(content)
  if (content) {
    quill.setContents(content)
  }
}

// auto save
const Delta = Quill.import('delta')
let change = new Delta()
quill.on('text-change', function(delta) {
  change = change.compose(delta)
})

setInterval(function() {
  if (change.length() > 0) {
    let content = quill.getContents()
    save(content)
    change = new Delta()
  }
}, 5 * 1000)

function save(content) { // using localStorage
  lstorage.set('content', content)
}


/**
 * markdown
 */

const modal = document.querySelector('.modal-bg')
const mdBtn = document.querySelector('#js-md-btn')
const mdContent = document.querySelector('.md-content p')

mdBtn.addEventListener('click', () => {
  let deltas = quill.getContents()
  let md = expandDelta(deltas)
  console.log(md)
  
  mdContent.innerHTML = md.replace(/\n/g, '<br>')
  
  modal.setAttribute('data-state', 'show')
}, false)

modal.addEventListener('click', (e) => {
  if (e.path.indexOf(mdContent) === -1) {
    modal.setAttribute('data-state', 'hide')
  }
}, false)
