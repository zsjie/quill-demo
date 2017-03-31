const articleSample = `# Rich Text Editor Based on Quill

This rich text editor is based on Quill. With the support for the following format, users are allowed to create elegant document, which is easy to read and will be saved as **markdown text**. You can try it out now, what you input will be saved locally.

- title of different level
- paragraph
- bold text
- italic text
- underline text
- ordered and unordered list
- link
- quote block
- image
- code block

## Why Saved as Markdown Text

> Markdown is a lightweight markup language with plain text formatting syntax designed so that it can be converted to HTML and many other formats using a tool by the same name. Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor. -- wikipedia

Quill uses the format called Delta to describe its content, which is essentially JSON, and is human readable, yet easily parsible by machines. Delta is too redundant for preservation, though you can save it to the database directly. On the contrast, markdown text is lighter, space saving, and more portable:

\`\`\`
// in Delta format
﻿let deltas = {
  ops: [
    { insert: 'Rich Text Editor Based on Quill' },
    {
      insert: '\n',
      attributes: { header: 1 }
    }
  ]
}

// in markdown text, much lighter
let md = '# Rich Text Editor Based on Quill'
\`\`\`
## TODO

These features are coming very soon: 

1. LaTeX
1. Image
1. H3
1. Horizontal rule
`

export default articleSample
