#!/bin/bash

echo "🛠️ Iniciando configuración del entorno para Gestor de Faltas..."

# 1. Eliminar rastros previos para evitar conflictos
echo "🧹 Limpiando instalaciones antiguas..."
rm -rf node_modules package-lock.json

# 2. Instalar dependencias de npm
echo "📥 Instalando dependencias de Node (esto puede tardar)..."
npm install

# 3. Crear carpetas fantasma para @napi-rs/canvas
# Esto evita el error de 'scandir' al empaquetar en Linux
echo "📂 Creando carpetas de compatibilidad para el empaquetador..."
mkdir -p node_modules/@napi-rs/canvas-android-arm64 \
         node_modules/@napi-rs/canvas-android-arm-eabi \
         node_modules/@napi-rs/canvas-darwin-arm64 \
         node_modules/@napi-rs/canvas-darwin-x64 \
         node_modules/@napi-rs/canvas-win32-arm64-msvc \
         node_modules/@napi-rs/canvas-win32-ia32-msvc \
         node_modules/@napi-rs/canvas-win32-x64-msvc \
         node_modules/@napi-rs/canvas-linux-arm64-gnu

# 4. Reconstruir better-sqlite3 para la versión de Electron actual
echo "🏗️ Reconstruyendo módulos nativos (SQLite)..."
npx electron-rebuild -f -w better-sqlite3

echo "✅ Entorno configurado correctamente."
echo "👉 Ahora puedes ejecutar: npm run start (Angular) o npm run electron (App)"