# 📕 Manual de Usuario

Esta guía te ayudará a entender el funcionamiento del **Gestor de Faltas** y a sacar el máximo provecho de sus funciones de automatización.

---

## 1. Configuración de Parámetros
Antes de empezar a anotar faltas, personaliza el comportamiento de la app:
* **Icono de Engranaje**: Accede al panel de configuración.
* **Límite de Faltas**: Define el porcentaje máximo (ej. 15% o 20%). Los módulos que superen este límite se marcarán automáticamente en rojo.
* **Cómputo de Justificadas**: Elige si las faltas justificadas deben contar para el porcentaje de absentismo o si deben quedar excluidas del aviso de pérdida de evaluación.

## 2. Importación Rápida de Datos 📂
Para facilitarte el inicio, el repositorio incluye una carpeta con estructuras de datos ya preparadas.

### Cómo usar los archivos de ejemplo:
1. Navega a la carpeta **`datos`** de este repositorio.
2. Descarga el archivo `.json` que mejor se adapte a tu necesidad (ej: `informatica.json`).
3. En la aplicación, ve a **Configuración** -> **Importar JSON**.
4. Selecciona el archivo descargado. 

> **Atención**: La importación de un archivo JSON sustituirá todos los ciclos y módulos actuales por los nuevos. Asegúrate de exportar tus datos actuales si no quieres perderlos.

**¿Tienes una plantilla nueva?** Puedes hacerme llegar tus ficheros a `me.sanchezgomis@edu.gva.es` para incluirlos en el repositorio.

---

## 3. Gestión de Ciclos y Módulos

Tienes dos formas de organizar la estructura de tus clases: desde cero o partiendo de una plantilla.

### Opción A: Configuración Manual (Paso a paso)
Ideal si tienes pocos módulos o una estructura muy específica.
1. **Crear Ciclo**: Define el nombre del curso (ej: "2º ASIR").
2. **Añadir Módulos**: Entra en el ciclo creado y añade las asignaturas. 
   * **Importante**: Debes indicar las **horas totales del curso**. Este dato es fundamental para que el cálculo de porcentajes de absentismo sea exacto.

### Opción B: Crear o Modificar Ciclos con Plantillas (JSON) ⚡

Esta opción es la más rápida si quieres configurar toda tu familia profesional de golpe (por ejemplo, Sanidad, Automoción o Hostelería) y asegurarte de que los datos cuadran con los informes oficiales de Conselleria.

#### 1. Conceptos Básicos: ¿Qué es este archivo?
No te asustes por el formato. Imagina que este archivo es una serie de **Cajas (Ciclos)** y dentro de cada caja metemos **Papeles (Módulos/Asignaturas)**.

Para que la aplicación funcione, cada asignatura necesita tres datos:
1.  **Nombre**: Como la llamamos nosotros.
2.  **Horas**: Duración total del curso.
3.  **Código Oficial (report_code)**: Es el código corto que aparece en los PDFs de faltas de Conselleria (ITACA). **Es vital para que la App se entienda con los documentos oficiales.**

#### 2. Pasos para crear tu propia familia profesional
Sigue estos pasos para crear tu archivo personalizado:

1.  **Consigue la plantilla**: Ve a la carpeta `/release/datos/` y haz una copia del archivo `plantilla_vacia.json`.
2.  **Abre el editor**: Haz clic derecho sobre tu copia y elige **"Abrir con..." -> Bloc de Notas** (Windows) o **TextEdit** (Mac).
3.  **El "Bloque de Construcción"**:
    Copia y pega este bloque para cada ciclo. Rellénalo con los datos que tienes en tu informe de matrícula o faltas:

```json
{
  "name": "NOMBRE DEL CICLO (Ej: 1º Cocina)",
  "children": [
    { 
      "name": "Nombre Asignatura 1", 
      "hours": 100, 
      "report_code": "CV001" 
    },
    { 
      "name": "Nombre Asignatura 2", 
      "hours": 200, 
      "report_code": "MP045" 
    }
  ]
}
```

#### 3. Las Reglas de Oro (Para evitar errores)
El ordenador es estricto. Para que todo funcione, respeta estas reglas:

