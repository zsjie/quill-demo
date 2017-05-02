import formatter from './formatter'

export default function (delta) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  
  let listIndex = 0
  
  for (let i = 0, l = ops.length; i < l; i++) {
    let op = ops[i]
    let insert = op.insert
    
    if (isFormatOp(op)) {
      let attributes = op.attributes
      
      for (let attr of Object.keys(attributes)) {
        switch (attr) {
          case 'header':
            newLine = formatter('header', newLine, attributes[attr])
            break
          case 'list':
            listIndex++
            let listType = attributes[attr]
            newLine = formatter('list', newLine, listType, listIndex)
            
            // handle empty list item
            if (containEmptyListItem(op)) {
              let tmp = insert.slice(1)
              let emptyItemCount = tmp.length
              for (let j = 0; j < emptyItemCount; j++) {
                listIndex++
                let prefix = listType === 'ordered' ? listIndex + '. ' : '- '
                newLine += (prefix + '\n')
              }
            }
            
            if (isLastItem(ops, i)) {
              listIndex = 0
            }
            
            break
        }
      }
    }
    else {
      let nextOp = peek(ops, i)
      if (containLineBreak(insert) && !endWithLineBreak(insert)) {
        if (nextOp && isFormatOp(nextOp) ) {
          let lastBreakPos = insert.lastIndexOf('\n')
          out += insert.slice(0, lastBreakPos + 1)
          newLine = insert.slice(lastBreakPos + 1)
          continue
        }
      } else {
        newLine += insert
      }
    }
    
    if (endWithLineBreak(newLine)) {
      out += newLine
      newLine = ''
    }
  }
  
  // handle unnecessary blank line added by Quill
  if (endWithLineBreak(out)) {
    out = out.slice(0, -1)
  }
  
  return out
}

/**
 * Preview Next Operation
 */
function peek (ops, index, step) {
  step = step ? step: 1
  return ops[index + step]
}

/**
 * check if an 'op' is an formatting operation:
 * { insert: '\n', attributes: { ... } }
 */
function isFormatOp (op) {
  return op.insert.match(/\n+/) &&
         op.attributes !== undefined
}

function endWithLineBreak (str) {
  return str.charAt(str.length - 1) === '\n'
}

function containLineBreak (str) {
  return str.indexOf('\n') !== -1
}

function containEmptyListItem (op) {
  return op.insert.match(/\n{2,}/) && op.attributes.list
}

function isLastItem (ops, index) {
  let nextOp = peek(ops, index)
  let nextTwoOp = peek(ops, index, 2)
  return !nextOp ||
         containLineBreak(nextOp.insert) ||
         !nextTwoOp ||
         !nextTwoOp.attributes ||
         !nextTwoOp.attributes.list
}
