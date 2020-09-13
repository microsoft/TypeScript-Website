---
display: "Módulos Isolados"
oneline: "Certifique-se de que cada arquivo pode ser transpilado com segurança, sem depender de outras importações"
---

Embora você possa usar o TypeScript para produzir código JavaScript a partir do código TypeScript, também é comum usar outros transpilers como [Babel](https://babeljs.io) para fazer isso.
No entanto, outros transpilers operam apenas em um único arquivo por vez, o que significa que eles não podem aplicar transformações de código que dependem da compreensão de todo o sistema de tipos.
Esta restrição também se aplica à API `ts.transpileModule` do TypeScript que é usada por algumas ferramentas de construção.

Essas limitações podem causar problemas de tempo de execução com alguns recursos do TypeScript, como `const enum`s e`namespace`s.
Definir o sinalizador `isolatedModules` diz ao TypeScript para avisá-lo se você escrever certo código que não pode ser interpretado corretamente por um processo de transpilação de arquivo único.

Isso não altera o comportamento do seu código ou, de outra forma, altera o comportamento do processo de verificação e emissão do TypeScript

Alguns exemplos de código que não funcionam quando `isolatedModules` está habilitado.

#### Exportações de identificadores sem valor

No TypeScript, você pode importar um _type_ e depois exportá-lo:

```ts twoslash
// @noErrors
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

Como não há valor para `someType`, o`export` emitido não tentará exportá-lo (isso seria um erro de tempo de execução em JavaScript):

```js
export { someFunction };
```

Transpiladores de arquivo único não sabem se `someType` produz um valor ou não, então é um erro exportar um nome que se refere apenas a um tipo.

#### Arquivos Non-Module

Se `isolatedModules` estiver definido, todos os arquivos de implementação devem ser _modules_ (o que significa que tem alguma forma de`import` / `export`). Ocorre um erro se algum arquivo não for um módulo:

```ts twoslash
// @errors: 1208
// @isolatedModules
function fn() {}
```

Esta restrição não se aplica a arquivos `.d.ts`

#### Referências a membros `const enum`

No TypeScript, quando você faz referência a um membro `const enum`, a referência é substituída por seu valor real no JavaScript emitido. Alterando este TypeScript:

```ts twoslash
declare const enum Numbers {
  Zero = 0,
  One = 1,
}
console.log(Numbers.Zero + Numbers.One);
```

Para este JavaScript:

```ts twoslash
// @showEmit
// @removeComments
declare const enum Numbers {
  Zero = 0,
  One = 1,
}
console.log(Numbers.Zero + Numbers.One);
```

Sem o conhecimento dos valores desses membros, outros transpiladores não podem substituir as referências a `Number`, o que seria um erro de tempo de execução se deixado sozinho (uma vez que não há objeto `Numbers` em tempo de execução).
Por causa disso, quando `isolatedModules` é definido, é um erro fazer referência a um membro ambiente `const enum`.
