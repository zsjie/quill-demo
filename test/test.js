const marked = require('marked')
const Delta = require('quill-delta')

let str = '\na'

function Store () {
  this.db = null
  
  let self = this
  setTimeout(() => {
    self.db = {
      foo: 'bar'
    }
  }, 100)
  
  return this
}

let store = new Store()

console.log(store.db)
setTimeout(() => {
  console.log(store.db)
}, 1000)
