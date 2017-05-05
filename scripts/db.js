function Store () {
    this.DB_NAME = 'vana-notes'
    this.DB_VERSION = 5
    this.DB_STORE_NAME = 'attachments'
  
  this.db = null
  let self = this
  
  console.debug("initDb ...");
  let req = indexedDB.open(self.DB_NAME,self.DB_VERSION)
  req.onsuccess = function (evt) {
    self.db = this.result
    console.debug("initDb DONE")
  }
  req.onerror = function (evt) {
    console.error("initDb:", evt.target.errorCode)
  }
  
  req.onupgradeneeded = function (evt) {
    console.debug("initDb.onupgradeneeded")
    let store = evt.currentTarget.result.createObjectStore(
      self.DB_STORE_NAME, { keyPath: 'id', autoIncrement: true })
    
    store.createIndex('filename', 'filename', { unique: false })
    store.createIndex('digest', 'digest', { unique: false })
    store.createIndex('deleted', 'deleted', { unique: false })
    store.createIndex('uploaded', 'uploaded', { unique: false })
    store.createIndex('seq', 'seq', { unique: false })
  
  }
  
  return this
}

Store.prototype.getFile = (key, cb) => {
  let tx = this.db.transaction(this.DB_STORE_NAME, 'readonly')
  let store = tx.objectStore(this.DB_STORE_NAME)
  let req = store.get(key)
  
  req.onsuccess = (evt) => {
    let value = evt.target.result
    if (value)
      cb(value.file)
  }
  
  req.onerror = function (evt) {
    console.error("getFile:", evt.target.errorCode)
  }
}

Store.prototype.addFile = (data) => {
  if (!this.db) {
    throw new Error('db is not initialized')
  }
  
  let tx = this.db.transaction(this.DB_STORE_NAME, 'readwrite')
  let store = tx.objectStore(this.DB_STORE_NAME)
  
  for (let field of ['filename', 'file']) {
    if (!data[field]) {
      throw new Error(`Required field(s) missing: ${field}`)
    }
  }
  data = Object.assign(data, {
    deleted: false,
    uploaded: false,
    digest: 'a md5 string'
  })
  
  let req = store.add(data)
  req.onsuccess = function (evt) {
    console.debug("Insertion in Store successful")
  }
  req.onerror = function() {
    throw this.error
  }
}

export default Store

