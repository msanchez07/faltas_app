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

# 5. Generar para Linux (AppImage)
echo "🐧 Generando para Linux..."
npx electron-builder --linux --x64 -c.npmRebuild=false

# 6. Generar para Windows y Comprimir
echo "🪟 Generando para Windows..."
npx electron-builder --win --x64 -c.npmRebuild=false

if [ -d "release/linux-unpacked" ] || [ -d "release/win-unpacked" ]; then
    echo "🗜️  Comprimiendo binarios de Windows..."
    cd release
    # Comprimimos el contenido de la carpeta unpacked en un zip
    zip -r "Gestor-de-Faltas-Windows-x64.zip" win-unpacked/
    cd ..
    echo "✅ Archivo ZIP generado en la carpeta /release"
else
    echo "❌ Error: No se encontró la carpeta win-unpacked para comprimir."
fi

# 7. Generar para Mac
echo "🍎 Generando para macOS..."
npx electron-builder --mac --x64 -c.npmRebuild=false


rm -R release/linux-unpacked
rm -R release/win-unpacked
rm -R release/mac-arm64
rm -R release/mac
rm -R release/.icon-icns
rm -R release/.icon-ico
rm release/builder-debug.yml
rm release/builder-effective-config.yaml
rm release/latest-linux.yml
rm release/latest-mac.yml
rm "release/Gestor de Faltas-1.0.0-arm64-mac.zip.blockmap"
rm "release/Gestor de Faltas-1.0.0-mac.zip.blockmap"

echo "✅ Proceso finalizado. Revisa la carpeta /release"