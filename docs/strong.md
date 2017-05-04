# 对粗体的识别

## markdown 中粗体的规则

```javascript
let strong = /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/ 
```

即可以通过两个 _ 或者 * 将需要强调的文字包围。

```
__strong__
**string**
```

## 粗体的 delta

```javascript
let delta = new Delta().insert('foo', { bold: true })
```

## 粗体的 token

```javascript
let tokens = Lexer.lex('**foo**')
//
```
