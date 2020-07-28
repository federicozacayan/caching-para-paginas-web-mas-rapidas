let db = new Map()
db.set('123', 'TheValue!')
if (db.has('123')) {
    console.log(db.get('123'))
}
db.delete('123')

class Fetch {
    get(url) {
        return new Promise((resolve, reject) => {
            if (db.has(url)) {
                resolve(db.get(url))
            } else {
                    fetch(url)
                        .then(res => res.json())
                        .then(data => {
                            db.set(url, data)
                            resolve(data)
                        })
                        .catch(e => reject(e))
            }
        })
    }
}

const fetchCaching = new Fetch()

let url = `http://jsonplaceholder.typicode.com/users/1`

setInterval(() => {
    fetchCaching.get(url)
        .then((data) => console.log(data))
        .catch(e => console.error(e))

}, 1000 * 3);



