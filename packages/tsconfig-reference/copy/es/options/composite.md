---
display: "Composite"
oneline: "Habilita restricciones que permiten a un proyecto de TypeScript ser usado con referencias de proyectos."
---

La opción `composite` aplica ciertas restricciones que hacen posible para herramientas de compilado (incluyendo al mismo TypeScript, bajo el modo `--build`) rápidamente determinar si un proyecto ya ha sido compilado.

Cuando esta configuración está habilitada:

- El ajuste `rootDir`, si no está explícitamente establecido, se aplica como predeterminado el directorio que contenga el archivo `tsconfig.json`.

- Todos los archivos de implementación deben coincidir por un patrón `include` o ser listados en el arreglo de `files`. Si esta restricción es infringida, `tsc` te informará cuáles archivos no fueron especificados.

- `declaration` se predetermina a `verdadero`.

Puedes encontrar la documentación en proyectos de TypeScript en [el manual](https://www.typescriptlang.org/docs/handbook/project-references.html).
