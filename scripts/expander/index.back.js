import formatter from './formatter'

export default function (delta) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  let inCodeBlock = false
  let inList = false
  
  let listIndex = 0
  let output = ''
  
  for (let i = 0, l = ops.length; i < l; i++) {
    let insert = op.insert
    let attributes = op.attributes || {}
    
    for (let attr of Object.keys(attributes)) {
      switch (attr) {
        case 'list':
          listIndex++
          formatter('list', insert, attributes[attr], listIndex)
          break
        default:
          formatter(attr, insert, attributes[attr])
      }
    }
  }
  
  ops.forEach((op, index) => {
    let txt = op.insert
    let attributes = op.attributes || {}
    
    if (typeof txt === 'string' && txt !== '\n') {
      let lastNCIndex = txt.lastIndexOf('\n')
      
      if (lastNCIndex !== -1) {
        newLine += txt.slice(0, lastNCIndex + 1)
        out += newLine
        
        let nextOp = peek(ops, index)
        if (nextOp && nextOp.attributes && nextOp.attributes['code-block']) {
          newLine = '```\n'
          inCodeBlock = true
        } else {
          newLine = ''
        }
        txt = txt.slice(lastNCIndex + 1)
      }
      
      Object.keys(attributes).forEach(name => {
        txt = formatter(name, txt, attributes[name])
      })
      newLine += txt
    } else if (typeof txt === 'object' && txt.image) {
      txt = formatter('image', txt.image.url, txt.image.title, txt.image.alt)
      newLine += txt
    } else if (/\n+/.test(txt)) { // /\n+/
      Object.keys(attributes).forEach(name => {
        newLine = formatter(name, newLine, attributes[name])
      })
      let nextTwoOp = peek(ops, index, 2)
      let codeBlockEnd = inCodeBlock &&
        (!nextTwoOp ||
        (nextTwoOp && !nextTwoOp.attributes) ||
        (nextTwoOp && nextTwoOp.attributes && !nextTwoOp.attributes['code-block']))
      if (codeBlockEnd) {
        txt += '```\n'
        inCodeBlock = false
      }
      out += (newLine + txt)
      newLine = ''
    }
  })
  
  return out
}

/**
 * Preview Next Operation
 */
function peek (ops, index, step) {
  step = step ? step: 1
  return ops[index + step]
}