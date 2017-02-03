# Quill 中的事件

同一个事件，有可能是用户触发的，也有可能是 quill 在内部调用了自身 api 触发的。所以 Quill 使用 `source` 字段来标识事件源是 `user` 还是 `api`。

## text-change

用户以下操作会触发 `text-change` 事件：

- 打字输入内容
- 通过 toolbar 格式化文字
- 使用快捷键撤销
- 使用系统的修正拼写

### 回调函数

```javascript
handler(delta: Delta, oldContents: Delta, source: String)
```

### 举个例子

```javascript
quill.on('text-change', function(delta, oldDelta, source) {
  if (source == 'api') {
    console.log("An API call triggered this change.");
  } else if (source == 'user') {
    console.log("A user action triggered this change.");
  }
});
```

## selection-change

当用户或者 API 引起选中的变化就会抛出该事件，事件包含一个代表选中范围的 rang 对象。rang 为 null 说明选中丢失了，通常是由 editor 失焦引起的。你也可以检查 range 是否为 null 来将这个事件当做焦点变化事件来使用。

### 回调函数

```javascript
handler(range: { index: Number, length: Number },
        oldRange: { index: Number, length: Number },
        source: String)
```

### 举个例子

```javascript
quill.on('selection-change', function(range, oldRange, source) {
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is on', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted', text);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});
```


