const repo       = require('../repositories/visita.repository')
const imovelRepo = require('../repositories/imovel.repository')

async function listar() {
  return repo.listar()
}

async function buscarPorId(id) {
  const visita = await repo.buscarPorId(id)
  if (!visita) throw { status: 404, mensagem: 'Visita nao encontrada' }
  return visita
}

async function criar(dados, usuarioId) {
  const imovel = await imovelRepo.buscarPorId(dados.imovelId)
  if (!imovel) throw { status: 404, mensagem: 'Imovel nao encontrado' }

  if (['vendido', 'alugado'].includes(imovel.status)) {
    throw { status: 422, mensagem: `Nao e possivel agendar visita: imovel ${imovel.status}` }
  }

  return repo.criar({
    dataHora:   new Date(dados.dataHora),
    observacao: dados.observacao,
    imovelId:   dados.imovelId,
    clienteId:  dados.clienteId,
    usuarioId,
  })
}

async function atualizarStatus(id, status) {
  await buscarPorId(id)
  return repo.atualizar(id, { status })
}

module.exports = { listar, buscarPorId, criar, atualizarStatus }
