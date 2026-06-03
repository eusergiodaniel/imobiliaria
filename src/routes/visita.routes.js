const router  = require('express').Router()
const service  = require('../services/visita.service')
const { autenticar, autorizar } = require('../middlewares/auth')
const { schemaCriar, schemaStatus } = require('../validators/visita.validator')

/**
 * @swagger
 * /api/visitas:
 *   get:
 *     tags: [Visitas]
 *     summary: Listar visitas agendadas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de visitas
 */
router.get('/', autenticar, async (req, res) => {
  try { res.json(await service.listar()) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/visitas/{id}:
 *   get:
 *     tags: [Visitas]
 *     summary: Buscar visita por ID
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
 *         description: Dados da visita
 *       404:
 *         description: Visita não encontrada
 */
router.get('/:id', autenticar, async (req, res) => {
  try { res.json(await service.buscarPorId(req.params.id)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/visitas:
 *   post:
 *     tags: [Visitas]
 *     summary: Agendar visita
 *     description: Não é possível agendar visita para imóvel já vendido ou alugado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VisitaInput'
 *     responses:
 *       201:
 *         description: Visita agendada
 *       422:
 *         description: Imóvel indisponível para visita
 */
router.post('/', autenticar, async (req, res) => {
  const { error, value } = schemaCriar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try { res.status(201).json(await service.criar(value, req.usuario.id)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/visitas/{id}/status:
 *   patch:
 *     tags: [Visitas]
 *     summary: Atualizar status da visita
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
 *             $ref: '#/components/schemas/StatusVisitaInput'
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
