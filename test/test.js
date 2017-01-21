const marked = require('marked')

console.log(marked('out list\n- item1\n- item2\n- item3\nout list'))

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
  "ops": [{
    "attributes": {"bold": true, "link": "quilljs.com"},
    "insert":     "cdd"
  }, {"attributes": {"link": "quilljs.com"}, "insert": " "}, {
    "attributes": {"italic": true, "link": "quilljs.com"},
    "insert":     "badecd"
  }, {"insert": "\n\n"}, {"attributes": {"italic": true}, "insert": "acd"}, {"insert": "\n"}]
}
