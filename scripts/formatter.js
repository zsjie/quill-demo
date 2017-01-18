export default {
  bold,
  italic,
  underline
}

function bold (txt) {
  return `**${txt}**`
}

function italic (txt) {
  return `*${txt}*`
}

function underline (txt) {
  return `++${txt}++`
}
