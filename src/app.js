require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const session      = require('express-session')
const path         = require('path')
const swaggerUi    = require('swagger-ui-express')
const swaggerSpec  = require('./swagger')

const authRoutes     = require('./routes/auth.routes')
const imovelRoutes   = require('./routes/imovel.routes')
const clienteRoutes  = require('./routes/cliente.routes')
const contratoRoutes = require('./routes/contrato.routes')
const visitaRoutes   = require('./routes/visita.routes')
const webRoutes      = require('./routes/web.routes')
const clienteWebRoutes = require('./routes/cliente_web.routes')

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.use(session({
  secret: process.env.JWT_SECRET || 'imobiliaria_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
}))

// ── Views (EJS) ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// ── Swagger ───────────────────────────────────────────────────────────────────
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'ImovelHub API',
  swaggerOptions: { persistAuthorization: true },
}))

// ── Rotas Web (Frontend) ──────────────────────────────────────────────────────
app.use('/', webRoutes)
app.use('/', clienteWebRoutes)

// ── Rotas API (JSON) ──────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/imoveis',   imovelRoutes)
app.use('/api/clientes',  clienteRoutes)
app.use('/api/contratos', contratoRoutes)
app.use('/api/visitas',   visitaRoutes)

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ erro: 'Rota não encontrada' })
  res.redirect('/login')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ erro: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`\n🏢  ImovelHub rodando em http://localhost:${PORT}`)
  console.log(`🖥️   Painel Web:           http://localhost:${PORT}/login`)
  console.log(`📖  API Swagger:           http://localhost:${PORT}/docs\n`)
})
