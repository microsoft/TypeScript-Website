---
display: "Permitir el acceso global a UMD"
oneline: "Asume todas las importaciones UMD como disponibles globalmente"
---

Cuando está activo, `allowUmdGlobalAccess` le permite acceder a las exportaciones UMD como si fueran globales dentro de los archivos del módulo. Un módulo es un archivo que tiene importaciones y/o exportaciones. Sin esta opción, el usar una exportación proveniente de un módulo UMD requerirá una declaración de tipo importación.

Un ejemplo de caso de uso de esta opción sería un proyecto web donde se sabe que la biblioteca particular (como jQuery o Lodash) siempre estará disponible en tiempo de ejecución, pero no puedes acceder a esta con una importación.
