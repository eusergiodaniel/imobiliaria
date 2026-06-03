const Joi = require('joi')

const schemaCriar = Joi.object({
  nome:     Joi.string().min(2).required(),
  email:    Joi.string().email().required(),
  telefone: Joi.string().optional(),
  cpf:      Joi.string().length(11).required(),
})

const schemaAtualizar = schemaCriar.fork(
  ['nome', 'email', 'cpf'],
  (f) => f.optional()
)

module.exports = { schemaCriar, schemaAtualizar }
