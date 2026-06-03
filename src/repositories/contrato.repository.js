const { db, nextId } = require('../db')

function _populate(c) {
  if (!c) return null
  const imovel  = db.get('imoveis').find({ id: c.imovelId }).value()
  const cliente = db.get('clientes').find({ id: c.clienteId }).value()
  const u       = db.get('usuarios').find({ id: c.usuarioId }).value()
  return { ...c, imovel, cliente, usuario: u ? { nome: u.nome, email: u.email } : null }
}

function listar() {
  return db.get('contratos').orderBy(['criadoEm'], ['desc']).value().map(_populate)
}

function buscarPorId(id) {
  return _populate(db.get('contratos').find({ id: Number(id) }).value())
}

function criar(dados) {
  const contrato = { id: nextId('contratos'), status: 'ativo', criadoEm: new Date().toISOString(), ...dados }
  db.get('contratos').push(contrato).write()
  return _populate(contrato)
}

function atualizar(id, dados) {
  db.get('contratos').find({ id: Number(id) }).assign(dados).write()
  return buscarPorId(id)
}

module.exports = { listar, buscarPorId, criar, atualizar }
