import formatter from './formatter'

export default function expand (delta) {
  let ops = delta.ops
  
  return ops.reduce((preVal, op) => {
    let txt = op.insert
    
    if (op.attributes.bold) {
      txt = formatter.bold(txt)
    }
    
    if (op.attributes.italic) {
      txt = formatter.italic(txt)
    }
    
    if (op.attributes.underline) {
      txt = formatter.underline(txt)
    }
    
    return preVal + txt
  }, '')
}
