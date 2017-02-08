let lstorage = {
  set,
  get,
  clear
}

function set(key, value) {
  key = makeKey(key)
  localStorage.setItem(key, value)
}

function get(key) {
  key = makeKey(key)
  let value = localStorage.getItem(key)
  
  return parse(value)
}

function clear() {
  localStorage.clear()
}

function makeKey(key) {
  const prefix = 'quill.'
  return prefix + key
}

function stringify(value) {
  return JSON.stringify(value)
}

function parse(value) {
  if (!value) return null
  
  return value
}

export default lstorage