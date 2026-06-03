const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const repo   = require('../repositories/auth.repository')

async function registrar({ nome, email, senha, papel }) {
  const existe = await repo.buscarPorEmail(email)
  if (existe) throw { status: 409, mensagem: 'E-mail ja cadastrado' }

  const hash = await bcrypt.hash(senha, 10)
  const usuario = await repo.criar({ nome, email, senha: hash, papel: papel || 'cliente' })

  const { senha: _, ...dados } = usuario
  return dados
}

async function login({ email, senha }) {
  const usuario = await repo.buscarPorEmail(email)
  if (!usuario) throw { status: 401, mensagem: 'Credenciais invalidas' }

  const senhaValida = await bcrypt.compare(senha, usuario.senha)
  if (!senhaValida) throw { status: 401, mensagem: 'Credenciais invalidas' }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } }
}

module.exports = { registrar, login }
