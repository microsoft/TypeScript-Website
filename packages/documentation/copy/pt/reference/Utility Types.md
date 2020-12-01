---
title: Utility Types
layout: docs
permalink: /docs/handbook/utility-types.html
oneline: Types which are globally included in TypeScript
translatable: true
---

TypeScript provém vários tipos utilitários para facilitar transformações de tipo comum. Essas utilidades são avaliadas globalmente.

## `Partial<Type>`

Constroi um tipo com todas as propriedades de `Type` definidas para opcional. Essa utilidade irá retornar um tipo que representa todos os subsets de um determinado tipo.

##### Exemplo

```ts twoslash
interface AFazer {
  titulo: string;
  descricao: string;
}

function atualizaAFazer(afazer: AFazer, camposParaAtualizar: Parcial<AFazer>) {
  return { ...afazer, ...camposParaAtualizar };
}

const aFazer1 = {
  titulo: "organizar a mesa",
  descricao: "limpar bagunça",
};

const aFazer2 = atualizaAFazer(aFazer1, {
  descricao: "tirar o lixo",
});
```

## `Readonly<Type>`

Constroi um tipo com todas as propriedades de `Type` definidas para `readonly`, significando que as propriedades do tipo construído não podem ser reatribuídas.

##### Exemplo

```ts twoslash
// @errors: 2540
interface AFazer {
  titulo: string;
}

const afazer: Readonly<Todo> = {
  titulo: "Deleta usuários inativos",
};

afazer.titulo = "Olá";
```
Esse utilitário é útil para representar expresões de atribuição que irão falhar em tempo de execução (Ex. Ao tentar reatribuir propriedades de um [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys,Type>`

Constroi um tipo com um conjunto de propriedades `Keys` do tipo `Type`. Esse utilitário pode ser usado para mapear as propriedades de um tipo para outro tipo.

##### Exemplo

```ts twoslash
interface InfoPagina {
  titulo: string;
}

type Pagina = "inicio" | "sobre" | "contate-me";

const nav: Record<Page, PageInfo> = {
  sobre: { titulo: "sobre" },
  contate: { titulo: "contate-me" },
  home: { titulo: "inicio" },
};

nav.about;
// ^?
```

## `Pick<Type, Keys>`

Controi um tipo pegando um conjunto de propriedades `Keys` de `Type`.

##### Exemple

```ts twoslash
interface AFazer {
  titulo: string;
  descricao: string;
  completado: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

Controi um tipo pegando todas as propriedades de `Type` e então removendo `Keys`.

##### Exemplo

```ts twoslash
interface AFazer {
  titulo: string;
  descricao: string;
  completado: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Exclude<Type, ExcludedUnion>`

Constroi um tipo excluindo de `Type` todos membros unidos que são atribuíveis a `ExcludedUnion`.

##### Exemplo

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

Constroi um tipo excluindo de `Type` todos membros unidos que são atribuíveis a `Union`.

##### Exemplo

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

Constroi um tipo por excluir `null` e `undefined` de `Type`.

##### Example

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

Constroi uma tipo tupla a partir de tipos usados nos parâmetros de uma função tipo `Type`.

##### Exemplo

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

Constroi um tipo tupla ou array a partir do tipo de uma função construtora. Isso gera um tipo tupla com todos os tipos parâmetros (ou o tipo `never` se `Typo ` não for uma função).

##### Exemplo

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
type T3 = ConstructorParameters<any>;
//    ^?

type T4 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

Constroi um tipo consistindo do tipo retorno da função `Type`.

##### Exemplo

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

Constroi um tipo consistindo do tipo instancia de uma função construtora em `Type`.

##### Exemplo

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `Required<Type>`

Constroi um tipo consistindo de todas propriedades de `T` definidas como obrigatórias. I oposto de [`Partial`](#partialtype).

##### Exemplo

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `ThisParameterType<Type>`

Extrai o tipo do parâmetro [this](/docs/handbook/functions.html#this-parameters) para o tipo função, ou [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) se o tipo da função não tem o parâmetro `this`.

##### Exemplo

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

Remove o parâmetro [`this`](/docs/handbook/functions.html#this-parameters) de `Type`. Se `Type` não tem parâmetro `this` explicitamente declarado, o resultado é simplesmente `Type`. Caso contrário, um nova tipo função sem o parâmetro `this` é criado a partir de `Type`. Genérics são apagados e apenas a ultima assinatura sobrecarregada é propagada para o novo tipo função. 

##### Exemplo

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

This utility does not return a transformed type. Instead, it serves as a marker for a contextual [`this`](/docs/handbook/functions.html#this) type. Note that the `--noImplicitThis` flag must be enabled to use this utility.

##### Example

```ts twoslash
// @noImplicitThis: false
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

In the example above, the `methods` object in the argument to `makeObject` has a contextual type that includes `ThisType<D & M>` and therefore the type of [this](/docs/handbook/functions.html#this) in methods within the `methods` object is `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`. Notice how the type of the `methods` property simultaneously is an inference target and a source for the `this` type in methods.

The `ThisType<T>` marker interface is simply an empty interface declared in `lib.d.ts`. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.
