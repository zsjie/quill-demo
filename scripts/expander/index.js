import formatter from './formatter'

export default function (delta, attachments) {
  let ops = delta.ops
  let out = ''
  let newLine = ''
  let listIndex = 0
  let cur
  
  while (cur = next(ops)) {
    let insert = cur.insert
    
    if (isBlockFmt(cur)) {
      let attrs = cur.attributes
      
      for (let attr of Object.keys(attrs)) {
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
            newLine = `\`\`\`\n${newLine}${insert}`
            
            while (peek(ops, 1) &&
                   peek(ops, 1).attributes &&
                   peek(ops, 1).attributes['code-block']
            ) {
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
    else if (isInlineFmt(cur)) {
      let attrs = cur.attributes
  
      for (let attr of Object.keys(attrs)) {
        insert = formatter(attr, insert, attrs[attr])
      }
      
      newLine += insert
    }
    else {
      let nextOp = peek(ops)
      if (typeof insert === 'string') {
        if (containLineBreak(insert) && !endWithLineBreak(insert)) {
          if (nextOp && isBlockFmt(nextOp) ) {
            let lastBreakPos = insert.lastIndexOf('\n')
            out += insert.slice(0, lastBreakPos + 1)
            newLine = insert.slice(lastBreakPos + 1)
            continue
          }
        }
        else {
          newLine += insert
        }
      }
      else {
        if (insert.image) { // image
          newLine += formatter('image', getFilename(attachments, insert.image))
        }
        else if (insert.formula) { // formula
          newLine += formatter('formula', insert.formula)
        }
      }
    }
    
    if (endWithLineBreak(newLine)) {
      out += newLine
      newLine = ''
    }
  }
  
  // handle singe op
  if (newLine !== '') {
    out += newLine
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

function isBlockFmt (op) {
  return typeof op.attributes !== 'undefined' &&
         op.insert.match(/^\n+$/)
}

function isInlineFmt (op) {
  return typeof op.attributes !== 'undefined' &&
         !op.insert.match(/^\n+$/)
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

function getFilename (attachments, url) {
  let filenames = Object.keys(attachments)
  for (let filename of filenames) {
    if (attachments[filename].url === url) {
      return filename
    }
  }
  
  return null
}
