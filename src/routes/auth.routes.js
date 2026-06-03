const router  = require('express').Router()
const service  = require('../services/auth.service')
const { schemaRegistro, schemaLogin } = require('../validators/auth.validator')

/**
 * @swagger
 * /api/auth/registrar:
 *   post:
 *     tags: [Auth]
 *     summary: Criar nova conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/registrar', async (req, res) => {
  const { error, value } = schemaRegistro.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try {
    const usuario = await service.registrar(value)
    res.status(201).json(usuario)
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login — retorna token JWT
 *     description: |
 *       **Usuários de teste:**
 *       - `admin@imobiliaria.com` / `123456` (admin)
 *       - `agente@imobiliaria.com` / `123456` (agente)
 *       - `cliente@email.com` / `123456` (cliente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado — copie o token e use em Authorize
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', async (req, res) => {
  const { error, value } = schemaLogin.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try {
    const resultado = await service.login(value)
    res.json(resultado)
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

module.exports = router
