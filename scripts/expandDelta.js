import formatter from './formatter'

export default function (delta) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  
  ops.forEach(op => {
    let txt = op.insert
    let attributes = op.attributes || {}
    
    if (txt !== '\n') {
      let lastNCIndex = txt.lastIndexOf('\n')
      
      if (lastNCIndex !== -1) {
        newLine += txt.slice(0, lastNCIndex + 1)
        out += newLine
        newLine = ''
        txt = txt.slice(lastNCIndex + 1)
      }
      
      Object.keys(attributes).forEach(name => {
        txt = formatter(txt, name, attributes[name])
      })
      newLine += txt
    } else {
      Object.keys(attributes).forEach(name => {
        newLine = formatter(newLine, name, attributes[name])
      })
      out += (newLine + txt)
      newLine = ''
    }
  })
  
  return out
}
