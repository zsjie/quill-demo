import Quill from 'quill'

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
ImageBlot.tagName = 'DIV'

export default ImageBlot
