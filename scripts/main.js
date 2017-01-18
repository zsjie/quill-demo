import Quill from 'quill'
import lstorage from './utils/lstorage'

const Delta = Quill.import('delta')
let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{
        header: [1, 2, false]
      }],
      ['bold', 'italic', 'underline'],
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
  let content = lstorage.get('content')
  if (content) {
    quill.setContents(content)
  }
}

function save(content) { // using localStorage
  lstorage.set('content', content)
}
