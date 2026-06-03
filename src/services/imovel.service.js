const repo = require('../repositories/imovel.repository')

async function listar(filtros) {
  return repo.listar(filtros)
}

async function buscarPorId(id) {
  const imovel = await repo.buscarPorId(id)
  if (!imovel) throw { status: 404, mensagem: 'Imovel nao encontrado' }
  return imovel
}

async function criar(dados) {
  return repo.criar(dados)
}

async function atualizar(id, dados) {
  await buscarPorId(id)
  return repo.atualizar(id, dados)
}

async function atualizarStatus(id, status) {
  await buscarPorId(id)
  return repo.atualizar(id, { status })
}

async function remover(id) {
  await buscarPorId(id)
  return repo.remover(id)
}

module.exports = { listar, buscarPorId, criar, atualizar, atualizarStatus, remover }
