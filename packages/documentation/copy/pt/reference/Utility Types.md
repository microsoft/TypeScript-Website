---
title: Tipos Utilitários
layout: docs
permalink: /pt/docs/handbook/utility-types.html
oneline: Tipos que são inclusos globalmente em TypeScript
translatable: true
---

TypeScript provém vários tipos utilitários para facilitar transformações de tipo comum. Esses utilitários estão disponíveis globalmente.

## `Partial<Type>`

Constrói um tipo com todas as propriedades de `Type` definidas como opcionais. Esse utilitário irá retornar um tipo que representa todos os subconjuntos de um determinado tipo.

##### Exemplo

```ts twoslash
interface Todo {
  titulo: string;
  descricao: string;
}

function atualizaTodo(todo: Todo, camposParaAtualizar: Partial<Todo>) {
  return { ...todo, ...camposParaAtualizar };
}

const todo1 = {
  titulo: "organizar a mesa",
  descricao: "limpar bagunça",
};

const todo2 = atualizaTodo(todo1, {
  descricao: "tirar o lixo",
});
```

## `Readonly<Type>`

Constrói um tipo com todas as propriedades de `Type` definidas como `readonly`, significando que as propriedades do tipo construído não podem ser reatribuídas.

##### Exemplo

```ts twoslash
// @errors: 2540
interface Todo {
  titulo: string;
}

const todo: Readonly<Todo> = {
  titulo: "Deleta usuários inativos",
};

todo.titulo = "Olá";
```

Esse utilitário é útil para representar expressões de atribuição que irão falhar em tempo de execução (Ex. Ao tentar reatribuir propriedades de um [objeto congelado](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys,Type>`

Constrói um tipo com um conjunto de propriedades `Keys` do tipo `Type`. Esse utilitário pode ser usado para mapear as propriedades de um tipo para outro tipo.

##### Exemplo

```ts twoslash
interface InfoPagina {
  titulo: string;
}

type Pagina = "inicio" | "sobre" | "contato";

const nav: Record<Pagina, InfoPagina> = {
  sobre: { titulo: "sobre" },
  contato: { titulo: "contato" },
  inicio: { titulo: "inicio" },
};

nav.sobre;
// ^?
```

## `Pick<Type, Keys>`

Constrói um tipo pegando um conjunto de propriedades `Keys` de `Type`.

##### Exemple

```ts twoslash
interface Todo {
  titulo: string;
  descricao: string;
  completado: boolean;
}

type TodoPreVisualizacao = Pick<Todo, "titulo" | "completado">;

const todo: TodoPreVisualizacao = {
  titulo: "Limpar quarto",
  completado: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

Constrói um tipo pegando todas as propriedades de `Type` e então removendo `Keys`.

##### Exemplo

```ts twoslash
interface Todo {
  titulo: string;
  descricao: string;
  completado: boolean;
}

type TodoPreVisualizacao = Omit<Todo, "descricao">;

const todo: TodoPreVisualizacao = {
  titulo: "Limpar quarto",
  completado: false,
};

todo;
// ^?
```

## `Exclude<Type, ExcludedUnion>`

Constrói um tipo excluindo de `Type` todos membros de união que são atribuíveis a `ExcludedUnion`.

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

Constrói um tipo extraindo de `Type` todos membros de união que são atribuíveis a `Union`.

##### Exemplo

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

Constrói um tipo por excluir `null` e `undefined` de `Type`.

##### Example

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

Constrói uma tipo tupla a partir de tipos usados nos parâmetros de uma função tipo `Type`.

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

Constrói um tipo tupla ou array a partir dos tipos de um tipo função construtora. Isso gera um tipo tupla com todos os tipos parâmetros (ou o tipo `never` se `Type` não for uma função).

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

Constrói um tipo consistindo do tipo retorno da função `Type`.

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

Constrói um tipo consistindo do tipo instancia de uma função construtora em `Type`.

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

Constrói um tipo consistindo de todas propriedades de `T` definidas como obrigatórias. O oposto de [`Partial`](#partialtype).

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

Extrai o tipo do parâmetro [this](/docs/handbook/functions.html#this-parameters) para um tipo `function`, ou [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) se o tipo da função não tem o parâmetro `this`.

##### Exemplo

```ts twoslash
function paraHex(this: Number) {
  return this.toString(16);
}

function numeroToString(n: ThisParameterType<typeof paraHex>) {
  return paraHex.apply(n);
}
```

## `OmitThisParameter<Type>`

Remove o parâmetro [`this`](/docs/handbook/functions.html#this-parameters) de `Type`. Se `Type` não tem parâmetro `this` explicitamente declarado, o resultado é simplesmente `Type`. Caso contrário, um novo tipo função sem o parâmetro `this` é criado a partir de `Type`. Generics são apagados e apenas a ultima assinatura sobrecarregada é propagada para o novo tipo função.

##### Exemplo

```ts twoslash
function paraHex(this: Number) {
  return this.toString(16);
}

const cincoParaHex: OmitThisParameter<typeof paraHex> = paraHex.bind(5);

console.log(cincoParaHex());
```

## `ThisType<Type>`

Esse utilitário não retorna um tipo transformado. Ao invés, serve como um marcador para um tipo contextual [`this`](/docs/handbook/functions.html#this). Note que a flag `--noImplicitThis` precisa ser ativada para usar esse utilitário.

##### Exemplo

```ts twoslash
// @noImplicitThis: false
type DescritorDeObjeto<D, M> = {
  dado?: D;
  metodos?: M & ThisType<D & M>; // Tipo de this em metodos é D & M
};

function fazObjeto<D, M>(desc: DescritorDeObjeto<D, M>): D & M {
  let dado: object = desc.dado || {};
  let metodos: object = desc.metodos || {};
  return { ...dado, ...metodos } as D & M;
}

let obj = fazObjeto({
  dado: { x: 0, y: 0 },
  metodos: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // this fortemente tipado
      this.y += dy; // this fortemente tipado
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

No exemplo acima, o objeto `metodos` no argumento para `fazObjeto` tem um tipo contextual que inclui `EsseTipo<D & M>` portanto o tipo de [this](/docs/handbook/functions.html#this) em metodos dentro do objeto `metodos` é `{ x: number, y: number } & { movePor(dx: number, dy: number): number }`. Perceba como o tipo da propriedade `metodos` é simultaneamente uma interface alvo e a fonte para o tipo `this` nos metodos.

O marcador interface `EsseTipo<T>` é simplesmente uma interface vazia declarada em `lib.d.ts`. Além de ser reconhecida no tipo contextual de um objeto literal, a interface age como qualquer interface vazia.
