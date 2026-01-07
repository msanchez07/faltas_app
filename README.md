# 📊 Gestor de Faltas

**Gestor de Faltas** es una aplicación de escritorio multiplataforma diseñada para el control de asistencia en centros educativos. Permite gestionar Ciclos, Módulos y registrar faltas de asistencia calculando automáticamente los porcentajes de absentismo sobre las horas totales de cada módulo.

> **Desarrollado por:** Manuel Sánchez Gomis  
> **Contacto:** [me.sanchezgomis@edu.gva.es](mailto:me.sanchezgomis@edu.gva.es)

---

## 📥 Descargas (Releases)

Para empezar a utilizar la aplicación sin necesidad de compilar el código, descarga la versión correspondiente a tu sistema operativo directamente desde la carpeta de este repositorio:

👉 **[Explorar Carpeta de Lanzamientos (Releases)](./release)**

| Plataforma | Formato | Instrucciones rápidas |
| :--- | :--- | :--- |
| **Linux** | `.AppImage` | Dar permisos de ejecución (`chmod +x`) |
| **Windows** | `.zip` | Descomprimir y ejecutar (Versión Portable) |
| **macOS** | `.zip` | Clic derecho -> Abrir (para saltar Gatekeeper) |

---

## ✨ Características Principales

* **Multiplataforma**: Ejecutables optimizados para Windows, Linux y macOS.
* **Base de Datos Local**: Tus datos no viajan a la nube; se almacenan de forma segura en tu equipo mediante SQLite.
* **Cálculo Automático**: Control en tiempo real del límite de faltas (porcentaje configurable).
* **Importación Masiva**: Carga toda la estructura de tu centro educativo mediante archivos JSON.
* **Interfaz Moderna**: Desarrollada con Angular y PrimeNG para una experiencia fluida.

---

## 🛠️ Instalación y Uso Detallado

Para una guía completa sobre cómo instalar, configurar y solucionar problemas, consulta nuestras guías específicas:

1.  [Guía de Instalación y Primeros Pasos](./docs/INSTALL.md)
2.  [Manual de Usuario](./docs/USER_GUIDE.md)
3.  [Guía Técnica y Mantenimiento](./docs/TECHNICAL.md)

---

## 💻 Desarrollo y Compilación

Si deseas realizar cambios en el código o compilar la aplicación tú mismo:

1.  **Instalar dependencias**: `npm install`
2.  **Configurar entorno**: `sh setup.sh` (Crea carpetas necesarias para módulos nativos).
3.  **Lanzar en desarrollo**: `npm run electron`
4.  **Generar ejecutables**: `./build-apps.sh`

---

## 📄 Licencia

Este proyecto es de uso libre. Siéntete libre de clonarlo y adaptarlo a las necesidades de tu centro educativo.
