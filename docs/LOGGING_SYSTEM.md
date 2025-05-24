# 📊 Sistema de Logging Avançado - RebornAndCo

## 🎯 **Visão Geral**

Implementamos um **sistema de logging robusto e profissional** que garante:

- ✅ **Rastreamento completo** de todas as operações
- ✅ **Detecção automática** de problemas
- ✅ **Alertas em tempo real** para situações críticas
- ✅ **Dashboard de monitoramento** com métricas
- ✅ **Correlation IDs** para debug end-to-end
- ✅ **Sanitização automática** de dados sensíveis

---

## 🏗️ **Arquitetura do Sistema**

### **1. Camadas de Logging**

```
┌─────────────────────────────────────────┐
│           🌐 HTTP Requests               │
├─────────────────────────────────────────┤
│        📡 LoggingInterceptor             │ ← Captura TODAS as requisições
├─────────────────────────────────────────┤
│         💼 Use Cases                     │ ← Logs de business events
├─────────────────────────────────────────┤
│       🛡️ Security & Errors              │ ← Logs de segurança
├─────────────────────────────────────────┤
│         🗄️ MongoDB Storage               │ ← Armazenamento estruturado
├─────────────────────────────────────────┤
│         🚨 AlertService                  │ ← Monitoramento ativo
└─────────────────────────────────────────┘
```

### **2. Componentes Principais**

| Componente | Responsabilidade | Localização |
|------------|------------------|-------------|
| `LoggerService` | Gerenciar logs no MongoDB | `infrastructure/mongodb/` |
| `LoggingInterceptor` | Capturar requisições HTTP | `shared/interceptors/` |
| `AlertService` | Detectar problemas automáticamente | `infrastructure/monitoring/` |
| `MonitoringController` | Dashboard de logs | `modules/` |

---

## 📋 **Tipos de Logs Capturados**

### **🔐 AUTH (Autenticação)**
- ✅ Login bem-sucedido
- ❌ Tentativas de login falhadas
- ⚠️ Usuários desativados tentando acessar
- 🔒 Operações de JWT

### **👶 REBORN (Negócio)**
- ✅ Criação de reborn
- ✅ Atualizações de dados
- ❌ Falhas nas operações
- 📊 Métricas de uso

### **🌐 API (Requisições)**
- 📥 Todas as requisições HTTP
- ⏱️ Tempo de resposta
- 📊 Status codes
- 🐌 Requisições lentas (>5s)

### **🛡️ SECURITY (Segurança)**
- 🚨 Rate limiting ativado
- 🔒 Tentativas de acesso suspeitas
- 🛡️ Ataques detectados

### **⚙️ SYSTEM (Sistema)**
- 🚨 Alertas críticos
- 💾 Problemas de infraestrutura
- 📈 Métricas de saúde

---

## 🔍 **Correlation IDs**

Cada requisição recebe um **ID único** para rastreamento:

```http
Headers:
x-correlation-id: 550e8400-e29b-41d4-a716-446655440000

Response:
x-correlation-id: 550e8400-e29b-41d4-a716-446655440000
```

**Benefícios:**
- ✅ Rastrear requisição do início ao fim
- ✅ Debug distribuído entre serviços
- ✅ Correlacionar logs relacionados

---

## 📊 **Níveis de Log**

| Nível | Uso | Exemplo |
|-------|-----|---------|
| `DEBUG` | Desenvolvimento | Variáveis, estados internos |
| `INFO` | Eventos normais | Login realizado, reborn criado |
| `WARN` | Situações suspeitas | Rate limit próximo, dados inválidos |
| `ERROR` | Erros recuperáveis | Validação falhou, API externa indisponível |
| `CRITICAL` | Falhas críticas | BD inacessível, sistema corrompido |

---

## 🚨 **Sistema de Alertas**

### **Regras Padrão Ativas**

| Alerta | Condição | Severidade | Ação |
|--------|-----------|------------|------|
| **Erros Críticos** | Qualquer log CRITICAL | 💀 CRITICAL | Notificação imediata |
| **Login Failures** | 5+ falhas em 5min | 🔴 HIGH | Investigar ataques |
| **Requisições Lentas** | 10+ req >5s em 5min | 🟠 MEDIUM | Performance check |
| **Alta Taxa de Erros** | 20+ erros 5xx em 5min | 🔴 HIGH | Verificar sistema |

### **Canais de Notificação**

```typescript
// Configurado para expansão futura:
- Console (atual)
- Slack/Discord
- Email
- SMS
- PagerDuty
```

---

## 🎛️ **Dashboard de Monitoramento**

### **Endpoints Disponíveis**

```bash
# Dashboard principal
GET /monitoring/dashboard

# Logs filtrados
GET /monitoring/logs?context=AUTH&limit=100
GET /monitoring/logs?userId=123&limit=50

# Alertas recentes
GET /monitoring/alerts?limit=20

# Regras ativas
GET /monitoring/rules

# Status de saúde
GET /monitoring/health
```

### **Exemplo de Response do Dashboard**

