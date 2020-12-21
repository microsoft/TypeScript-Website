---
display: "Declaration"
oneline: "Genera los archivos .d.ts de TypeScript y JavaScript en tu proyecto."
---

Genera los archivos `.d.ts` para cada archivo TypeScript o JavaScript dentro de tu proyecto.
Estos archivos `.d.ts` son archivos de tipo definición que describen la API externa de tu módulo.
Con los archivos `.d.ts`, herramientas como TypeScript pueden ofrecer intellisense (auto completado) y un escritura precisa para código no escrito.

Cuando `declaration` esta establecida como `true`, al ejecutar el compilador con el siguiente código TypeScript:

```ts twoslash
export let holaMundo = "hi";
```

Generará un archivo `index.js` como el siguiente:

```ts twoslash
// @showEmit
export let holaMundo = "hi";
```

Con su correspondiente `holaMundo.d.ts`:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let holaMundo = "hi";
```

Cuando se trabaja con archivos `.d.ts` para archivos JavaScript, querrás usar [`emitDeclarationOnly`](#emitDeclarationOnly) o usar [`outDir`](#outDir) para asegurarte que los archivos JavaScript no son sobre-escritos.
