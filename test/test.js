const marked = require('marked')

let s = '######'
console.log(s.slice(0, 5))

let a = {
  "ops": [
    {"insert": "out list\n\nitem 1"},
    {
      "attributes": {"list": "bullet"},
      "insert":     "\n"
    },
    {"insert": "item 2"},
    {
      "attributes": {"list": "bullet"},
      "insert":     "\n"
    },
    {"insert": "item 3"},
    {
      "attributes": {"list": "bullet"},
      "insert":     "\n"
    },
    {"insert": "\nout list\n"}
  ]
}

let b = {
  "ops": [{"insert": "测试标题含有各种格式"}, {
    "attributes": {"bold": true},
    "insert":     "粗体"
  }, {"attributes": {"italic": true}, "insert": "斜体"}, {
    "attributes": {"link": "quilljs.com"},
    "insert":     "链接"
  }, {"attributes": {"header": 1}, "insert": "\n"}]
}