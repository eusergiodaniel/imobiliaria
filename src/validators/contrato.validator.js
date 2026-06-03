const Joi = require('joi')

const schemaCriar = Joi.object({
  tipo:       Joi.string().valid('compra', 'locacao').required(),
  valorTotal: Joi.number().positive().required(),
  dataInicio: Joi.date().required(),
  dataFim:    Joi.date().optional(),
  observacao: Joi.string().optional(),
  imovelId:   Joi.number().integer().positive().required(),
  clienteId:  Joi.number().integer().positive().required(),
})

const schemaStatus = Joi.object({
  status: Joi.string().valid('ativo', 'encerrado', 'cancelado').required(),
})

module.exports = { schemaCriar, schemaStatus }
