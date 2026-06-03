const router  = require('express').Router()
const service  = require('../services/cliente.service')
const { autenticar, autorizar } = require('../middlewares/auth')
const { schemaCriar, schemaAtualizar } = require('../validators/cliente.validator')

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       403:
 *         description: Sem permissão
 */
router.get('/', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try { res.json(await service.listar()) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     tags: [Clientes]
 *     summary: Buscar cliente por ID
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
 *         description: Dados do cliente
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try { res.json(await service.buscarPorId(req.params.id)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     tags: [Clientes]
 *     summary: Cadastrar cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente cadastrado
 *       409:
 *         description: E-mail ou CPF já cadastrado
 */
router.post('/', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaCriar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try { res.status(201).json(await service.criar(value)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     tags: [Clientes]
 *     summary: Editar cliente
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
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado
 */
router.put('/:id', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaAtualizar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try { res.json(await service.atualizar(req.params.id, value)) }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     tags: [Clientes]
 *     summary: Remover cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Removido com sucesso
 *       403:
 *         description: Sem permissão (requer admin)
 */
router.delete('/:id', autenticar, autorizar('admin'), async (req, res) => {
  try { await service.remover(req.params.id); res.status(204).send() }
  catch (e) { res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' }) }
})

module.exports = router
