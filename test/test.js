const list1 = /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/
const list2 = /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/

const item1 = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/
const item2 = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/