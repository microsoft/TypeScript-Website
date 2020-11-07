---
title: Manipulação do DOM
layout: docs
permalink: /pt/docs/handbook/manipulacao-dom.html
oneline: Usando o DOM com TypeScript
translatable: true
---

## Manipulação do DOM

### _Uma exploração no tipo `HTMLElement`_

Nos mais de 20 anos desde sua padronização, o JavaScript tem percorrido um longo caminho. Enquanto em 2020, o JavaScript pode ser usado em servidores, em ciência de dados, e até mesmo em dispositivos Internet das Coisas (IoT), é importante lembrar seu caso de uso mais popular: navegadores web.

Websites são feitos de documentos HTML e/ou XML. Estes documentos são estáticos, eles não mudam. O *Modelo de Objeto de Documento (DOM)* é uma interface de programação implementado por navegadores para tornar sites estáticos funcionais. A API do DOM pode ser usada para alterar a estrutura do documento, estilo e conteúdo. A API é tão poderosa que inúmeras estruturas de front-end (jQuery, React, Angularm etc.) foram desenvolvidos em torno dele, a fim de tornar os sites dinâmicos ainda mais fáceis de desenvolver.

TypeScript é um superconjunto do JavaScript, e envia definições de tipo para a API DOM. Essas definições estão prontamente disponíveis em qualquer projeto TypeScript padrão. Das mais de 20.000 linhas de definições em _lib.dom.d.ts_, uma se destaca entre as demais: `HTMLElement`. Este tipo é a espinha dorsal para a manipulação do DOM com TypeScript.

> Você pode explorar o código-fonte para a [definição de tipos do DOM](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)

## Exemplo Básico

Dado um arquivo _index.html_ simplificado:

    <!DOCTYPE html>
    <html lang="en">
      <head><title>Manipulação do DOM com TypeScript</title></head>
      <body>
        <div id="app"></div>
        <!-- Assumindo que index.js é a saída compilada de index.ts -->
        <script src="index.js"></script>
      </body>
    </html>

Lets explore a TypeScript script that adds a `<p>Olá, Mundo!</p>` element to the `#app` element.
Vamos explorar um script TypeScript que adiciona um elemento `<p>Olá, Mundo!</p>` no elemento `#app`

```ts
// 1. Seleciona o elemento div usando a propriedade id
const app = document.getElementById("app");

// 2. Cria um novo elemento <p></p> programáticamente
const p = document.createElement("p");

// 3. Adiciona conteúdo de texto
p.textContent = "Olá, Mundo!";

// 4. Acrescenta o elemento p no elemento div
app?.appendChild(p);
```

Depopis de compilado e executando a página _index.html_, o resultado HTML será:

```html
<div id="app">
  <p>Olá, mundo!</p>
</div>
```

## A interface `Document`

A primeira linha do código TypeScript usa uma variável global `document`. A inspeceção da varíavel mostra que ela é definida pela interface `Document` do arquivo _lib.dom.d.ts_. O trecho de código contém chamadas para dois métodos, `getElementById` e `createElement`.

### `Document.getElementById`

A definição para este método é a seguinte:

```ts
getElementById(elementId: string): HTMLElement | null;
```

Passe o texto do id de um elemento e ele retornará `HTMLElement` ou `null`. Este método introduz um dos mais importantes tipos, `HTMLElement`. Ele serve como inteface base para todas as outras intefaces de elementos. Por exemplo, a variável `p` no exemplo de código é do tipo `HTMLParagraphElement`. Também observe que este método pode retornar `null`. Isso ocorre porque o método não pode determinar em tempo de pré-execução se ele será capaz de encontrar realmente o elemento especificado ou não. Na última linha do trecho de código, o novo operador _optional chaining_ é usado para chamar `appendChild`.

### `Document.createElement`

A definição para este método é (eu omiti a definição _depreciada_)

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

Esta é uma definição de função sobrecarregada. A segunda sobrecarga é mais simples e funciona muito como o método `getElementById` faz. Passe qualquer `string` e ele irá retornar um HTMLElement padrão. Essa definição é o que permite aos desenvolvedores criar tags de elemento HTML exclusivas. 

Por exemplo `document.createElement('xyz')` retorna um elemento `<xyz></xyz>`, claramente não é um elemento que esteja especificado pela especificação HTML.

> Para os interessados, você pode interagit com tag de elementos customizados usando o `document.getElementsByTagName`

For the first definition of `createElement`, it is using some advanced generic patterns. It is best understood broken down into chunks, starting with the generic expression: `<K extends keyof HTMLElementTagNameMap>`. This expression defines a generic parameter `K` that is _constrained_ to the keys of the interface `HTMLElementTagNameMap`. The map interface contains every specified HTML tag name and its corresponding type interface. For example here are the first 5 mapped values: 

