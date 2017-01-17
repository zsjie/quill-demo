;
(function(w) {
  let lstorage = {
    set,
    get,
    clear
  }

  w.lstorage = lstorage

  function set(key, value) {
    key = makeKey(key)
    value = stringify(value)
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
    let numReg = new RegExp('[0-9]+', 'g')
    let jsonReg = new RegExp('[\{\[](.)*[\}\]', 'g')

    if (!value) return null

    if (value.match(numReg)) {
      return parseInt(value, 10)
    }

    if (value.match(jsonReg)) {
      return JSON.parse(value)
    }
  }

})(window)