const { db, nextId } = require('../db')

function listar({ tipo, bairro, cidade, status, precoMin, precoMax } = {}) {
  let q = db.get('imoveis')
  if (tipo)     q = q.filter(i => i.tipo === tipo)
  if (bairro)   q = q.filter(i => i.bairro.toLowerCase().includes(bairro.toLowerCase()))
  if (cidade)   q = q.filter(i => i.cidade.toLowerCase().includes(cidade.toLowerCase()))
  if (status)   q = q.filter(i => i.status === status)
  if (precoMin) q = q.filter(i => i.preco >= Number(precoMin))
  if (precoMax) q = q.filter(i => i.preco <= Number(precoMax))
  return q.orderBy(['criadoEm'], ['desc']).value()
}

function buscarPorId(id) {
  return db.get('imoveis').find({ id: Number(id) }).value() || null
}

function criar(dados) {
  const imovel = {
    id: nextId('imoveis'), status: 'disponivel',
    criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString(),
    ...dados,
  }
  db.get('imoveis').push(imovel).write()
  return imovel
}

function atualizar(id, dados) {
  db.get('imoveis').find({ id: Number(id) })
    .assign({ ...dados, atualizadoEm: new Date().toISOString() }).write()
  return buscarPorId(id)
}

function remover(id) {
  db.get('imoveis').remove({ id: Number(id) }).write()
}

module.exports = { listar, buscarPorId, criar, atualizar, remover }
