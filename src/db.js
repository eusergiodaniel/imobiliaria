const low   = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path  = require('path')

const adapter = new FileSync(path.join(__dirname, '../prisma/db.json'))
const db = low(adapter)

db.defaults({
  usuarios:  [],
  imoveis:   [],
  clientes:  [],
  contratos: [],
  visitas:   [],
}).write()

// Helper para auto-incremento
function nextId(colecao) {
  const items = db.get(colecao).value()
  if (!items.length) return 1
  return Math.max(...items.map(i => i.id)) + 1
}

module.exports = { db, nextId }
