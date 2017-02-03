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
})

setTimeout(() => {
  let editorContainer = document.querySelector('#editor-container')
  let insertBtnsTmpl = document.querySelector('#insert-btns-tmpl')
  editorContainer.appendChild(insertBtnsTmpl.content)
  
  let showBtn = document.querySelector('.insert-btn-show')
  let insertBtns = document.querySelector('.insert-btns')
  let addons = document.querySelector('.insert-btn-addons')
  showBtn.addEventListener('click', (event) => {
    insertBtns.classList.toggle('active')
    showBtn.classList.toggle('insert-btn-show-rotate')
    addons.classList.toggle('insert-btn-addons-hide')
  }, false)
}, 0)


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
const mdContent = document.querySelector('.md-content')
const txt = mdContent.querySelector('p')

mdBtn.addEventListener('click', () => {
  let deltas = quill.getContents()
  let md = expandDelta(deltas)
  console.log(md)
  
  txt.innerHTML = md.replace(/\n/g, '<br>')
  
  modal.setAttribute('data-state', 'show')
}, false)

modal.addEventListener('click', (e) => {
  if (e.path.indexOf(mdContent) === -1) {
    modal.setAttribute('data-state', 'hide')
  }
}, false)

/**
 * tool button
 */

quill.on('selection-change', (range, oldRange, source) => {
  let insertBtns = document.querySelector('.insert-btns')
  let showBtn = document.querySelector('.insert-btn-show')
  let addons = document.querySelector('.insert-btn-addons')
  
  if (range && source === 'user') {
    let index = range.index
    let preIndex = index - 1 < 0 ? 0 : index - 1
    let inNewline = (index === 0 && quill.getText(index, 1) === '\n') ||
                    (index > 0 && quill.getText(preIndex, 2) === '\n\n')
    
    if (inNewline) {
      let pos = quill.getBounds(index)
      insertBtns.style.left = (pos.left - 60) + 'px'
      insertBtns.style.top = (pos.top - 12) + 'px'
      insertBtns.style.display = 'block'
      
      if (insertBtns.classList.contains('active')) {
        insertBtns.classList.toggle('active')
        showBtn.classList.toggle('insert-btn-show-rotate')
        addons.classList.toggle('insert-btn-addons-hide')
      }
    } else {
      insertBtns.style.display = 'none'
      addons.style.display = 'none'
    }
    
  } else { // editor blur
    // insertBtn.style.display = 'none'
  }
})

quill.on('text-change', (delta, oldDelta, source) => {
  let insertBtn = document.querySelector('.insert-btns')
  let range = quill.getSelection()
  
  if (range && source === 'user') {
    let index = range.index
    let preIndex = index - 1 < 0 ? 0 : index - 1
    let inNewline = (index === 0 && quill.getText(index, 1) === '\n') ||
      (index > 0 && quill.getText(preIndex, 2) === '\n\n')
    
    if (inNewline) {
      let pos = quill.getBounds(index)
      insertBtn.style.left = (pos.left - 60) + 'px'
      insertBtn.style.top = (pos.top - 12) + 'px'
      insertBtn.style.display = 'block'
    } else {
      insertBtn.style.display = 'none'
    }
    
  } else {
    insertBtn.style.display = 'none'
  }
})
