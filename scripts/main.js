// import Quill from 'quill'
import lstorage from './utils/lstorage'
import articleSample from './data/article-sample'
import marker from './marker'
import expander from './expander'

const Delta = Quill.import('delta')

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
      ['link', 'blockquote', 'code-block']
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
  let qEditor = document.querySelector('.ql-editor')
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
    qEditor.classList.remove('ql-editor-hide')
    aEditor.classList.remove('ace-editor-show')
  } else {
    for (let i = 0; i < qlFormats.length; i++) {
      qlFormats[i].classList.add('ql-formats-hide')
    }
  
    deltas = quill.getContents()
    md = expander(deltas)
    aceEditor.session.setValue(md)
  
    qEditor.classList.add('ql-editor-hide')
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
  let deltas
  if (content) {
    deltas = new Delta()
      .insert('foo')
      .insert('\n', { list: 'bullet' })
      .insert('bar')
      .insert('\n', { list: 'bullet' })
    quill.setContents(deltas)
  } else {
    deltas = marker(articleSample)
    quill.setContents(deltas)
  }
}

// auto save
let change = new Delta()
window.autoSave = true
quill.on('text-change', function(delta) {
  change = change.compose(delta)
})

setInterval(function() {
  if (inMdMode) {
    if (autoSave) {
      let md = aceEditor.getValue()
      save(md)
    }
  } else {
    if (change.length() > 0 && autoSave) {
      let content = quill.getContents()
      let md = expander(content)
      save(md)
      change = new Delta()
    }
  }
}, 2 * 1000)

function save(content) { // using localStorage
  lstorage.set('content', content)
}
