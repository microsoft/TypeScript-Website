---
display: "Importação de Auxiliares"
oneline: "Permite importar funções auxiliares por projeto, ao invés de incluir em arquivos individuais."

---
Para algumas operações de nível mais baixo, o TypeScript pode usar alguns códigos auxiliares para operações como extensão de classes, espalhar arrays ou objetos e para operações async. Por padrão esses auxiliares são inseridos em cada arquivo utilizado. Isso pode provocar duplicação de códigos se o mesmo auxiliar for usado em diferentes módulos.

Se o `importHelpers` estiver ligado, as funções auxiliares serão importadas do módulo [tslib](https://www.npmjs.com/package/tslib).Você precisa ter certeza que o módulo `tslib` pode ser importado no runtime. Isso afeta apenas módulos; Os arquivos de scripts globais não tentarão importar módulos.

Exemplo com esse TypeScript:


```ts
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Ligando [`downlevelIteration`](#downlevelIteration) e mantendo o `importHelpers` como falso:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Em seguida, ativando [`downlevelIteration`](#downlevelIteration) e `importHelpers`:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Você pode utilizar [`noEmitHelpers`](#noEmitHelpers) quando fornecer suas próprias implementações dessas funções.
