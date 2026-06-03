const router  = require('express').Router()
const service  = require('../services/imovel.service')
const { autenticar, autorizar } = require('../middlewares/auth')
const { schemaCriar, schemaAtualizar, schemaStatus } = require('../validators/imovel.validator')

/**
 * @swagger
 * /api/imoveis:
 *   get:
 *     tags: [Imóveis]
 *     summary: Listar imóveis (com filtros opcionais)
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [apartamento, casa, comercial, terreno]
 *       - in: query
 *         name: bairro
 *         schema:
 *           type: string
 *           example: Umarizal
 *       - in: query
 *         name: cidade
 *         schema:
 *           type: string
 *           example: Belém
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [disponivel, reservado, vendido, alugado]
 *       - in: query
 *         name: precoMin
 *         schema:
 *           type: number
 *           example: 100000
 *       - in: query
 *         name: precoMax
 *         schema:
 *           type: number
 *           example: 500000
 *     responses:
 *       200:
 *         description: Lista de imóveis
 */
router.get('/', async (req, res) => {
  try {
    res.json(await service.listar(req.query))
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/imoveis/{id}:
 *   get:
 *     tags: [Imóveis]
 *     summary: Buscar imóvel por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Dados do imóvel
 *       404:
 *         description: Imóvel não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    res.json(await service.buscarPorId(req.params.id))
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/imoveis:
 *   post:
 *     tags: [Imóveis]
 *     summary: Cadastrar imóvel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImovelInput'
 *     responses:
 *       201:
 *         description: Imóvel cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (requer admin ou agente)
 */
router.post('/', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaCriar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try {
    res.status(201).json(await service.criar(value))
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/imoveis/{id}:
 *   put:
 *     tags: [Imóveis]
 *     summary: Editar imóvel
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
 *             $ref: '#/components/schemas/ImovelInput'
 *     responses:
 *       200:
 *         description: Imóvel atualizado
 *       404:
 *         description: Imóvel não encontrado
 */
router.put('/:id', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaAtualizar.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try {
    res.json(await service.atualizar(req.params.id, value))
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/imoveis/{id}/status:
 *   patch:
 *     tags: [Imóveis]
 *     summary: Atualizar status do imóvel
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
 *             $ref: '#/components/schemas/StatusImovelInput'
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/:id/status', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  const { error, value } = schemaStatus.validate(req.body)
  if (error) return res.status(400).json({ erro: error.details[0].message })
  try {
    res.json(await service.atualizarStatus(req.params.id, value.status))
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

/**
 * @swagger
 * /api/imoveis/{id}:
 *   delete:
 *     tags: [Imóveis]
 *     summary: Remover imóvel
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
  try {
    await service.remover(req.params.id)
    res.status(204).send()
  } catch (e) {
    res.status(e.status || 500).json({ erro: e.mensagem || 'Erro interno' })
  }
})

module.exports = router
