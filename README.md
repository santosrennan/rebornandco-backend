# 🎭 **RebornAndCo Backend**

**API REST profissional para gerenciamento de bonecos reborn com arquitetura empresarial**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

---

## 📋 **Índice**

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Instalação](#-instalação)
- [🔧 Configuração](#-configuração)
- [📚 API](#-api)
- [🔒 Segurança](#-segurança)
- [🧪 Testes](#-testes)

---

## 🎯 **Sobre o Projeto**

Sistema backend completo para gerenciamento de bonecos reborn implementando **Clean Architecture** com:

- 🏛️ **Separação clara** de camadas (Domain, Application, Infrastructure, Interface)
- 🛡️ **Segurança robusta** com JWT, rate limiting e validações
- 📊 **Monitoramento completo** com logs estruturados e alertas
- 🔧 **Configuração centralizada** com validação automática
- 🚀 **Performance otimizada** com cache Redis

---

## 🏗️ **Arquitetura**

### **Stack Tecnológica**

| Componente | Tecnologia | Propósito |
|------------|------------|-----------|
| **Framework** | NestJS | Framework web |
| **Database** | PostgreSQL | Dados principais |
| **Logs** | MongoDB | Logs estruturados |
| **Cache** | Redis | Cache e sessões |
| **ORM** | TypeORM | Mapeamento de dados |
| **Auth** | JWT | Autenticação |

### **Estrutura de Pastas**

```
src/
├── 📁 domain/              # Entidades e regras de negócio
├── 📁 application/         # Casos de uso e serviços
├── 📁 infrastructure/      # Banco, auth, security, monitoring
├── 📁 interfaces/          # Controllers e DTOs
├── 📁 config/             # Sistema de configuração centralizado
├── 📁 modules/            # Módulos NestJS
└── 📁 shared/             # Código compartilhado
```

---

## 🚀 **Instalação**

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+

### **Setup Rápido**

```bash
# 1. Clone e instale
git clone <repository-url>
cd rebornandco-backend
npm install

# 2. Configure ambiente
cp env.example .env
# Edite .env com suas configurações

# 3. Prepare bancos
npm run migration:run

# 4. Execute
npm run start:dev
```

**Acesso**: `http://localhost:3000` | **Docs**: `http://localhost:3000/docs`

---

## 🔧 **Configuração**

### **Variáveis Essenciais (.env)**

```bash
# Aplicação
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=reborn_user
DB_PASSWORD=your_password
DB_DATABASE=reborn_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017/rebornandco-logs

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (obrigatório em produção)
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
```

### **Sistema de Configuração**

- ✅ **Validação automática** de tipos e valores obrigatórios
- ✅ **Geração automática** de secrets em desenvolvimento
- ✅ **Type-safe** com interfaces TypeScript
- ✅ **Sanitização** automática de logs sensíveis

---

## 📚 **API**

### **Principais Endpoints**

```typescript
# Autenticação
POST /auth/signup          # Registro
POST /auth/login           # Login
POST /auth/refresh         # Renovar token

# Usuários
GET    /users              # Listar (admin)
GET    /users/:id          # Buscar
PUT    /users/:id          # Atualizar
DELETE /users/:id          # Remover (admin)

# Reborns
POST   /reborns            # Criar
GET    /reborns            # Listar
GET    /reborns/:id        # Buscar
PUT    /reborns/:id        # Atualizar
DELETE /reborns/:id        # Remover

# Monitoramento
GET /monitoring/dashboard   # Dashboard (admin)
GET /monitoring/health      # Health check
```

### **Formato de Resposta**

```json
// Sucesso
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data"
  }
}
```

---

## 🔒 **Segurança**

### **Proteções Implementadas**

| Proteção | Status | Descrição |
|----------|--------|-----------|
| **JWT Auth** | ✅ | Access + Refresh tokens |
| **Rate Limiting** | ✅ | 20 req/min por IP |
| **CORS** | ✅ | Origins configuráveis |
| **Helmet** | ✅ | Headers de segurança |
| **Validation** | ✅ | Sanitização de dados |
| **Logs** | ✅ | Dados sensíveis mascarados |

### **Ambiente de Produção**

- ❌ **Swagger desabilitado** automaticamente
- 🔒 **Secrets obrigatórios** (validação rigorosa)
- 🧹 **Logs sanitizados** (sem informações sensíveis)
- 🛡️ **Headers de segurança** rigorosos

---

## 🧪 **Testes**

```bash
# Executar testes
npm run test              # Unitários
npm run test:e2e          # End-to-end
npm run test:cov          # Coverage

# Modo watch
npm run test:watch
```

---

## 📊 **Monitoramento**

### **Logs Estruturados**
- 📝 Armazenados em **MongoDB**
- 🔍 **Correlation IDs** para rastreamento
- 🚨 **Alertas automáticos** para erros críticos
- 🧹 **Sanitização** de dados sensíveis

### **Dashboard**
- 📊 Métricas de **performance**
- 🖥️ Status de **sistemas** (DB, Redis)
- 📈 **Recommendations** automáticas
- 🔍 **Health checks** detalhados

---

## 🐳 **Deploy**

### **Docker (Recomendado)**

```bash
# Build e execute
docker-compose up -d

# Verificar saúde
curl http://localhost:3000/health
```

### **Produção**

```bash
npm run build
npm run start:prod
```

**Importante**: Defina todas as variáveis de ambiente de produção!

---

## 🤝 **Desenvolvimento**

### **Scripts Disponíveis**

```bash
npm run start:dev         # Desenvolvimento com hot-reload
npm run build            # Build para produção
npm run lint             # Verificação de código
npm run format           # Formatação automática
npm run migration:create # Criar migração
npm run migration:run    # Executar migrações
```

### **Padrões**
- ✅ **ESLint** + **Prettier**
- ✅ **Conventional Commits**
- ✅ **TypeScript strict**
- ✅ **Clean Architecture**

---

## 📄 **Documentação Adicional**

- 📖 **SECURITY.md** - Práticas de segurança
- 🚀 **env.example** - Configurações de exemplo

---

## 📞 **Suporte**

- 🐛 **Issues**: Reporte bugs via GitHub Issues
- 💬 **Dúvidas**: Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ pela equipe RebornAndCo**
