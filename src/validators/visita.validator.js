const Joi = require('joi')

const schemaCriar = Joi.object({
  dataHora:   Joi.date().required(),
  observacao: Joi.string().optional(),
  imovelId:   Joi.number().integer().positive().required(),
  clienteId:  Joi.number().integer().positive().required(),
})

const schemaStatus = Joi.object({
  status: Joi.string().valid('agendada', 'realizada', 'cancelada').required(),
})

module.exports = { schemaCriar, schemaStatus }