* **Regla 1: El Código Oficial (`report_code`)**: 
    * Debes copiarlo **exactamente igual** que aparece en el PDF de faltas de tus alumnos (columna Módulo/UF). Si en el PDF pone `MP0132`, aquí debes poner `"MP0132"`.
* **Regla 2: Las Comillas `" "`**: Todo texto debe ir entre comillas.
    * *Bien*: `"report_code": "MP03"`
* **Regla 3: Los Dos Puntos `:`**: Separan el nombre del valor.
* **Regla 4: La Coma Traicionera `,`**:
    * Pon coma al final de cada línea para seguir escribiendo, **excepto** en la última línea antes de cerrar la llave `}`.

#### 4. Ejemplo Práctico (Familia de Sanidad)
Si quisieras crear el ciclo de **Auxiliar de Enfermería**, tu archivo debería quedar así. Fíjate en los códigos inventados (OAD, TBE...) que simulan los del PDF oficial:

```json
[
  {
    "name": "Cuidados Auxiliares de Enfermería",
    "children": [
      { 
        "name": "Operaciones administrativas y documentación sanitaria", 
        "hours": 65, 
        "report_code": "OAD"
      },
      { 
        "name": "Técnicas básicas de enfermería", 
        "hours": 350, 
        "report_code": "TBE"
      },
      { 
        "name": "Higiene del medio hospitalario", 
        "hours": 155, 
        "report_code": "HMH"
      }
    ]
  }
]
```

#### 5. Cargar tu archivo en la App
Una vez tengas tu archivo listo y guardado (por ejemplo `mis_ciclos.json`):

1.  Abre el **Gestor de Faltas**.
2.  Pulsa en el icono de **Configuración** (la rueda dentada ⚙️).
3.  Pulsa el botón **Importar JSON**.
4.  Busca y selecciona tu archivo.

> **Atención**: Al importar un archivo, **se borrará todo lo que tengas actualmente** para sustituirlo por los datos nuevos. Asegúrate de tener una copia de seguridad antes de hacerlo.

---

## 4. Registro de Faltas
El flujo diario de trabajo es el siguiente:
1. **Selección**: Elige el Ciclo y el Módulo en el panel principal.
2. **Anotación**: Indica la fecha, el número de horas y si la falta es *Ordinaria* o *Justificada*.
3. **Historial**: Puedes ver el listado de faltas debajo del formulario para corregir o eliminar entradas erróneas.

---

## 5. Interpretación de Alertas ⚠️
La aplicación utiliza un sistema de colores basado en el porcentaje de horas perdidas:
* 🟢 **Bajo control**: Porcentaje inferior al límite establecido.
* 🟡 **Próximo al límite**: Se muestra cuando el alumno está a pocas horas de superar el límite.
* 🔴 **Límite superado**: Indica pérdida de evaluación continua según la normativa configurada.

---

## 6. Generación de Informes y Comunicación 📢
El gestor facilita la acción tutorial ofreciendo dos vías para comunicar el estado de absentismo a alumnos y familias.

### A. Notificación Digital (Aules / Email)
Ideal para avisos rápidos o tareas de tutoría.
1.  En la tabla resumen, localiza la fila del módulo que quieres comunicar.
2.  Pulsa el botón de **Exportar** (icono de portapapeles) situado a la derecha de la fila.
3.  **En Aules (Tutoría)**: 
    * Crea una Tarea o Mensaje Privado.
    * **Pega (Ctrl+V)** el contenido.
    * El sistema generará automáticamente un texto con el nombre del módulo, horas totales, horas perdidas y el porcentaje actual.

### B. Informe Oficial PDF 📄
Ideal para expedientes, firmas o comunicaciones formales de pérdida de evaluación.
1.  Pulsa el botón **Exportar PDF** (icono de documento).
2.  El sistema generará un archivo `.pdf` maquetado profesionalmente.

---

## 💡 Trucos de productividad
* **Doble revisión**: Antes de una sesión de evaluación, verifica en el panel de resumen qué módulos están en rojo para generar los avisos pertinentes.
* **Backup manual**: Aunque la app guarda todo al instante, exportar tu configuración a un JSON de vez en cuando es la mejor forma de tener una copia de seguridad externa.