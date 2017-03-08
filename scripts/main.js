// import Quill from 'quill'
import lstorage from './utils/lstorage'
import marker from './marker'
import expander from './expander'

/**
 * init highlight js
 */
hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'java', 'python']
});

/**
 * quill
 */

let quill = new Quill('#quill-editor', {
  modules: {
    syntax: true,
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block']
    ]
  },
  placeholder: '',
  theme: 'snow' // or 'bubble'
})

setTimeout(function () {
  // add markdown button
  let toolbar = document.querySelector('.ql-toolbar')
  let btn = document.createElement('a')
  btn.setAttribute('title', 'Toggle Markdown Mode')
  btn.innerHTML = 'Markdown'
  btn.className = 'toggle-markdown'
  btn.addEventListener('click', toggleMarkdown)
  toolbar.appendChild(btn)
}, 0)

let inMdMode = false
function toggleMarkdown () {
  let qEditor = document.querySelector('#quill-editor')
  let aEditor = document.querySelector('#ace-editor')
  let qlFormats = document.querySelectorAll('.ql-formats')
  let md, deltas
  
  if (inMdMode) {
    for (let i = 0; i < qlFormats.length; i++) {
      qlFormats[i].classList.remove('ql-formats-hide')
    }
    
    md = aceEditor.session.getValue()
    deltas = marker(md)
    console.log(deltas)
    quill.setContents(deltas)
    aEditor.classList.remove('ace-editor-show')
  } else {
    for (let i = 0; i < qlFormats.length; i++) {
      qlFormats[i].classList.add('ql-formats-hide')
    }
  
    deltas = quill.getContents()
    md = expander(deltas)
    aceEditor.session.setValue(md)
    
    aEditor.classList.add('ace-editor-show')
  }
  
  inMdMode = !inMdMode
}

// for debug
window.quill = quill
window.expander = expander
window.markder = marker

loadContent()

function loadContent() {
  let content = lstorage.get('content')
  if (content) {
    let deltas = marker(content)
    quill.setContents(deltas)
  }
}

// auto save
const Delta = Quill.import('delta')
let change = new Delta()
window.autoSave = false
quill.on('text-change', function(delta) {
  change = change.compose(delta)
})

setInterval(function() {
  if (change.length() > 0 && autoSave) {
    let content = quill.getContents()
    let md = expander(content)
    save(md)
    change = new Delta()
  }
}, 3 * 1000)

function save(content) { // using localStorage
  lstorage.set('content', content)
}
