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

let quill = new Quill('#editor-container', {
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
  placeholder: 'Compose an epic...',
  theme: 'snow' // or 'bubble'
})

// for debug
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
