import Quill from 'quill'
import lstorage from './utils/lstorage'
import Lexer from './lexer/blockLexer'
import Parser from './Parser.js'
import expandDelta from './expandDelta'

let str = `--`
let tokens = Lexer.lex(str)
let dt = Parser.parse(tokens)
// console.log(dt)

/**
 * customize image blot
 */
let BlockEmbed = Quill.import('blots/block/embed')
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create()
    node.className = 'insert-images'
    
    let imgBox = document.createElement('div')
    let image = document.createElement('img')
    image.setAttribute('alt', value.alt)
    image.setAttribute('src', value.url)
    
    imgBox.appendChild(image)
    node.appendChild(imgBox)
  
    setTimeout(() => {
      image.classList.add('in')
    }, 30)
    
    node.addEventListener('click', (e) => {
      if (!node.classList.contains('insert-images-active')) {
        node.classList.add('insert-images-active')
      }
    })
    
    return node
  }
  
  static value(node) {
    let image = node.querySelector('img')
    
    return {
      alt: image.getAttribute('alt'),
      url: image.getAttribute('src')
    }
  }
}
ImageBlot.blotName = 'image'
ImageBlot.tagName = 'div'
Quill.register(ImageBlot)

/**
 * init highlight js
 */
hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'java', 'python']
});

/**
 * quill
 */

// init quill
let quill = new Quill('#editor-container', {
  modules: {
    syntax: true,
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote', 'image', 'code-block']
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow' // or 'bubble'
})

window.Quill = Quill
window.quill = quill

setTimeout(() => {
  // add show btns
  let editorContainer = document.querySelector('#editor-container')
  let insertBtnsTmpl = document.querySelector('#insert-btns-tmpl')
  editorContainer.appendChild(insertBtnsTmpl.content)
  
  let showBtn = document.querySelector('.insert-btn-show')
  let insertBtns = document.querySelector('.insert-btns')
  let addons = document.querySelector('.insert-btn-addons')
  showBtn.addEventListener('click', (event) => {
    insertBtns.classList.toggle('active')
    showBtn.classList.toggle('insert-btn-show-rotate')
    addons.classList.toggle('insert-btn-addons-show')
  }, false)
  
  // add image input
  let fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')
  fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml')
  fileInput.classList.add('ql-image')
  fileInput.addEventListener('change', () => {
    if (fileInput.files != null && fileInput.files[0] != null) {
      let file = fileInput.files[0]
      let reader = new FileReader()
      let range
      reader.onload = (e) => {
        range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', {
          alt: 'Quill Cloud',
          url: e.target.result
        }, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        fileInput.value = ""
      }
      reader.readAsDataURL(file)
      
      // upload file
      let formData = new FormData()
      formData.append('upload[]', file, file.name)
      $.ajax({
        url: 'http://localhost:3030/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          console.log(data)
          console.log(quill.getLeaf(range.index))
          let insertImage = quill.getLeaf(range.index)[0].domNode
          let imgTmp = new Image()
          imgTmp.onload = function () {
            let dataUrlImg = insertImage.querySelector('img')
            // dataUrlImg.style.opacity = 0
            dataUrlImg.setAttribute('src', data.url)
          }
          imgTmp.src = data.url
        }
      })
    }
  })
  editorContainer.appendChild(fileInput)
  
  let insertImageBtn = document.querySelector('.insert-image')
  insertImageBtn.addEventListener('click', () => {
    fileInput.click()
  })
}, 0)


loadContent()

