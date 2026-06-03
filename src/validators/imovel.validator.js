const Joi = require('joi')

const schemaCriar = Joi.object({
  titulo:    Joi.string().min(3).required(),
  descricao: Joi.string().optional(),
  tipo:      Joi.string().valid('apartamento', 'casa', 'comercial', 'terreno').required(),
  preco:     Joi.number().positive().required(),
  area:      Joi.number().positive().required(),
  endereco:  Joi.string().required(),
  bairro:    Joi.string().required(),
  cidade:    Joi.string().required(),
  fotoUrl:   Joi.string().uri().optional(),
})

const schemaAtualizar = schemaCriar.fork(
  ['titulo', 'tipo', 'preco', 'area', 'endereco', 'bairro', 'cidade'],
  (f) => f.optional()
)

const schemaStatus = Joi.object({
  status: Joi.string().valid('disponivel', 'reservado', 'vendido', 'alugado').required(),
})

module.exports = { schemaCriar, schemaAtualizar, schemaStatus }
