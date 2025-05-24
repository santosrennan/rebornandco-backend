#!/bin/bash

echo "🚀 TESTE DE COMPORTAMENTO DE PRODUÇÃO"
echo "======================================"

# Definir variáveis de produção
export NODE_ENV=production
export PORT=3000
export DB_HOST=localhost
export DB_USERNAME=reborn_user  
export DB_PASSWORD=reborn_pass
export DB_DATABASE=reborn_db
export MONGODB_URI=mongodb://localhost:27017/rebornandco-logs
export REDIS_HOST=localhost
export JWT_SECRET=production_super_secret_jwt_key_min_32_characters_long
export JWT_REFRESH_SECRET=production_refresh_secret_min_32_characters_long

echo "🔧 Configuração de Produção:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   Database: ***://***:***/***"
echo ""

echo "🏗️  Compilando aplicação..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Compilação bem-sucedida!"
    echo ""
    echo "🚀 Iniciando aplicação em modo PRODUÇÃO..."
    echo "   - Swagger deve estar BLOQUEADO"
    echo "   - Logs devem ser MÍNIMOS"
    echo "   - Informações sensíveis OCULTAS"
    echo ""
    
    # Iniciar aplicação em background por 10 segundos
    timeout 10s npm run start:prod &
    APP_PID=$!
    
    # Aguardar aplicação iniciar
    sleep 3
    
    echo "🧪 TESTES DE SEGURANÇA:"
    echo ""
    
    # Teste 1: Verificar se root está bloqueada
    echo "1️⃣ Testando acesso à rota raiz (/)..."
    curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/ || echo "❌ Erro de conexão"
    
    # Teste 2: Verificar se docs está bloqueada  
    echo "2️⃣ Testando acesso ao Swagger (/docs)..."
    curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000/docs || echo "❌ Erro de conexão"
    
    # Teste 3: Verificar headers de segurança
    echo "3️⃣ Verificando headers de segurança..."
    curl -s -I http://localhost:3000/health | head -10 || echo "❌ Erro de conexão"
    
    # Parar aplicação
    kill $APP_PID 2>/dev/null
    
    echo ""
    echo "✅ Testes de produção concluídos!"
else
    echo "❌ Falha na compilação!"
    exit 1
fi 