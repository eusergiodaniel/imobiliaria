const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏢 ImovelHub API',
      version: '1.0.0',
      description: 'Sistema de Gestão Imobiliária — Node.js + Express',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────
        LoginInput: {
          type: 'object', required: ['email', 'senha'],
          properties: {
            email: { type: 'string', example: 'admin@imobiliaria.com' },
            senha: { type: 'string', example: '123456' },
          },
        },
        RegistroInput: {
          type: 'object', required: ['nome', 'email', 'senha'],
          properties: {
            nome:  { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            senha: { type: 'string', example: 'minhasenha123' },
            papel: { type: 'string', enum: ['admin', 'agente', 'cliente'], default: 'cliente' },
          },
        },
        // ── Imóvel ────────────────────────────────────────────
        ImovelInput: {
          type: 'object', required: ['titulo', 'tipo', 'preco', 'area', 'endereco', 'bairro', 'cidade'],
          properties: {
            titulo:    { type: 'string',  example: 'Apartamento 3 quartos - Batista Campos' },
            descricao: { type: 'string',  example: 'Amplo, varanda, 2 vagas de garagem' },
            tipo:      { type: 'string',  enum: ['apartamento', 'casa', 'comercial', 'terreno'], example: 'apartamento' },
            preco:     { type: 'number',  example: 450000 },
            area:      { type: 'number',  example: 110 },
            endereco:  { type: 'string',  example: 'Av. Gov. José Malcher, 1500' },
            bairro:    { type: 'string',  example: 'Batista Campos' },
            cidade:    { type: 'string',  example: 'Belém' },
            fotoUrl:   { type: 'string',  example: 'https://exemplo.com/foto.jpg' },
          },
        },
        StatusImovelInput: {
          type: 'object', required: ['status'],
          properties: {
            status: { type: 'string', enum: ['disponivel', 'reservado', 'vendido', 'alugado'] },
          },
        },
        // ── Cliente ───────────────────────────────────────────
        ClienteInput: {
          type: 'object', required: ['nome', 'email', 'cpf'],
          properties: {
            nome:     { type: 'string', example: 'Ana Souza' },
            email:    { type: 'string', example: 'ana@email.com' },
            telefone: { type: 'string', example: '91999990001' },
            cpf:      { type: 'string', example: '12345678901' },
          },
        },
        // ── Contrato ──────────────────────────────────────────
        ContratoInput: {
          type: 'object', required: ['tipo', 'valorTotal', 'dataInicio', 'imovelId', 'clienteId'],
          properties: {
            tipo:       { type: 'string', enum: ['compra', 'locacao'], example: 'compra' },
            valorTotal: { type: 'number', example: 450000 },
            dataInicio: { type: 'string', format: 'date', example: '2025-03-01' },
            dataFim:    { type: 'string', format: 'date', example: '2026-03-01' },
            observacao: { type: 'string', example: 'Pagamento à vista' },
            imovelId:   { type: 'integer', example: 1 },
            clienteId:  { type: 'integer', example: 1 },
          },
        },
        StatusContratoInput: {
          type: 'object', required: ['status'],
          properties: {
            status: { type: 'string', enum: ['ativo', 'encerrado', 'cancelado'] },
          },
        },
        // ── Visita ────────────────────────────────────────────
        VisitaInput: {
          type: 'object', required: ['dataHora', 'imovelId', 'clienteId'],
          properties: {
            dataHora:   { type: 'string', format: 'date-time', example: '2025-03-05T10:00:00' },
            observacao: { type: 'string', example: 'Cliente prefere manhã' },
            imovelId:   { type: 'integer', example: 1 },
            clienteId:  { type: 'integer', example: 1 },
          },
        },
        StatusVisitaInput: {
          type: 'object', required: ['status'],
          properties: {
            status: { type: 'string', enum: ['agendada', 'realizada', 'cancelada'] },
          },
        },
      },
    },
    tags: [
      { name: 'Auth',      description: 'Registro e login de usuários' },
      { name: 'Imóveis',   description: 'Gestão de imóveis' },
      { name: 'Clientes',  description: 'Gestão de clientes' },
      { name: 'Contratos', description: 'Contratos de compra e locação' },
      { name: 'Visitas',   description: 'Agendamento de visitas' },
    ],
  },
  apis: ['./src/routes/*.js'],
}

module.exports = swaggerJsdoc(options)
