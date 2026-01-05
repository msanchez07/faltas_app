#!/bin/bash

echo "🚀 Iniciando proceso de empaquetado multiplataforma..."

# 1. Limpiar versiones anteriores
rm -rf release

# 2. Crear carpetas fantasma para evitar el error de scandir (@napi-rs/canvas)
echo "📂 Creando carpetas de compatibilidad..."
mkdir -p node_modules/@napi-rs/canvas-android-arm64 \
         node_modules/@napi-rs/canvas-android-arm-eabi \
         node_modules/@napi-rs/canvas-darwin-arm64 \
         node_modules/@napi-rs/canvas-darwin-x64 \
         node_modules/@napi-rs/canvas-win32-arm64-msvc \
         node_modules/@napi-rs/canvas-win32-ia32-msvc \
         node_modules/@napi-rs/canvas-win32-x64-msvc \
         node_modules/@napi-rs/canvas-linux-arm64-gnu

# 3. Compilar Angular
echo "📦 Compilando aplicación Angular..."
npm run build

# 4. Empaquetar para las tres plataformas
# Usamos la variable de entorno para ignorar dependencias faltantes
export ELECTRON_BUILDER_ALLOW_MISSING_DEPENDENCIES=true



echo "🐧 Generando para Linux..."
npx electron-builder --linux --x64 -c.npmRebuild=false

echo "✅ Proceso finalizado. Revisa la carpeta /release"