# 📖 Guía de Instalación y Primeros Pasos

Esta sección detalla cómo poner en marcha el **Gestor de Faltas** en las diferentes plataformas compatibles y cómo se gestionan tus datos.

---

### 🐧 Linux (AppImage)
El formato AppImage permite ejecutar la aplicación sin necesidad de una instalación tradicional, manteniendo el sistema limpio.

1.  **Permisos de ejecución**:
    * Haz clic derecho sobre el archivo `.AppImage` -> *Propiedades* -> *Permisos* -> Marca **"Permitir ejecutar el archivo como un programa"**.
    * *O mediante terminal:* ```bash
        chmod +x "Gestor de Faltas-1.0.0.AppImage"
        ```
2.  **Lanzamiento**: Haz doble clic sobre el archivo.
3.  **Resolución de problemas (Sandbox)**: Si la aplicación no abre en distribuciones modernas (Ubuntu 24.04+, Debian), ejecútala con el flag de seguridad desactivado:
    ```bash
    ./"Gestor de Faltas-1.0.0.AppImage" --no-sandbox
    ```

---

### 🪟 Windows (Portable / ZIP)
La versión para Windows no requiere instalación y puede ejecutarse desde cualquier carpeta o pendrive.

1.  **Descompresión**: Si has descargado el archivo `.zip`, extráelo en la carpeta que prefieras.
2.  **Ejecución**: Haz doble clic en `Gestor de Faltas.exe`.
3.  **Aviso de SmartScreen**: Al ser una aplicación de autor independiente, Windows puede mostrar un mensaje de "Protegió su PC". Haz clic en **"Más información"** y luego en **"Ejecutar de todas formas"**.

---

### 🗄️ Ubicación de los Datos y Backup
La aplicación genera automáticamente una base de datos local la primera vez que se inicia. **Tus datos son privados y nunca salen de tu ordenador.**

Para realizar copias de seguridad o migrar tus datos a otro equipo, debes copiar el archivo `database.db` que se encuentra en las siguientes rutas:

* **En Linux**: `~/.config/faltas-app/database/database.db`
* **En Windows**: `%APPDATA%/faltas-app/database/database.db`

> [!TIP]
> **Importación rápida**: Si ya tienes un listado de ciclos y módulos en formato JSON, puedes cargarlos masivamente desde el panel de *Configuración* dentro de la aplicación.

---

### 🍎 macOS (ZIP / DMG)
Debido a que la aplicación no está firmada digitalmente por Apple, el sistema bloqueará su ejecución inicial por seguridad.

1.  **Instalación**: Descomprime el archivo `.zip` y mueve la aplicación a tu carpeta de **Aplicaciones**.
2.  **Primer arranque**: 
    * No hagas doble clic directamente. Haz **clic derecho** (o Control + Clic) sobre el icono de la app y selecciona **Abrir**.
    * Aparecerá un cuadro de diálogo advirtiendo que el desarrollador no está identificado. Haz clic de nuevo en el botón **Abrir**.
3.  **Permisos**: Este proceso solo es necesario la primera vez; después podrás abrirla normalmente.

---

### 🗄️ Ubicación de los Datos y Backup (Actualizado)
* **En Linux**: `~/.config/faltas-app/database/database.db`
* **En Windows**: `%APPDATA%/faltas-app/database/database.db`
* **En macOS**: `~/Library/Application Support/faltas-app/database/database.db`

---

### 🚀 Uso por primera vez
Al abrir la aplicación por primera vez, verás el panel vacío. El flujo recomendado es:
1. Ir a la sección **Configuración**.
2. Definir el límite de faltas permitido por tu centro.
3. Crear tus **Ciclos** y **Módulos** manualmente o mediante la importación JSON.