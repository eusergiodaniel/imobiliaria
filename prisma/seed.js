require('dotenv').config()
const bcrypt = require('bcryptjs')
const { db, nextId } = require('../src/db')

async function main() {
  console.log('🌱 Populando banco de dados...')

  const senhaHash = await bcrypt.hash('123456', 10)

  const usuarios = [
    { id: 1, nome: 'Administrador',  email: 'admin@imobiliaria.com',  senha: senhaHash, papel: 'admin',  criadoEm: new Date().toISOString() },
    { id: 2, nome: 'Carlos Agente',  email: 'agente@imobiliaria.com', senha: senhaHash, papel: 'agente', criadoEm: new Date().toISOString() },
    { id: 3, nome: 'Maria Cliente',  email: 'cliente@email.com',      senha: senhaHash, papel: 'cliente',criadoEm: new Date().toISOString() },
  ]

  const imoveis = [
    { id: 1, titulo: 'Apartamento 3 quartos - Batista Campos', descricao: 'Apartamento amplo com varanda, 2 vagas', tipo: 'apartamento', status: 'disponivel', preco: 450000, area: 110, endereco: 'Av. Gov. Jose Malcher, 1500', bairro: 'Batista Campos', cidade: 'Belem', criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() },
    { id: 2, titulo: 'Casa duplex - Umarizal', descricao: 'Casa com piscina, 4 quartos sendo 2 suites', tipo: 'casa', status: 'vendido', preco: 850000, area: 280, endereco: 'Rua Municipio de Breves, 300', bairro: 'Umarizal', cidade: 'Belem', criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() },
    { id: 3, titulo: 'Sala comercial - Marco', tipo: 'comercial', status: 'disponivel', preco: 3500, area: 45, endereco: 'Trav. Padre Eutiquio, 900', bairro: 'Marco', cidade: 'Belem', criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() },
  ]

  const clientes = [
    { id: 1, nome: 'Joao Silva', email: 'joao@email.com', telefone: '91999990001', cpf: '12345678901', criadoEm: new Date().toISOString() },
    { id: 2, nome: 'Ana Souza',  email: 'ana@email.com',  telefone: '91999990002', cpf: '98765432100', criadoEm: new Date().toISOString() },
  ]

  const visitas = [
    { id: 1, dataHora: '2025-02-10T14:00:00.000Z', status: 'agendada', observacao: 'Cliente tem interesse em financiar', imovelId: 1, clienteId: 1, usuarioId: 2, criadoEm: new Date().toISOString() },
  ]

  const contratos = [
    { id: 1, tipo: 'compra', status: 'ativo', valorTotal: 850000, dataInicio: '2025-02-15T00:00:00.000Z', imovelId: 2, clienteId: 1, usuarioId: 1, criadoEm: new Date().toISOString() },
  ]

  db.set('usuarios',  usuarios).write()
  db.set('imoveis',   imoveis).write()
  db.set('clientes',  clientes).write()
  db.set('visitas',   visitas).write()
  db.set('contratos', contratos).write()

  console.log('✅ Seed concluido!')
  console.log('\n👤 Usuarios criados:')
  console.log('   admin@imobiliaria.com  | senha: 123456 | papel: admin')
  console.log('   agente@imobiliaria.com | senha: 123456 | papel: agente')
  console.log('   cliente@email.com      | senha: 123456 | papel: cliente')
}

main().catch(console.error)
