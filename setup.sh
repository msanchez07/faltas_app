#!/bin/bash

echo "🛠️ Iniciando configuración del entorno para Gestor de Faltas..."

# 1. Eliminar rastros previos para evitar conflictos
echo "🧹 Limpiando instalaciones antiguas..."
rm -rf node_modules package-lock.json

# 2. Instalar dependencias de npm
echo "📥 Instalando dependencias de Node (esto puede tardar)..."
npm install

# 3. Reconstruir better-sqlite3 para la versión de Electron actual
echo "🏗️ Reconstruyendo módulos nativos (SQLite)..."
npx electron-rebuild -f -w better-sqlite3

echo "✅ Entorno configurado correctamente."
echo "👉 Ahora puedes ejecutar: npm run start (Angular) o npm run electron (App)"