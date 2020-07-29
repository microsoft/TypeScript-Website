---
display: "Emitir Metadados de Decorators"
oneline: "Adiciona metadados de tipo adicionais a decorators no código emitido"
---

Ativa o suporte experimental para a emissão de metadados de tipo para decorators que funcionam com o módulo [`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata).

Por exemplo, aqui está o JavaScript

```ts twoslash
// @experimentalDecorators
function LogarMetodo(alvo: any, chaveDaPropriedade: string | symbol, descritor: PropertyDescriptor) {
  console.log(alvo);
  console.log(chaveDaPropriedade);
  console.log(descritor);
}

class Demo {
  @LogarMetodo
  public foo(bar: number) {
    // não faz nada
  }
}

const demo = new Demo();
```

Com `emitDecoratorMetadata` não ativo (padrão):

```ts twoslash
// @experimentalDecorators
// @showEmit
function LogarMetodo(alvo: any, chaveDaPropriedade: string | symbol, descritor: PropertyDescriptor) {
  console.log(alvo);
  console.log(chaveDaPropriedade);
  console.log(descritor);
}

class Demo {
  @LogarMetodo
  public foo(bar: number) {
    // não faz nada
  }
}

const demo = new Demo();
```

Com `emitDecoratorMetadata` em true:

```ts twoslash
// @experimentalDecorators
// @showEmit
// @emitDecoratorMetadata
function LogarMetodo(alvo: any, chaveDaPropriedade: string | symbol, descritor: PropertyDescriptor) {
  console.log(alvo);
  console.log(chaveDaPropriedade);
  console.log(descritor);
}

class Demo {
  @LogarMetodo
  public foo(bar: number) {
    // não faz nada
  }
}

const demo = new Demo();
```
