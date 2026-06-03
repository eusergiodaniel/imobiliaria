const repo       = require('../repositories/contrato.repository')
const imovelRepo = require('../repositories/imovel.repository')

async function listar() {
  return repo.listar()
}

async function buscarPorId(id) {
  const contrato = await repo.buscarPorId(id)
  if (!contrato) throw { status: 404, mensagem: 'Contrato nao encontrado' }
  return contrato
}

async function criar(dados, usuarioId) {
  const imovel = await imovelRepo.buscarPorId(dados.imovelId)
  if (!imovel) throw { status: 404, mensagem: 'Imovel nao encontrado' }

  if (imovel.status !== 'disponivel') {
    throw { status: 422, mensagem: `Imovel nao disponivel (status atual: ${imovel.status})` }
  }

  const novoStatus = dados.tipo === 'compra' ? 'vendido' : 'alugado'

  const contrato = await repo.criar({
    tipo:       dados.tipo,
    valorTotal: dados.valorTotal,
    dataInicio: new Date(dados.dataInicio),
    dataFim:    dados.dataFim ? new Date(dados.dataFim) : null,
    observacao: dados.observacao,
    imovelId:   dados.imovelId,
    clienteId:  dados.clienteId,
    usuarioId,
  })

  await imovelRepo.atualizar(dados.imovelId, { status: novoStatus })

  return contrato
}

async function atualizarStatus(id, status) {
  await buscarPorId(id)
  return repo.atualizar(id, { status })
}

module.exports = { listar, buscarPorId, criar, atualizarStatus }
