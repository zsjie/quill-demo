for (let i = 0, l = ops.length; i < l; i++) {
  let op = ops[i]
  let insert = op.insert
  
  if (isFormatOp(op)) {
    let attributes = op.attributes
    
    for (let attr of Object.keys(attributes)) {
      switch (attr) {
        case 'blockquote':
          newLine += op.insert
          newLine = formatter(attr, newLine)
          break
        case 'header':
          newLine = formatter(attr, newLine, attributes[attr])
          break
        case 'list':
          listIndex++
          let listType = attributes[attr]
          newLine = formatter(attr, newLine, listType, listIndex)
          
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
        case 'code':
          
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