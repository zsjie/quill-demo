let t = {
  "ops": [
    {"insert": "Open your "},
    {
      "attributes": {"bold": true},
      "insert": "developer"
    },
    {"insert": " console and try out Quill’s APIs "},
    {
      "attributes": {"bold": true},
      "insert": "on your new bold and italic"
    },
    {"insert": " formats! Make sure to set the "},
    {
      "attributes": {"bold": true},
      "insert": "context"
    },
    {"insert": " to the correct CodePen iframe to be able to "},
    {
      "attributes": {"bold": true},
      "insert": "access"
    },
    {"insert": " the quill variable in the demo\n"}
  ]
}

let y = {
  "ops": [{"insert": "Open your "}, {
    "attributes": {"bold": true, "link": "https://www.google.com"},
    "insert":     "developer"
  }, {"insert": " console and try out Quill’s APIs "}, {
    "attributes": {"bold": true},
    "insert":     "on your new bold and italic"
  }, {"insert": " formats! Make sure to set the "}, {
    "attributes": {"bold": true},
    "insert":     "context"
  }, {"insert": " to the correct CodePen iframe to be able to "}, {
    "attributes": {"bold": true},
    "insert":     "access"
  }, {"insert": " the quill variable in the demo\n"}]
}

let token = {
  type: 'heading',
  depth: 2,
  text: 'foo',
  lang: 'java'
}

let types = [
  'space',
  'code',
  'heading',
  'table',
  'hr',
  'blockquote_start',
  'blockquote_end',
  'list_start',
  'loose_item_start',
  'list_item_start',
  'list_item_end',
  'list_end',
  'paragraph',
  'html',
  'text'
]

let possibleAttributes = [
  'text',
  'depth',
  'header',
  'cells',
  'align',
  'lang',
]

// tokens.links
