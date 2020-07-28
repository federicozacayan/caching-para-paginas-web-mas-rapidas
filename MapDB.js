let db = new Map()// set get has delete
db.set('123', 'TheValue')
if(db.has('123')){
    console.log(db.get('123'))
}
db.delete('123')
// delete db
export default db