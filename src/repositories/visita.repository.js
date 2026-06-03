const { db, nextId } = require('../db')

function _populate(v) {
  if (!v) return null
  const imovel  = db.get('imoveis').find({ id: v.imovelId }).value()
  const cliente = db.get('clientes').find({ id: v.clienteId }).value()
  const u       = db.get('usuarios').find({ id: v.usuarioId }).value()
  return { ...v, imovel, cliente, usuario: u ? { nome: u.nome, email: u.email } : null }
}

function listar() {
  return db.get('visitas').orderBy(['dataHora'], ['asc']).value().map(_populate)
}

function buscarPorId(id) {
  return _populate(db.get('visitas').find({ id: Number(id) }).value())
}

function criar(dados) {
  const visita = { id: nextId('visitas'), status: 'agendada', criadoEm: new Date().toISOString(), ...dados }
  db.get('visitas').push(visita).write()
  return _populate(visita)
}

function atualizar(id, dados) {
  db.get('visitas').find({ id: Number(id) }).assign(dados).write()
  return buscarPorId(id)
}

module.exports = { listar, buscarPorId, criar, atualizar }
