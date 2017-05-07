import lstorage from './utils/lstorage'
import articleSample from './data/article-sample'
import marker from './marker'
import expander from './expander'
import DB from './db'

const db = new DB()
const Delta = Quill.import('delta')
const ATTACHMENTS = {}

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
    formula: true,
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'blockquote', 'code-block', 'formula']
    ]
  },
  placeholder: '',
  theme: 'snow'
})

let toolbar = quill.getModule('toolbar')
let toolBarContainer = document.querySelector('.ql-toolbar')
let body = document.querySelector('body')
toolbar.addHandler('image', () => {
  let fileInput = toolBarContainer.querySelector('input.ql-image[type=file]')
  if (fileInput === null) {
    fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
    fileInput.classList.add('ql-image')
    fileInput.addEventListener('change', async () => {
      if (fileInput.files !== null && fileInput.files[0] !== null) {
        let file = fileInput.files[0]
        
        let fileId = await db.addFile({
          filename: file.name,
          file
        })
        console.log(fileId)
  
        let img = document.createElement('img')
        img.onload = () => {
          let range = quill.getSelection(true)
          quill.updateContents(new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert({ image: img.src })
            , Quill.sources.USER)
          
          URL.revokeObjectURL(img.src)
          fileInput.value = ""
        }
        let objUrl = URL.createObjectURL(file)
        img.src = objUrl
        console.log(img.src)
        
        ATTACHMENTS[file.name] = {
          name: file.name,
          url: objUrl,
          fileId
        }
      }
    })
    toolBarContainer.appendChild(fileInput)
  }
  fileInput.click()
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
async function toggleMarkdown() {
  let qEditor   = document.querySelector('.ql-editor')
  let aEditor   = document.querySelector('#ace-editor')
  let qlFormats = document.querySelectorAll('.ql-formats')
  let md, deltas
  
  if (inMdMode) {
    for (let i = 0; i < qlFormats.length; i++) {
      qlFormats[i].classList.remove('ql-formats-hide')
    }
    
    md     = aceEditor.session.getValue()
    deltas = await marker(md, ATTACHMENTS)
    quill.setContents(deltas)
    qEditor.classList.remove('ql-editor-hide')
    aEditor.classList.remove('ace-editor-show')
  } else {
    for (let i = 0; i < qlFormats.length; i++) {
      qlFormats[i].classList.add('ql-formats-hide')
    }
    
    deltas = quill.getContents()
    md     = expander(deltas, ATTACHMENTS)
    aceEditor.session.setValue(md)
    
    qEditor.classList.add('ql-editor-hide')
    aEditor.classList.add('ace-editor-show')
  }
  
  inMdMode = !inMdMode
}

// for debug
window.db = db
window.quill = quill
window.expander = expander
window.markder = marker

loadContent().then(() => {
  console.log('content loaded')
})

async function loadContent() {
  let content = lstorage.get('content')
  let deltas = await marker(articleSample)
  quill.setContents(deltas)
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
