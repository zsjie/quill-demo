const Store = {
  DB_NAME: 'vana-notes',
  DB_VERSION: 5,
  DB_STORE_NAME: 'attachments',
  
  db: null,
  
  init,
  getFile,
  addFile,
  listAll
}

function init () {
  let self = this
  
  console.debug("initDb ...");
  let req = indexedDB.open(self.DB_NAME,self.DB_VERSION)
  req.onsuccess = function (evt) {
    self.db = this.result
    console.debug("initDb DONE")
  }
  req.onerror = function (evt) {
    throw new Error(evt.target.errorCode)
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
}

function getFileByFilename (filename, cb) {
  let tx = this.db.transaction(this.DB_STORE_NAME)
  let store = tx.objectStore(this.DB_STORE_NAME)
  let req = store.openCursor()
  
  req.onsuccess = (evt) => {
    let cursor = evt.target.result
    if (cursor) {
      if (cursor.value.filename === filename) {
        return cb(cursor.value.file)
      }
      
      cursor.continue()
    }
    else {
      throw new Error(`no such file: ${filename}`)
    }
  }
  
  req.onerror = (evt) => {
    throw this.error
  }
}

function getFile (key, cb) {
  let tx = this.db.transaction(this.DB_STORE_NAME, 'readonly')
  let store = tx.objectStore(this.DB_STORE_NAME)
  let req = store.get(key)
  
  req.onsuccess = (evt) => {
    let value = evt.target.result
    if (value)
      cb(value)
  }
  
  req.onerror = function (evt) {
    console.error("getFile:", evt.target.errorCode)
  }
}

function addFile (data) {
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

function listAll () {
  let tx = this.db.transaction(this.DB_STORE_NAME)
  let store = tx.objectStore(this.DB_STORE_NAME)
  let req
  
  req = store.count()
  req.onsuccess = (evt) => {
    console.log(`${evt.target.result} images stored`)
  }
  req.onerror = (evt) => {
    throw this.error
  }
  
  req = store.openCursor()
  req.onsuccess = (evt) => {
    let cursor = evt.target.result
    if (cursor) {
      console.log(`file ${cursor.key}: ${cursor.value.filename}`)
      
      cursor.continue()
    }
    else {
      console.log('no more entries')
    }
  }
}

export default Store

