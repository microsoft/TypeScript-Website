---
display: "Comprobaciones Estrictas"
---

Recomendamos usar la opción de [compilador `strict`](#strict) para optar por todas las mejoras posibles disponibles en el desarrollo.

TypeScript soporta un amplio espectro de patrones de JavaScript y permite por defecto bastante flexibilidad para acomodar estos estilos.
A menudo la seguridad y la potencial escalabilidad de una base de código puede estar en desacuerdo con algunas de estas técnicas.

Debido a la variedad de JavaScript soportado, la actualización a una nueva versión de TypeScript puede descubrir dos tipos de errores:

- Errores que ya existen en su base de código, que TypeScript ha descubierto porque el lenguaje ha refinado su comprensión de JavaScript.
- Un nuevo conjunto de errores que abordan un nuevo dominio de problemas.

TypeScript normalmente añadirá un indicador de compilación para este último conjunto de errores, y por defecto estos no están habilitados.
