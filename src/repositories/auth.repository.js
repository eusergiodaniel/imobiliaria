const { db, nextId } = require('../db')

function buscarPorEmail(email) {
  return db.get('usuarios').find({ email }).value() || null
}

function buscarPorId(id) {
  return db.get('usuarios').find({ id: Number(id) }).value() || null
}

function criar(dados) {
  const usuario = { id: nextId('usuarios'), criadoEm: new Date().toISOString(), ...dados }
  db.get('usuarios').push(usuario).write()
  return usuario
}

module.exports = { buscarPorEmail, buscarPorId, criar }
