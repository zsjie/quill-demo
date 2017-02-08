let formats = {
  header,
  list,
  blockquote,
  bold,
  italic,
  underline,
  link
}

export default function formatter (txt, format, value) {
  return formats[format](txt, value)
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
  let prefix = '> '
  txt = prefixWith(prefix, txt)
  
  return `\n${txt}\n`
}

// inline level

function bold (txt) {
  return `**${txt}**`
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