function loadContent() {
  let content = lstorage.get('content')
  if (content) {
    quill.setContents(Parser.parse(Lexer.lex(content)))
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
    let md = expandDelta(content)
    save(md)
    change = new Delta()
  }
}, 3 * 1000)

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
  console.log(JSON.stringify(md))
  
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
    let contents = quill.getContents(index, 2)
    let leaf = quill.getLeaf(index)
    let preIndex = index - 1 < 0 ? 0 : index - 1
    let inNewline = (index === 0 && quill.getText(index, 1) === '\n') ||
                    (index > 0 && quill.getText(preIndex, 2) === '\n\n')
    let nextContent = contents.ops[0]
    let preContent = contents.ops.reverse()[0]
    let inImage = typeof preContent.insert.image !== 'undefined' ||
                  typeof nextContent.insert.image !== 'undefined' ||
                  leaf[0].constructor === ImageBlot.prototype.constructor
    
    console.log(index, leaf[0].constructor === ImageBlot.prototype.constructor)
    
    if (inNewline) {
      let pos = quill.getBounds(index)
      insertBtns.style.left = (pos.left - 60) + 'px'
      insertBtns.style.top = (pos.top - 12) + 'px'
      insertBtns.style.display = 'block'
      
      if (insertBtns.classList.contains('active')) {
        insertBtns.classList.toggle('active')
        showBtn.classList.toggle('insert-btn-show-rotate')
        addons.classList.toggle('insert-btn-addons-show')
      }
    } else if (inImage) {
      let imageBlot = leaf[0].constructor === ImageBlot.prototype.constructor
                      ? leaf[0]
                      : quill.getLeaf(index + 1)[0]
      let insertImage = imageBlot.domNode
      insertImage.classList.add('insert-images-active')
    } else {
      insertBtns.style.display = 'none'
      
      let images = document.querySelectorAll('.insert-images')
      if (images) {
        for (let i = 0, l = images.length; i < l; i++) {
          images[i].classList.remove('insert-images-active')
        }
      }
    }
    
  }
})

quill.on('text-change', (delta, oldDelta, source) => {
  let insertBtns = document.querySelector('.insert-btns')
  let addons = document.querySelector('.insert-btn-addons')
  let showBtn = document.querySelector('.insert-btn-show')
  let range = quill.getSelection()
  
  console.log(quill.getContents(range.index - 5, 5))
  
  if (range && source === 'user') {
    let index = range.index
    let preIndex = index - 1 < 0 ? 0 : index - 1
    let nextIndex = index + 1
    let inNewline = (index === 0 && quill.getText(index, 1) === '\n') ||
                    (index > 0 && quill.getText(preIndex, 2) === '\n\n') ||
                    (index > 0 && quill.getText(index, 2) === '\n\n')
    
    if (inNewline) {
      let pos = (index > 0 && quill.getText(index, 1) === '\n')
                ? quill.getBounds(nextIndex)
                : quill.getBounds(index)
      insertBtns.style.left = (pos.left - 60) + 'px'
      insertBtns.style.top = (pos.top - 12) + 'px'
      insertBtns.style.display = 'block'
    
      if (insertBtns.classList.contains('active')) {
        insertBtns.classList.toggle('active')
        showBtn.classList.toggle('insert-btn-show-rotate')
        addons.classList.toggle('insert-btn-addons-show')
      }
    } else {
      insertBtns.style.display = 'none'
    }
    
  } else {
    insertBtns.style.display = 'none'
  }
})

let startBtn = document.querySelector('button.start')
let resetBtn = document.querySelector('button.reset')
let animatedImg = document.querySelector('.image-container img')
let scaleInput = document.querySelector('#start-scale')
let opacityInput = document.querySelector('#start-opacity')
let durationInput = document.querySelector('#duration')
startBtn.addEventListener('click', () => {
  animatedImg.style.transform = 'scale(1)'
  animatedImg.style.opacity = '1'
})
resetBtn.addEventListener('click', () => {
  animatedImg.style.transform = 'scale(' + scaleInput.value + ')'
  animatedImg.style.opacity = opacityInput.value
  animatedImg.style.transition = 'all ease ' + durationInput.value + 's'
})

let uploadBtn = document.querySelector('#upload-btn')
uploadBtn.addEventListener('click', (e) => {
  upload()
})

// https://github.com/coligo-io/file-uploader
function upload () {
  let input = document.querySelector('#upload-input')
  
  if (input.files != null && input.files[0] != null) {
    let formData = new FormData()
    let file = input.files[0]
    
    formData.append('upload[]', file, file.name)
    $.ajax({
      url: 'http://localhost:3030/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        console.log(data)
      }
    })
  } else {
    console.log('no file')
  }
}
