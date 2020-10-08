---
display: "Asume que los cambios sólo afectan a las dependencias directas"
oneline: "Una opción de modo de vigilancia drásticamente más rápida, pero ocasionalmente inexacta."
---

Cuando esta opción se encuentra activa, TypeScript evitará volver a comprobar/reconstruir todos los archivos verdaderamente afectados, y sólo volverá a comprobar/reconstruir los archivos que han cambiado, así como los archivos que los importan directamente.

Esto puede considerarse una implementación 'rápida y suelta' del algoritmo de vigilancia, que puede reducir drásticamente los tiempos de reconstrucción incremental a expensas de tener que ejecutar la construcción completa ocasionalmente para obtener todos los mensajes de error del compilador.
