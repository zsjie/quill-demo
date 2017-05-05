export function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function replace(regex, opt) {
  regex = regex.source
  opt = opt || ''
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt)
    val = val.source || val
    val = val.replace(/(^|[^\[])\^/g, '$1')
    regex = regex.replace(name, val)
    return self
  }
}

export function merge(obj) {
  let i = 1
  let target, key
  
  for (; i < arguments.length; i++) {
    target = arguments[i]
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key]
      }
    }
  }
  
  return obj
}

export function emptyLines (n) {
  let text = ''
  for (let i = 0; i < n; i++) {
    text += '\n'
  }
  
  return text
}

export function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

/**
 * merge neighboring ops which have no attributes:
 * [{"insert":"\n"}, {"insert":"b"}, ...] => [{"insert":"\nb"}, ...]
 */

export function mergeOps (out) {
  let result = []
  let cur
  
  while (cur = next(out)) {
    if (!noAttributes(cur)) {
      result.push(cur)
      continue
    }
    
    while (noAttributes(peek(out))) {
      cur.insert += next(out).insert
    }
    
    result.push(cur)
  }
  
  return result
}

function noAttributes (op) {
  return typeof op.attributes === 'undefined' &&
    typeof op.insert === 'string'
}

function peek (out) {
  return out[0] || 0
}

function next (out) {
  return out.shift()
}
