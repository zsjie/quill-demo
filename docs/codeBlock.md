# 对代码块的识别

## markdown 中代码块的规则

```javascript
let codeBlock = /^( {4}[^\n]+\n*)+/
let fences = /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/
```

目前我们用的 markdown 引擎支持两种风格的代码块声明方式，一般 markdown 的 codeBlock 和 GitHub flavor markdown 的 fences。

codeBlock 风格的规则相对简单，代码块中的每一行都必须以四个空格开始，直到某一行不再以四个空格开始。

fences 风格的规则：

- 从字符开始输入的位置进行匹配
- 开始标记是三个以上的 ` 或者 ~ 符号，开始标记后可以声明代码块的语言类型
- 代码块的内容可以是任意字符
- 结束的标记是和开始标记相同个数的 ` 或者 ~ 符号

## 代码块的 delta

```javascript
let delta = new Delta()
  .insert('some code')
  .insert('\n', { 'code-block': true })
  .insert('some code')
  .insert('\n', { 'code-block': true })
```

这种 delta 风格和 codeBlock 风格很像，都是逐行声明该行是代码块

## 代码块的 token

```javascript
let md1 = '    some code\n    some code\n'
Lexer.lex(md1)
// [
//   {"type":"code","text":"some code\nsome code"}
// ]

let md2 = '```javascript\nsome code\nsome code\n```'
Lexer.lex(md2)
// [
//   {"type":"code","lang":"javascript","text":"some code\nsome code"}
// ]
```

## 空行问题

markdown 会把代码块后面的空行忽略掉，这个和识别段落时遇到的问题是一样的。为了可以保留空行，我们将正则修改如下：

```javascript
let codeBlock = /^( {4}[^\n]+\n?)+/
let fences = /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n|$)/
```