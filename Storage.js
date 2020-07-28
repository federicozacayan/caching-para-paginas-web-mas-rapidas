class Storage {

    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    getItem(key) {
        return JSON.parse(localStorage.getItem(key))
    }
    removeItem(key) {
        localStorage.removeItem(key)
    }
    clear() {
        localStorage.clear()
    }
}
const storage = new Storage()
export default storage

// storage.setItem('123','TheValue')
// storage.setItem('456','TheOtherValue')

// setTimeout(() => {
//     console.log(storage.getItem('123'))
// }, 1000*2);

// setTimeout(() => {
//     storage.removeItem('123')
// }, 1000*4);

// setTimeout(() => {
//     console.log('clear')
//     storage.clear()
// }, 1000*6);