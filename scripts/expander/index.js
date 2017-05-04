import formatter from './formatter'

export default function (delta) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  let listIndex = 0
  let cur
  
  while (cur = next(ops)) {
    let insert = cur.insert
    
    if (isFormatOp(cur)) {
      let attrs = Object.keys(cur.attributes)
      
      for (let attr of attrs) {
        switch (attr) {
          case 'blockquote':
            newLine += insert
            newLine = formatter(attr, newLine)
            break
          case 'header':
            newLine = formatter(attr, newLine, attrs[attr])
            break
          case 'list':
            listIndex++
            let listType = attrs[attr]
            newLine = formatter(attr, newLine, listType, listIndex)
            
            // handle empty list item
            if (containEmptyListItem(cur)) {
              let tmp = insert.slice(1)
              let emptyItemCount = tmp.length
              for (let j = 0; j < emptyItemCount; j++) {
                listIndex++
                let prefix = listType === 'ordered' ? listIndex + '. ' : '- '
                newLine += (prefix + '\n')
              }
            }
            
            if (isLastItem(ops)) {
              listIndex = 0
            }
            
            break
          case 'code-block':
            newLine = `\`\`\`\n${newLine}${cur.insert}`
            
            while (peek(ops, 1) && peek(ops, 1).attributes['code-block']) {
              let nextOp = next(ops)
              let nextTwoOp = next(ops)
              
              newLine += (nextOp.insert + nextTwoOp.insert)
            }
            
            newLine = `${newLine}\`\`\`\n`
            out += newLine
            newLine = ''
            
            break
        }
      }
    }
    else {
      let nextOp = peek(ops)
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
  
  return out
}

/**
 * Preview Next Operation
 */
function peek (ops, step) {
  if (step) {
    return ops[step]
  }
  
  return ops[0] || 0
}

function next (ops) {
  return ops.shift()
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

function isLastItem (ops) {
  let nextOp = peek(ops)
  let nextTwoOp = peek(ops, 1)
  return !nextOp ||
         containLineBreak(nextOp.insert) ||
         !nextTwoOp ||
         !nextTwoOp.attributes ||
         !nextTwoOp.attributes.list
}
