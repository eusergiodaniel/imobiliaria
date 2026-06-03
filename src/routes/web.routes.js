const router       = require('express').Router()
const bcrypt       = require('bcryptjs')
const jwt          = require('jsonwebtoken')
const authRepo     = require('../repositories/auth.repository')
const imovelSvc    = require('../services/imovel.service')
const clienteSvc   = require('../services/cliente.service')
const contratoSvc  = require('../services/contrato.service')
const visitaSvc    = require('../services/visita.service')
const { db }       = require('../db')

// ── Middleware de sessão web ──────────────────────────────────────────────────
function autenticarWeb(req, res, next) {
  const usuario = req.session && req.session.usuario
  if (!usuario) return res.redirect('/login')
  res.locals.usuario = usuario
  next()
}

// ── Login ─────────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session && req.session.usuario) return res.redirect('/painel')
  res.render('pages/login', { title: 'Login', erro: null })
})

router.post('/login', async (req, res) => {
  const { email, senha } = req.body
  try {
    const usuario = authRepo.buscarPorEmail(email)
    if (!usuario) return res.render('pages/login', { title: 'Login', erro: 'Credenciais inválidas' })

    const ok = await bcrypt.compare(senha, usuario.senha)
    if (!ok) return res.render('pages/login', { title: 'Login', erro: 'Credenciais inválidas' })

    req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel }
    if (usuario.papel === 'cliente') return res.redirect('/cliente')
    res.redirect('/painel')
  } catch (e) {
    res.render('pages/login', { title: 'Login', erro: 'Erro ao fazer login' })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/painel', autenticarWeb, async (req, res) => {
  const imoveis  = imovelSvc.listar ? await imovelSvc.listar() : db.get('imoveis').value()
  const clientes = db.get('clientes').value()
  const contratos = db.get('contratos').value()
  const visitas  = db.get('visitas').value()

  const allImoveis = db.get('imoveis').value()
  const allVisitas = visitaSvc.listar ? await visitaSvc.listar() : []

  res.render('pages/dashboard', {
    title: 'Dashboard',
    page: 'dashboard',
    stats: {
      totalImoveis:      allImoveis.length,
      imoveisDisponiveis: allImoveis.filter(i => i.status === 'disponivel').length,
      totalClientes:     clientes.length,
      totalContratos:    contratos.length,
      contratosAtivos:   contratos.filter(c => c.status === 'ativo').length,
      totalVisitas:      visitas.length,
      visitasAgendadas:  visitas.filter(v => v.status === 'agendada').length,
    },
    imoveis: await imovelSvc.listar(),
    visitas: await visitaSvc.listar(),
  })
})

// ── Imóveis ───────────────────────────────────────────────────────────────────
router.get('/painel/imoveis', autenticarWeb, async (req, res) => {
  const filtros = { tipo: req.query.tipo, status: req.query.status, bairro: req.query.bairro }
  res.render('pages/imoveis', {
    title: 'Imóveis', page: 'imoveis',
    imoveis: await imovelSvc.listar(filtros),
    filtros, msg: req.query.msg || null, erro: req.query.erro || null,
  })
})

router.post('/painel/imoveis', autenticarWeb, async (req, res) => {
  try {
    const dados = {
      titulo:    req.body.titulo,
      descricao: req.body.descricao || undefined,
      tipo:      req.body.tipo,
      preco:     Number(req.body.preco),
      area:      Number(req.body.area),
      endereco:  req.body.endereco,
      bairro:    req.body.bairro,
      cidade:    req.body.cidade,
    }
    await imovelSvc.criar(dados)
    res.redirect('/painel/imoveis?msg=Imóvel cadastrado com sucesso!')
  } catch (e) {
    res.redirect('/painel/imoveis?erro=' + encodeURIComponent(e.mensagem || 'Erro ao cadastrar'))
  }
})

// ── Clientes ──────────────────────────────────────────────────────────────────
router.get('/painel/clientes', autenticarWeb, async (req, res) => {
  res.render('pages/clientes', {
    title: 'Clientes', page: 'clientes',
    clientes: await clienteSvc.listar(),
    msg: req.query.msg || null, erro: req.query.erro || null,
  })
})

router.post('/painel/clientes', autenticarWeb, async (req, res) => {
  try {
    await clienteSvc.criar({
      nome:     req.body.nome,
      email:    req.body.email,
      cpf:      req.body.cpf,
      telefone: req.body.telefone || undefined,
    })
    res.redirect('/painel/clientes?msg=Cliente cadastrado com sucesso!')
  } catch (e) {
    res.redirect('/painel/clientes?erro=' + encodeURIComponent(e.mensagem || 'Erro ao cadastrar'))
  }
})

// ── Contratos ─────────────────────────────────────────────────────────────────
router.get('/painel/contratos', autenticarWeb, async (req, res) => {
  res.render('pages/contratos', {
    title: 'Contratos', page: 'contratos',
    contratos: await contratoSvc.listar(),
    imoveisDisponiveis: (await imovelSvc.listar({ status: 'disponivel' })),
    clientes: await clienteSvc.listar(),
    msg: req.query.msg || null, erro: req.query.erro || null,
  })
})

router.post('/painel/contratos', autenticarWeb, async (req, res) => {
  try {
    await contratoSvc.criar({
      tipo:       req.body.tipo,
      valorTotal: Number(req.body.valorTotal),
      dataInicio: req.body.dataInicio,
      dataFim:    req.body.dataFim || undefined,
      observacao: req.body.observacao || undefined,
      imovelId:   Number(req.body.imovelId),
      clienteId:  Number(req.body.clienteId),
    }, req.session.usuario.id)
    res.redirect('/painel/contratos?msg=Contrato criado com sucesso!')
  } catch (e) {
    res.redirect('/painel/contratos?erro=' + encodeURIComponent(e.mensagem || 'Erro ao criar contrato'))
  }
})

// ── Visitas ───────────────────────────────────────────────────────────────────
router.get('/painel/visitas', autenticarWeb, async (req, res) => {
  res.render('pages/visitas', {
    title: 'Visitas', page: 'visitas',
    visitas:  await visitaSvc.listar(),
    imoveis:  await imovelSvc.listar(),
    clientes: await clienteSvc.listar(),
    msg: req.query.msg || null, erro: req.query.erro || null,
  })
})

router.post('/painel/visitas', autenticarWeb, async (req, res) => {
  try {
    await visitaSvc.criar({
      dataHora:   req.body.dataHora,
      observacao: req.body.observacao || undefined,
      imovelId:   Number(req.body.imovelId),
      clienteId:  Number(req.body.clienteId),
    }, req.session.usuario.id)
    res.redirect('/painel/visitas?msg=Visita agendada com sucesso!')
  } catch (e) {
    res.redirect('/painel/visitas?erro=' + encodeURIComponent(e.mensagem || 'Erro ao agendar visita'))
  }
})

module.exports = router

// ── Registro ──────────────────────────────────────────────────────────────────
router.get('/registrar', (req, res) => {
  if (req.session && req.session.usuario) return res.redirect('/painel')
  res.render('pages/registrar', { title: 'Criar Conta', erro: null })
})

router.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body
  try {
    const authService = require('../services/auth.service')
    await authService.registrar({ nome, email, senha, papel: 'cliente' })
    // Login automático após registro
    const bcrypt = require('bcryptjs')
    const authRepo = require('../repositories/auth.repository')
    const usuario = authRepo.buscarPorEmail(email)
    req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel }
    res.redirect('/cliente')
  } catch (e) {
    res.render('pages/registrar', { title: 'Criar Conta', erro: e.mensagem || 'Erro ao criar conta' })
  }
})
