#!/bin/bash

# Script de inicio para la API de Citas Históricas Colombianas
# Uso: ./start.sh

echo "🇨🇴 Iniciando API de Citas Históricas Colombianas..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "✅ Node.js y npm están instalados"
echo "📦 Instalando dependencias..."

# Instalar dependencias
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
    echo ""
    echo "🚀 Iniciando servidor..."
    echo "📡 La API estará disponible en: http://localhost:3000"
    echo "📚 Documentación disponible en: http://localhost:3000/"
    echo ""
    echo "💡 Para detener el servidor, presiona Ctrl+C"
    echo ""
    
    # Iniciar el servidor
    npm start
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi
