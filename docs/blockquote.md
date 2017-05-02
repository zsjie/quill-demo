# 对引用的识别

实现对引用的识别

## markdown 引用的规则

这是引用的正则表达式：

```javascript
let blockquote = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/
```

1. 从字符串输入开始的位置进行匹配
2. `>` 符号是引用开始的标记，`>` 之前可以有任意个空格
3. 引用内容中允许换行，但不允许空行，否则空行后的内容会被认为不是引用内容的一部分
4. 如果空行后紧接着出现 `>` 符号，那么两个 `>` 之间的空行会被认为是引用内容的一部分
5. 引用内容中不能包含 def 格式
6. 引用结束的标记是空行，而且空行后没有紧接出现 `>` 符号

## 引用的 Delta

只有段落时：

```javascript
let delta = new Delta()
  .insert('p')
  .insert('\n\n', { blockquote: true })
  .insert('p')
  .insert('\n', { blockquote: true })
```

## 引用的 token

只有段落时：

```javascript
let tokens = Lexer.lex('> p\n\n> p\n')
// [{"type":"blockquote_start"},{"type":"paragraph","text":"p"},{"type":"newline","lines":1},{"type":"paragraph","text":"p"},{"type":"blockquote_end"}]
```
