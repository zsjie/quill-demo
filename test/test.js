const reg = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n|$)/
let md = '# title\n\nsometext'
console.log(reg.exec(md)[0].replace(/\n/g, '\\n'))

console.log('afaf')
