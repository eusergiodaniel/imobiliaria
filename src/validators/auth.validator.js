const Joi = require('joi')

const schemaRegistro = Joi.object({
  nome:  Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  papel: Joi.string().valid('admin', 'agente', 'cliente').default('cliente'),
})

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
})

module.exports = { schemaRegistro, schemaLogin }
