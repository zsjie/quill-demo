import formatter from './formatter'

export default function (delta) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  let inCodeBlock = false
  
  ops.forEach((op, index) => {
    let txt = op.insert
    let attributes = op.attributes || {}
    let inCodeBlock = false
    
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
    } else if (txt === '\n') {
      console.log('line ends')
      Object.keys(attributes).forEach(name => {
        newLine = formatter(name, newLine, attributes[name])
      })
      let nextTwoOp = peek(ops, index, 2)
      let codeBlockEnd = inCodeBlock && typeof nextTwoOp === 'undefined'
                         // (typeof nextTwoOp === 'undefined' ||
                         // (nextTwoOp && !nextTwoOp.attributes) ||
                         // (nextTwoOp && nextTwoOp.attributes && !nextTwoOp.attributes['code-block']))
      if (codeBlockEnd) {
        txt += '```'
        console.log('code block end')
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
