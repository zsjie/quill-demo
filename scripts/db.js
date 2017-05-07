function DB () {
  this.DB_NAME = 'vana-notes'
  this.DB_VERSION = 5
  this.DB_STORE_NAME = 'attachments'
  this._instance = null
}

DB.prototype.getInstance = async function () {
  if (this._instance) {
    return this._instance
  }
  
  let self = this
  return await new Promise((resolve, reject) => {
    console.debug("initDb ...")
    let req = indexedDB.open(self.DB_NAME, self.DB_VERSION)
    
    req.onsuccess = evt => {
      console.debug("initDb DONE")
      console.log(evt)
      self._instance = evt.target.result
      resolve(self._instance)
    }
    
    req.onerror = evt => {
      reject(new Error(evt.target.errorCode))
    }
    
    req.onupgradeneeded = evt => {
      console.debug("initDb.onupgradeneeded")
      let store = evt.currentTarget.result.createObjectStore(
        self.DB_STORE_NAME, { keyPath: 'id', autoIncrement: true })
    
      store.createIndex('filename', 'filename', { unique: false })
      store.createIndex('digest', 'digest', { unique: false })
      store.createIndex('deleted', 'deleted', { unique: false })
      store.createIndex('uploaded', 'uploaded', { unique: false })
      store.createIndex('seq', 'seq', { unique: false })
    }
  })
}

DB.prototype.getFileByFilename = async function (filename) {
  let db = await this.getInstance()
  let tx = db.transaction(this.DB_STORE_NAME)
  let store = tx.objectStore(this.DB_STORE_NAME)
  
  return await new Promise((resolve, reject) => {
    let req = store.openCursor()
    req.onsuccess = evt => {
      let cursor = evt.target.result
      if (cursor) {
        if (cursor.value.filename === filename) {
          resolve(cursor.value.file)
        }
      
        cursor.continue()
      }
      else {
        reject(new Error(`no such file: ${filename}`))
      }
    }
  
    req.onerror = evt => {
      reject(new Error(evt.target.errorCode))
    }
  })
}

DB.prototype.getFileByFileId = async function (fileId) {
  let db = await this.getInstance()
  let tx = db.transaction(this.DB_STORE_NAME)
  let store = tx.objectStore(this.DB_STORE_NAME)
  
  return new Promise((resolve, reject) => {
    let req = store.get(fileId);
    
    req.onsuccess = (evt) => {
      resolve(evt.target.result.file)
    }
  
    req.onerror = (evt) => {
      reject(new Error(evt.target.errorCode))
    }
  })
}

DB.prototype.addFile = async function (data) {
  let db = await this.getInstance()
  let tx = db.transaction(this.DB_STORE_NAME, 'readwrite')
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
  
  return new Promise((resolve, reject) => {
    let req = store.add(data)
    req.onsuccess = evt => {
      console.debug("Insertion in Store successful")
      resolve(evt.target.result)
    }
    req.onerror = evt => {
      reject(new new Error(evt.target.errorCode))
    }
  })
}

DB.prototype.listAll = async function () {
  let db = await this.getInstance()
  let tx = db.transaction(this.DB_STORE_NAME)
  let store = tx.objectStore(this.DB_STORE_NAME)
  let req
  
  req = store.count()
  req.onsuccess = (evt) => {
    console.log(`${evt.target.result} images stored`)
  }
  req.onerror = (evt) => {
    throw new Error(evt.target.errorCode)
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

DB.prototype.test = function () {
  this.listAll().then(() => {
    console.log('done')
  })
}

export default DB