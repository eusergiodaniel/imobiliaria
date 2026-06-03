# 🏢 ImovelHub API

Sistema de Gestão Imobiliária — Node.js + Express + Prisma + SQLite

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar o banco de dados
```bash
npm run db:migrate
```

### 3. Popular com dados de exemplo (opcional)
```bash
npm run db:seed
```

### 4. Iniciar o servidor
```bash
npm start
# ou com auto-reload:
npm run dev
```

A API estará disponível em: **http://localhost:3000**

---

## 👤 Usuários do seed

| E-mail                   | Senha  | Papel  |
|--------------------------|--------|--------|
| admin@imobiliaria.com    | 123456 | admin  |
| agente@imobiliaria.com   | 123456 | agente |
| cliente@email.com        | 123456 | cliente|

---

## 📋 Endpoints

### Auth
| Método | Rota                   | Descrição         | Acesso  |
|--------|------------------------|-------------------|---------|
| POST   | /api/auth/registrar    | Criar conta       | Público |
| POST   | /api/auth/login        | Login + token JWT | Público |

### Imóveis
| Método | Rota                        | Descrição             | Acesso          |
|--------|-----------------------------|-----------------------|-----------------|
| GET    | /api/imoveis                | Listar com filtros    | Público         |
| GET    | /api/imoveis/:id            | Buscar por ID         | Público         |
| POST   | /api/imoveis                | Cadastrar             | Admin / Agente  |
| PUT    | /api/imoveis/:id            | Editar                | Admin / Agente  |
| PATCH  | /api/imoveis/:id/status     | Atualizar status      | Admin / Agente  |
| DELETE | /api/imoveis/:id            | Remover               | Admin           |

### Clientes
| Método | Rota               | Descrição    | Acesso         |
|--------|--------------------|--------------|----------------|
| GET    | /api/clientes      | Listar       | Admin / Agente |
| GET    | /api/clientes/:id  | Buscar por ID| Admin / Agente |
| POST   | /api/clientes      | Cadastrar    | Admin / Agente |
| PUT    | /api/clientes/:id  | Editar       | Admin / Agente |
| DELETE | /api/clientes/:id  | Remover      | Admin          |

### Contratos
| Método | Rota                         | Descrição        | Acesso         |
|--------|------------------------------|------------------|----------------|
| GET    | /api/contratos               | Listar           | Admin / Agente |
| GET    | /api/contratos/:id           | Buscar por ID    | Admin / Agente |
| POST   | /api/contratos               | Criar contrato   | Admin / Agente |
| PATCH  | /api/contratos/:id/status    | Atualizar status | Admin / Agente |

### Visitas
| Método | Rota                       | Descrição        | Acesso          |
|--------|----------------------------|------------------|-----------------|
| GET    | /api/visitas               | Listar           | Autenticado     |
| GET    | /api/visitas/:id           | Buscar por ID    | Autenticado     |
| POST   | /api/visitas               | Agendar          | Autenticado     |
| PATCH  | /api/visitas/:id/status    | Atualizar status | Admin / Agente  |

---

## 🔐 Autenticação

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

O token é obtido no endpoint `POST /api/auth/login`.

---

## 📦 Exemplos de requisição

### Login
```json
POST /api/auth/login
{
  "email": "admin@imobiliaria.com",
  "senha": "123456"
}
```

### Cadastrar imóvel
```json
POST /api/imoveis
Authorization: Bearer <token>
{
  "titulo": "Casa 3 quartos - Nazare",
  "tipo": "casa",
  "preco": 380000,
  "area": 120,
  "endereco": "Rua dos Mundurucus, 450",
  "bairro": "Nazare",
  "cidade": "Belem"
}
```

### Filtros de busca de imóveis
```
GET /api/imoveis?tipo=apartamento&bairro=Umarizal&precoMin=200000&precoMax=600000
```

### Criar contrato
```json
POST /api/contratos
Authorization: Bearer <token>
{
  "tipo": "compra",
  "valorTotal": 380000,
  "dataInicio": "2025-03-01",
  "imovelId": 1,
  "clienteId": 1
}
```

### Agendar visita
```json
POST /api/visitas
Authorization: Bearer <token>
{
  "dataHora": "2025-03-05T10:00:00",
  "imovelId": 1,
  "clienteId": 1,
  "observacao": "Cliente prefere manhã"
}
```

---

## 🏗️ Arquitetura

```
src/
├── app.js                  # Entrada da aplicação
├── prisma.js               # Cliente Prisma singleton
├── routes/                 # Camada de Rotas (Express Router)
│   ├── auth.routes.js
│   ├── imovel.routes.js
│   ├── cliente.routes.js
│   ├── contrato.routes.js
│   └── visita.routes.js
├── services/               # Camada de Serviço (regras de negócio)
│   ├── auth.service.js
│   ├── imovel.service.js
│   ├── cliente.service.js
│   ├── contrato.service.js
│   └── visita.service.js
├── repositories/           # Camada de Dados (acesso ao banco)
│   ├── auth.repository.js
│   ├── imovel.repository.js
│   ├── cliente.repository.js
│   ├── contrato.repository.js
│   └── visita.repository.js
├── middlewares/
│   └── auth.js             # JWT + RBAC
└── validators/             # Validação com Joi
    ├── auth.validator.js
    ├── imovel.validator.js
    ├── cliente.validator.js
    ├── contrato.validator.js
    └── visita.validator.js
prisma/
├── schema.prisma           # Modelos do banco
└── seed.js                 # Dados iniciais
```

## 🛠️ Tech Stack

- **Node.js** + **Express** — Servidor HTTP
- **Prisma ORM** — Acesso ao banco de dados
- **SQLite** — Banco de dados (arquivo local)
- **JWT** — Autenticação stateless
- **bcryptjs** — Hash de senhas
- **Joi** — Validação de dados
- **cors** — Cross-Origin Resource Sharing
