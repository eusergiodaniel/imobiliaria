const router  = require('express').Router()
const service  = require('../services/contrato.service')
const { autenticar, autorizar } = require('../middlewares/auth')
const { schemaCriar, schemaStatus } = require('../validators/contrato.validator')

/**
 * @swagger
 * /api/contratos:
 *   get:
 *     tags: [Contratos]
 *     summary: Listar contratos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contratos
 */
router.get('/', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try { res.json(await service.listar()) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/contratos/{id}:
 *   get:
 *     tags: [Contratos]
 *     summary: Buscar contrato por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Dados do contrato
 *       404:
 *         description: Contrato não encontrado
 */
router.get('/:id', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try { res.json(await service.buscarPorId(req.params.id)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/contratos:
 *   post:
 *     tags: [Contratos]
 *     summary: Criar contrato
 *     description: |
 *       Cria um contrato de compra ou locação.
 *       - O imóvel precisa estar com status **disponivel**
 *       - Após criar, o status do imóvel é atualizado automaticamente para **vendido** (compra) ou **alugado** (locação)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContratoInput'
 *     responses:
 *       201:
 *         description: Contrato criado e imóvel atualizado
 *       422:
 *         description: Imóvel não disponível
 *       404:
 *         description: Imóvel ou cliente não encontrado
 */
router.post('/', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaCriar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try { res.status(201).json(await service.criar(value, req.usuario.id)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/contratos/{id}/status:
 *   patch:
 *     tags: [Contratos]
 *     summary: Atualizar status do contrato
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusContratoInput'
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/:id/status', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaStatus.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try { res.json(await service.atualizarStatus(req.params.id, value.status)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

module.exports = router
