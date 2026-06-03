const repo = require('../repositories/cliente.repository')

async function listar() {
  return repo.listar()
}

async function buscarPorId(id) {
  const cliente = await repo.buscarPorId(id)
  if (!cliente) throw { status: 404, mensagem: 'Cliente nao encontrado' }
  return cliente
}

async function criar(dados) {
  const emailExiste = await repo.buscarPorEmail(dados.email)
  if (emailExiste) throw { status: 409, mensagem: 'E-mail ja cadastrado' }

  const cpfExiste = await repo.buscarPorCpf(dados.cpf)
  if (cpfExiste) throw { status: 409, mensagem: 'CPF ja cadastrado' }

  return repo.criar(dados)
}

async function atualizar(id, dados) {
  await buscarPorId(id)
  return repo.atualizar(id, dados)
}

async function remover(id) {
  await buscarPorId(id)
  return repo.remover(id)
}

module.exports = { listar, buscarPorId, criar, atualizar, remover }