```json
{
  "summary": {
    "totalErrorLogs": 5,
    "totalActiveAlerts": 1,
    "totalActiveRules": 4,
    "healthStatus": "healthy"
  },
  "errorLogs": [...],
  "recentAlerts": [...],
  "activeRules": [...]
}
```

---

## 🔒 **Segurança e Sanitização**

### **Dados Automaticamente Sanitizados**

```typescript
// Campos sensíveis removidos automaticamente:
const sanitizedFields = [
  'password',
  'token', 
  'secret',
  'key',
  'authorization'
]

// Headers sensíveis:
const sensitiveHeaders = [
  'authorization',
  'cookie',
  'x-api-key'
]
```

### **Exemplo de Log Sanitizado**

```json
{
  "level": "info",
  "context": "AUTH",
  "message": "Login realizado com sucesso",
  "details": {
    "email": "user@example.com",
    "password": "[SANITIZED]",
    "authHeader": "[SANITIZED]"
  }
}
```

---

## 🚀 **Performance e Otimização**

### **MongoDB Otimizado**

```javascript
// Índices criados automaticamente:
- level (compound)
- context (compound) 
- userId (single)
- timestamp (single)
- ip (single)
```

### **Configurações de Performance**

```typescript
// Rate limiting para logs:
- Debounce de alertas: 10 minutos
- Máx logs por batch: 1000
- Retention automático: 30 dias
- Compression: Automática
```

---

## 📈 **Métricas e KPIs**

### **Health Score Calculation**

```typescript
baseScore = 100
- criticalErrors * 20 points
- regularErrors * 2 points  
- criticalAlerts * 15 points

Status:
- 90-100: healthy ✅
- 70-89: warning ⚠️
- <70: critical 🚨
```

### **Alertas de Performance**

- 🐌 Requisições >5s = Warning
- 💾 MongoDB lento = Critical
- 📊 Rate limit alto = Medium
- 🔒 Múltiplos logins falhos = High

---

## 🛠️ **Configuração e Deploy**

### **Variáveis de Ambiente**

```bash
# MongoDB para logs
MONGODB_URI=mongodb://localhost:27017/rebornandco-logs

# Configurações de alertas
ALERT_EMAIL=admin@rebornandco.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Retention
LOG_RETENTION_DAYS=30
```

### **Docker Compose**

```yaml
services:
  mongodb-logs:
    image: mongo:6
    ports:
      - "27018:27017"
    volumes:
      - mongodb_logs:/data/db
    environment:
      MONGO_INITDB_DATABASE: rebornandco-logs
```

---

## 🎯 **Casos de Uso Práticos**

### **1. Debug de Problema de Login**

```bash
# Buscar logs de usuário específico
GET /monitoring/logs?userId=123&context=AUTH

# Procurar correlation ID
grep "correlation-id: abc-123" logs/
```

### **2. Análise de Performance**

```bash
# Requisições lentas
GET /monitoring/logs | grep "responseTime.*[5-9][0-9]{3}"

# Dashboard geral
GET /monitoring/health
```

### **3. Investigação de Segurança**

```bash
# Tentativas de login suspeitas
GET /monitoring/logs?context=SECURITY

# Múltiplas falhas do mesmo IP
GET /monitoring/alerts | grep "multiple-login-failures"
```

---

## 🎮 **Como Usar na Prática**

### **1. Adicionar Log Custom**

```typescript
// No seu use case
constructor(
  private readonly loggerService: LoggerService
) {}

async minhaOperacao() {
  await this.loggerService.info(
    LogContext.REBORN,
    'Operação iniciada',
    { userId: '123', action: 'create' },
    { userId: '123' }
  )
}
```

### **2. Criar Alerta Custom**

```typescript
// Adicionar nova regra
this.alertService.addRule({
  id: 'minha-regra',
  name: 'Meu Alerta',
  description: 'Detecta situação específica',
  condition: (logs) => logs.length > 10,
  severity: 'HIGH',
  enabled: true
})
```

### **3. Monitorar Health**

```bash
# Verificar status
curl http://localhost:3000/monitoring/health

# Dashboard completo  
curl http://localhost:3000/monitoring/dashboard
```

---

## ✅ **Checklist de Implementação**

- ✅ LoggerService completo
- ✅ Interceptor global configurado
- ✅ Use cases logando eventos
- ✅ Sistema de alertas ativo
- ✅ Dashboard funcional
- ✅ Correlation IDs implementados
- ✅ Sanitização de dados sensíveis
- ✅ MongoDB configurado
- ✅ Documentação completa

---

## 🎯 **Próximos Passos Recomendados**

1. **🔔 Integrar Slack/Discord** para alertas
2. **📊 Implementar Grafana** para visualizações
3. **🤖 AI Analysis** para detectar padrões
4. **📱 App mobile** para monitoramento
5. **🔍 Log aggregation** com ELK Stack
6. **📈 Business intelligence** dashboards

---

**Sistema de logging profissional implementado com sucesso! 🎉**

Agora você tem **visibilidade completa** do que acontece na sua aplicação e **detecção automática** de problemas. 