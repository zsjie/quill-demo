# 对段落的识别

实现第一个功能，最基础的功能，对段落的识别。

## markdown 中的段落规则

这个功能的麻烦在于，对于一般的 markdown 引擎来说，段落之间的空行是会被忽略，段落内容会被放在一个 p 标签中，段间距通过 p 标签的间距来调整。但是 vana note 的编辑器来说，段落之间的空喊不能忽略，当用户从 markdown 模式切换到富文本模式，如果发现自己输入的空行消失了，他对这个产品的信任可能也会消失。

先来看看匹配段落的正则：

```javascript
let paragraph = /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/
```

为了方便理解，这是一个语义化的正则。段落的规则是：

1. 从字符串输入开始的位置进行匹配
2. 不包含或者只包含一个换行符 `\n`，即段落中可以换行，但不能有空行
3. 段落中不能包含 hr、heading、lheading、blockquote、tag、def 这几种格式，即段落内部不能有其他 block 格式
4. 段落结束的标记是任意个换行符，即零个或者多个均可

问题在于第四条规则，这个规则会把多个换行符『吃掉』，我们这样改一下段落的规则，第二和第四条

- 不包含换行符 `\n`，即段落中不可以换行
- 段落结束的标记是一个换行符或者字符串输入结束

所以正则变为这样：

```javascript
let paragraph = /^((?:[^\n]+(?!hr|heading|lheading|blockquote|tag|def))+)(?:\n|$)/
let newLine = /^\n+/
```

举个例子，一个字符串 `p\n\n\np\n`，段落正则会匹配到 `p\n` 和 `p\n`，空行正则会匹配的 `\n\n`

## 段落的 Delta

如果段落中没有任何行内格式，那么段落的 Delta 对象也是很简单：

```javascript
let delta = new Delta().insert('p\n\n\np\n') // {ops: [{insert: 'p\n\n\np'}]}
```

段落的 token

还是以字符串 `p\n\n\np` 为例：

```javascript
let tokens = Lexer.lex('p\n\n\np\n')
// [{"type":"paragraph","text":"p"},{"type":"newline","lines":2},{"type":"paragraph","text":"p"}]
```
