let formats = {
  header,
  list,
  blockquote,
  bold,
  strike,
  italic,
  underline,
  link,
  image,
  'code-block': fences
}

export default function formatter (format, txt, value1, value2) {
  return formats[format](txt, value1, value2)
}

// block level

function header (txt, level) {
  let symbol = '######'
  let prefix = symbol.slice(0, level) + ' '
  
  return prefixWith(prefix, txt)
}

function list (txt, type) {
  let prefix = type === 'ordered' ? '1. ' : '- '
  
  return prefixWith(prefix, txt)
}

function blockquote (txt) {
  return `> ${txt}\n`
}

function fences (txt) {
  return txt
}

// inline level

function bold (txt) {
  return `**${txt}**`
}

function strike (txt) {
  return `~~${txt}~~`
}

function italic (txt) {
  return `*${txt}*`
}

function underline (txt) {
  return `++${txt}++`
}

function link (title, url) {
  return `[${title}](${url})`
}

function image (href, title, alt) {
  return title ? `![${alt}](${href} "${title}")`
               : `![${alt}](${href})`
}

// helpers

function prefixWith (prefix, txt) {
  if (txt.startsWith('\n')) {
    for (let i = 0, l = txt.length; i < l; i++) {
      if (txt.charAt(i) !== '\n') {
        return prefix + txt.slice(i)
      }
    }
  }
  
  return prefix + txt
}
