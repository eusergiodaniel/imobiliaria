const { db, nextId } = require('../db')

const listar    = ()    => db.get('clientes').orderBy(['criadoEm'], ['desc']).value()
const buscarPorId  = id   => db.get('clientes').find({ id: Number(id) }).value() || null
const buscarPorEmail = e  => db.get('clientes').find({ email: e }).value() || null
const buscarPorCpf   = c  => db.get('clientes').find({ cpf: c }).value() || null

function criar(dados) {
  const cliente = { id: nextId('clientes'), criadoEm: new Date().toISOString(), ...dados }
  db.get('clientes').push(cliente).write()
  return cliente
}

function atualizar(id, dados) {
  db.get('clientes').find({ id: Number(id) }).assign(dados).write()
  return buscarPorId(id)
}

function remover(id) {
  db.get('clientes').remove({ id: Number(id) }).write()
}

module.exports = { listar, buscarPorId, buscarPorEmail, buscarPorCpf, criar, atualizar, remover }
