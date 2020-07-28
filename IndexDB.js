let modelsTemplate = `
//CREATE TABLE
let models = [
    { name: "storeName1", options: { autoIncrement: true } },
    { name: "storeName2", options: {keyPath: 'id'}},
    { name: "storeName3", options: {keyPath: 'id', autoIncrement:true}}
]`


class IndexDB {
    constructor(models) {
        if (!window.indexedDB) {
            console.error(`Your browser doesn't support a stable version of IndexedDB.`);
        }
        if (typeof models === 'undefined') {
            console.error(`Models not defined. Please follow this template` + modelsTemplate)
            return
        }
        this.request = null
        this.models = models
    }
    open(dbName) {
        if (this.request !== null) {
            return
        }
        let open = new Promise((resolve, reject) => {
            this.request = window.indexedDB.open(dbName);

            this.request.onerror = reject

            this.request.onsuccess = resolve

            this.request.onupgradeneeded = e => {
                this.models.forEach(store => {
                    db.request.result.createObjectStore(store.name, store.options)
                });
            }
        }).then(e => {
            console.log('DB OPENED!!')
        }).catch(e => console.error(e))
        return open
    }

    add(storeName, data) {
        let add = new Promise((resolve, reject) => {
            let transaction = this.request.result.transaction(storeName, "readwrite");
            transaction.onerror = reject
            transaction.oncomplete = resolve
            let objectStore = transaction.objectStore(storeName)
            objectStore.add(data);
        })
        return add
    }
    get(storeName, key) {
        let get = new Promise((resolve, reject) => {
            let transaction = this.request.result.transaction(storeName, "readonly");
            transaction.onerror = reject
            let objectStore = transaction.objectStore(storeName)
            let request = objectStore.get(key);
            request.onerror = reject
            request.onsuccess = resolve
        })
        return get
    }
    put(storeName, key, data) {
        let add = new Promise((resolve, reject) => {
            let transaction = this.request.result.transaction(storeName, "readwrite");
            transaction.onerror = reject
            let objectStore = transaction.objectStore(storeName)
            let request = objectStore.get(key);
            request.onsuccess = (e) => {
                const newData = { ...request.result, ...data }
                let requestUpdate = objectStore.put(newData, key)
                requestUpdate.onerror = reject
                requestUpdate.onsuccess = resolve(newData)
            }
        })
        return add
    }

    delete(storeName, key) {
        let del = new Promise((resolve, reject) => {
            let transaction = this.request.result.transaction(storeName, "readwrite");
            transaction.onerror = reject
            let objectStore = transaction.objectStore(storeName)
            let request = objectStore.delete(key);
            request.onerror = reject
            request.onsuccess = resolve
        })
        return del
    }
    deleteStore(dbName) {
        this.close()
        let req = indexedDB.deleteDatabase(dbName)
        let del = new Promise((resolve, reject) => {
            req.onsuccess = resolve
            req.onerror = reject
            req.onblocked = reject
        })
        return del
    }
    
    close() {
        let req = this.request.result.close()
        console.log('DB closed!!')
    }

}


let models = [
    { name: 'collection1', options: { autoIncrement: true } },
]

let db = new IndexDB(models)
db.open('superDB').then(e => {
    // /add
    db.add('collection1', { medata: 'mydata2' })

    //get
    db.get("collection1", 1)
    .then(e => {
        console.log(e.target.result)
    }).catch(e => console.error(e))

    db.put("collection1", 1, { 'tapa tapita': 'tapon' })
        .then(newData => {
            console.log(newData)
        }).catch(e => console.error(e))

    db.delete("collection1", 2).then(e => {
        console.log('Element deleted!!!')
    })

    setTimeout(() => {
        db.deleteStore('superDB')
            .then(e => console.log(`superDB deleted`, e.type))
            .catch(e => console.error(e))
    }, 1000 * 5);
})
