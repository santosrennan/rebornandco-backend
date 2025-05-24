# 🎭 **RebornAndCo Backend**

**API REST para gerenciamento de bonecos reborn**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 **Sobre o Projeto**

Sistema backend para gerenciamento de bonecos reborn com:

- 🏛️ **Arquitetura limpa** e organizada
- 🛡️ **Autenticação** e autorização
- 📊 **Monitoramento** e logs
- 🚀 **Performance otimizada** com cache

---

## 🏗️ **Stack Tecnológica**

| Componente | Tecnologia | Propósito |
|------------|------------|-----------|
| **Framework** | NestJS | Framework web |
| **Database** | PostgreSQL | Dados principais |
| **Logs** | MongoDB | Logs estruturados |
| **Cache** | Redis | Cache e sessões |
| **ORM** | TypeORM | Mapeamento de dados |
| **Auth** | JWT | Autenticação |

## 📁 **Estrutura do Projeto**

```
src/
├── 📁 domain/              # Entidades e regras de negócio
├── 📁 application/         # Casos de uso e serviços
├── 📁 infrastructure/      # Banco, auth, security, monitoring
├── 📁 controllers/         # Controllers HTTP da API
├── 📁 config/             # Configurações
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

### **Setup**

```bash
# 1. Clone e instale
git clone <repository-url>
cd rebornandco-backend
npm install

# 2. Configure ambiente
cp env.example .env
# Edite .env com suas configurações

# 3. Prepare banco
npm run migration:run

# 4. Execute
npm run start:dev
```

**Acesso**: `http://localhost:3000` | **Docs**: `http://localhost:3000/docs`

---

## 🔧 **Scripts Disponíveis**

```bash
npm run start:dev         # Desenvolvimento
npm run build            # Build para produção
npm run start:prod       # Produção
npm run test             # Testes unitários
npm run test:e2e         # Testes e2e
npm run lint             # Verificação de código
npm run format           # Formatação
```

---

## 📚 **Principais Funcionalidades**

### **✅ Implementado**
- Autenticação e autorização (JWT)
- CRUD de usuários
- CRUD de reborns
- Sistema de logs
- Validação de dados
- Rate limiting
- Health checks
- Documentação Swagger

### **🚧 Em Desenvolvimento**
- Dashboard de monitoramento
- Sistema de notificações
- Upload de imagens
- Relatórios

### **📋 Planejado**
- Sistema de backup automático
- Métricas avançadas
- API de terceiros

---

## 🧪 **Testes**

```bash
# Executar todos os testes
npm run test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## 📖 **Documentação**

- **API Docs**: `http://localhost:3000/docs` (Swagger)
- **Configuração**: Ver `env.example`
- **Segurança**: Ver `SECURITY.md`

---

**Desenvolvido com ❤️ pela equipe RebornAndCo**