Para a primeira definição de `createElement`, é usado alguns padrões genéricos avançados. Ele é melhor entendido quando dividido em partes, começando com a expressão genérica: `<K extends keyof HTMLElementTagNameMap>`. Essa expressão define um parâmetro genérico `K` que é _restrito_ às chaves da interface `HTMLElementTagNameMap`. A inreface mapeada conté toda a especificação da tag HTML e seus tipos de interface correspondentes. Por exemplo, aqui estão os 5 primeiros valores mapeados: 

```ts
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
        ...
}
```

Some elements do not exhibit unique properties and so they just return `HTMLElement`, but other types do have unique properties and methods so they return their specific interface (which will extend from or implement `HTMLElement`).

Now, for the remainder of the `createElement` definition: `(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]`. The first argument `tagName` is defined as the generic parameter `K` . The TypeScript interpreter is smart enough to _infer_ the generic parameter from this argument. This means that the developer does not actually have to specify the generic parameter when using the method; whatever value is passed to the `tagName` argument will be inferred as `K` and thus can be used throughout the remainder of the definition. Which is exactly what happens; the return value `HTMLElementTagNameMap[K]` takes the `tagName` argument and uses it to return the corresponding type. This definition is how the `p` variable from the code snippet gets a type of `HTMLParagraphElement`. And if the code was `document.createElement('a')`, then it would be an element of type `HTMLAnchorElement`.

## The `Node` interface

The `document.getElementById` function returns an `HTMLElement`. `HTMLElement` interface extends the `Element` interface which extends the `Node` interface. This prototypal extension allows for all `HTMLElements` to utilize a subset of standard methods. In the code snippet, we use a property defined on the `Node` interface to append the new `p` element to the website.

### `Node.appendChild`

The last line of the code snippet is `app?.appendChild(p)`. The previous, `document.getElementById` , section detailed that the _optional chaining_ operator is used here because `app` can potentially be null at runtime. The `appendChild` method is defined by:

```ts
appendChild<T extends Node>(newChild: T): T;
```

This method works similarly to the `createElement` method as the generic parameter `T` is inferred from the `newChild` argument. `T` is _constrained_ to another base interface `Node`.

## Difference between `children` and `childNodes`

Previously, this document details the `HTMLElement` interface extends from `Element` which extends from `Node`. In the DOM API there is a concept of _children_ elements. For example in the following HTML, the `p` tags are children of the `div` element

```tsx
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

After capturing the `div` element, the `children` prop will return a `HTMLCollection` list containing the `HTMLParagraphElements`. The `childNodes` property will return a similar `NodeList` list of nodes. Each `p` tag will still be of type `HTMLParagraphElements`, but the `NodeList` can contain additional _HTML nodes_ that the `HTMLCollection` list cannot.

Modify the html by removing one of the `p` tags, but keep the text.

```tsx
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

See how both lists change. `children` now only contains the `<p>Hello, World</p>` element, and the `childNodes` contains a `text` node rather than two `p` nodes. The `text` part of the `NodeList` is the literal `Node` containing the text `TypeScript!`. The `children` list does not contain this `Node` because it is not considered an `HTMLElement`.

## The `querySelector` and `querySelectorAll` methods

Both of these methods are great tools for getting lists of dom elements that fit a more unique set of constraints. They are defined in _lib.dom.d.ts_ as:

```ts
/**
 * Returns the first element that is a descendant of node that matches selectors.
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * Returns all element descendants of node that match selectors.
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

The `querySelectorAll` definition is similar to `getElementsByTagName`, except it returns a new type: `NodeListOf`. This return type is essentially a custom implementation of the standard JavaScript list element. Arguably, replacing `NodeListOf<E>` with `E[]` would result in a very similar user experience. `NodeListOf` only implements the following properties and methods: `length` , `item(index)`, `forEach((value, key, parent) => void)` , and numeric indexing. Additionally, this method returns a list of _elements_, not _nodes_, which is what `NodeList` was returning from the `.childNodes` method. While this may appear as a discrepancy, take note that interface `Element` extends from `Node`.

To see these methods in action modify the existing code to:

```tsx
<ul>
  <li>First :)</li>
  <li>Second!</li>
  <li>Third times a charm.</li>
</ul>;

const first = document.querySelector("li"); // returns the first li element
const all = document.querySelectorAll("li"); // returns the list of all li elements
```

## Interested in learning more?

The best part about the _lib.dom.d.ts_ type definitions is that they are reflective of the types annotated in the Mozilla Developer Network (MDN) documentation site. For example, the `HTMLElement` interface is documented by this [HTMLElement page](https://developer.mozilla.org/docs/Web/API/HTMLElement) on MDN. These pages list all available properties, methods, and sometimes even examples. Another great aspect of the pages is that they provide links to the corresponding standard documents. Here is the link to the [W3C Recommendation for HTMLElement](https://www.w3.org/TR/html52/dom.html#htmlelement).

Sources:

- [ECMA-262 Standard](http://www.ecma-international.org/ecma-262/10.0/index.html)
- [Introduction to the DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
