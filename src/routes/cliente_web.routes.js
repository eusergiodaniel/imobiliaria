const router      = require('express').Router()
const imovelSvc   = require('../services/imovel.service')
const clienteSvc  = require('../services/cliente.service')
const visitaSvc   = require('../services/visita.service')
const contratoSvc = require('../services/contrato.service')
const { db }      = require('../db')

function autenticarCliente(req, res, next) {
  const usuario = req.session && req.session.usuario
  if (!usuario) return res.redirect('/login')
  res.locals.usuario = usuario
  next()
}

// Busca o registro de cliente vinculado ao usuário logado
function buscarClienteId(usuarioEmail) {
  const cliente = db.get('clientes').find({ email: usuarioEmail }).value()
  return cliente ? cliente.id : null
}

// ── Início ────────────────────────────────────────────────────────────────────
router.get('/cliente', autenticarCliente, async (req, res) => {
  const todos     = db.get('imoveis').value()
  const clienteId = buscarClienteId(req.session.usuario.email)
  const visitas   = clienteId ? db.get('visitas').filter({ clienteId }).value() : []
  const contratos = clienteId ? db.get('contratos').filter({ clienteId }).value() : []
  const disponiveis = todos.filter(i => i.status === 'disponivel')

  res.render('cliente/inicio', {
    title: 'Minha Área',
    page: 'inicio',
    stats: {
      imoveisDisponiveis: disponiveis.length,
      minhasVisitas: visitas.length,
      meusContratos: contratos.length,
    },
    destaques: disponiveis.slice(0, 3),
    proximasVisitas: await visitaSvc.listar().then(vs =>
      vs.filter(v => v.clienteId === clienteId && v.status === 'agendada').slice(0, 3)
    ).catch(() => []),
  })
})

// ── Imóveis ───────────────────────────────────────────────────────────────────
router.get('/cliente/imoveis', autenticarCliente, async (req, res) => {
  const filtros = { tipo: req.query.tipo, bairro: req.query.bairro, precoMax: req.query.precoMax }
  const todos   = await imovelSvc.listar({ ...filtros, status: 'disponivel' })
  res.render('cliente/imoveis', {
    title: 'Imóveis', page: 'imoveis',
    imoveis: todos, filtros,
  })
})

router.get('/cliente/imoveis/:id', autenticarCliente, async (req, res) => {
  try {
    const imovel    = await imovelSvc.buscarPorId(req.params.id)
    const clienteId = buscarClienteId(req.session.usuario.email)
    res.render('cliente/imovel_detalhe', {
      title: imovel.titulo, page: 'imoveis',
      imovel, clienteId,
      msg: req.query.msg || null, erro: req.query.erro || null,
    })
  } catch (e) {
    res.redirect('/cliente/imoveis')
  }
})

router.post('/cliente/imoveis/:id/visita', autenticarCliente, async (req, res) => {
  const clienteId = buscarClienteId(req.session.usuario.email)
  if (!clienteId) return res.redirect(`/cliente/imoveis/${req.params.id}?erro=Cadastro de cliente não encontrado`)

  try {
    await visitaSvc.criar({
      dataHora:   req.body.dataHora,
      observacao: req.body.observacao || undefined,
      imovelId:   Number(req.params.id),
      clienteId,
    }, req.session.usuario.id)
    res.redirect(`/cliente/imoveis/${req.params.id}?msg=Visita agendada com sucesso!`)
  } catch (e) {
    res.redirect(`/cliente/imoveis/${req.params.id}?erro=${encodeURIComponent(e.mensagem || 'Erro ao agendar')}`)
  }
})

// ── Visitas ───────────────────────────────────────────────────────────────────
router.get('/cliente/visitas', autenticarCliente, async (req, res) => {
  const clienteId = buscarClienteId(req.session.usuario.email)
  const todas     = await visitaSvc.listar()
  const minhas    = clienteId ? todas.filter(v => v.clienteId === clienteId) : []
  res.render('cliente/visitas', { title: 'Minhas Visitas', page: 'visitas', visitas: minhas })
})

// ── Contratos ─────────────────────────────────────────────────────────────────
router.get('/cliente/contratos', autenticarCliente, async (req, res) => {
  const clienteId = buscarClienteId(req.session.usuario.email)
  const todos     = await contratoSvc.listar()
  const meus      = clienteId ? todos.filter(c => c.clienteId === clienteId) : []
  res.render('cliente/contratos', { title: 'Meus Contratos', page: 'contratos', contratos: meus })
})

module.exports = router

// ── Chat ──────────────────────────────────────────────────────────────────────
router.get('/cliente/chat', autenticarCliente, (req, res) => {
  res.render('cliente/chat', { title: 'Falar com Agente', page: 'chat' })
})
