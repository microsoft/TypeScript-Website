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

Websites são feitos de documentos HTML e/ou XML. Estes documentos são estáticos, eles não mudam. O *Modelo de Objeto de Documento (DOM)* é uma interface de programação implementada por navegadores para tornar sites estáticos funcionais. A API do DOM pode ser usada para alterar a estrutura do documento, estilo e conteúdo. A API é tão poderosa que inúmeras ferramentas de front-end (jQuery, React, Angular, etc.) foram desenvolvidos em torno dele, a fim de tornar os sites dinâmicos ainda mais fáceis de desenvolver.

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

Vamos explorar um script TypeScript que adiciona um elemento `<p>Olá, Mundo!</p>` ao elemento `#app`

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

Depois de compilado e executando a página _index.html_, o resultado HTML será:

```html
<div id="app">
  <p>Olá, mundo!</p>
</div>
```

## A interface `Document`

A primeira linha do código TypeScript usa uma variável global `document`. A inspeção da variável mostra que ela é definida pela interface `Document` do arquivo _lib.dom.d.ts_. O trecho de código contém chamadas para dois métodos, `getElementById` e `createElement`.

### `Document.getElementById`

A definição para este método é a seguinte:

```ts
getElementById(elementId: string): HTMLElement | null;
```

Passe o texto do id de um elemento e ele retornará `HTMLElement` ou `null`. Este método introduz um dos mais importantes tipos, `HTMLElement`. Ele serve como interface base para todas as outras interfaces de elementos. Por exemplo, a variável `p` no exemplo de código é do tipo `HTMLParagraphElement`. Também observe que este método pode retornar `null`. Isso ocorre porque o método não pode determinar em tempo de pré-execução se ele será capaz de encontrar realmente o elemento especificado ou não. Na última linha do trecho de código, o novo operador _optional chaining_ é usado para chamar `appendChild`.

### `Document.createElement`

A definição para este método é (eu omiti a definição _depreciada_)

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

Esta é uma definição de função sobrecarregada. A segunda sobrecarga é mais simples e funciona muito como o método `getElementById` faz. Passe qualquer `string` e ele irá retornar um HTMLElement padrão. Essa definição é o que permite aos desenvolvedores criar tags de elemento HTML exclusivas. 

Por exemplo `document.createElement('xyz')` retorna um elemento `<xyz></xyz>`, claramente não é um elemento que esteja especificado pela especificação HTML.

> Para os interessados, você pode interagir com tag de elementos customizados usando o `document.getElementsByTagName`

Para a primeira definição de `createElement`, é usado alguns padrões genéricos avançados. Ele é melhor entendido quando dividido em partes, começando com a expressão genérica: `<K extends keyof HTMLElementTagNameMap>`. Essa expressão define um parâmetro genérico `K` que é _restrito_ às chaves da interface `HTMLElementTagNameMap`. A interface mapeada conté toda a especificação da tag HTML e seus tipos de interface correspondentes. Por exemplo, aqui estão os 5 primeiros valores mapeados: 

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
Alguns elementos não exibem propriedades únicas e, então, eles apenas retornam `HTMLElement`, mas outros tipos tem propriedades e métodos únicos, então, eles retornam suas interfaces específicas (como irão extender ou implementar `HTMLElement`). 

Agora, para o restante da definição do `createElement`: `(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]`. O primeiro argumento `tagName` é definido como um parâmetro genérico `K`. O interpretador TypeScript é inteligente o suficiente para _inferir_ o parâmetro genérico para este argumento. Isso significa que o desenvolvedor não precisa especificar o parâmetro genérico que utiliza o método; qualquer valor que é passado para o argumento `tagName` será inferido como `K` e, portanto, pode ser usado em todo restante da definição. O que acontece exatamente; o valor retornado de `HTMLElementTagNameMap[K]` pega o argumento `tagName` e utiliza para retornar o tipo correspondente. Esta definição é como a variável `p` do trecho de código obtém o tipo `HTMLParagraphElement`. E se o código tem `document.createElement('a')`, então ele deve ser um tipo de elemento `HTMLAnchorElement`.

## A interface `Node`

A função `document.getElementById` retorna um `HTMLElement`. A interface `HTMLElement` extende a interface `Element` que, por sua vez, extende a interface `Node`. Essa extensão a nível de protótipo permite a todos `HTMLElements` a utilizar um subconjunto de métodos padrão. No trecho de código, nós usamos uma propriedade definida na interface `Node` para anexar o novo elemento `p` ao website.

### `Node.appendChild`

A última linha do trecho de código é `app?.appendChild(p)`. A seção anterior, `document.getElementById`, detalha o que o operador _optional chaining_  é usado aqui porque `app` pode ser potencialmente nulo durante a execução. O método `appendChild` é definido por:

```ts
appendChild<T extends Node>(newChild: T): T;
```

Este método funciona de forma semelhante ao método `createElement` com o parâmetro genérico `T` sendo inferido do argumento `newChild`. `T` é _restrito_ a outra interface base `Node`. 

## Diferença entre `children` e `childNodes`

Anteriormente, este documento detalhou a interface `HTMLElement` extendendo de `Element` que estende de `Node`. Na API DOM existe um conceito de elementos _filhos_. Por exemplo no HTML seguinte, as tags `p` são filhas do elemento `div`

```tsx
<div>
  <p>Olá, Mundo</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

Depois de capturar o elemento `div`, a propriedade `children` irá retornar uma lista `HTMLCollection` contendo os `HTMLParagraphElements`. A propriedade `childNodes` irá retornar uma lista similar de nodes `NodeList`. Cada tag `p` irá permanecer sendo do tipo `HTMLParagraphElements`, mas o `NodeList` pode conter adicionalmente _nós HTML_ que a lista `HTMLCollection` não contém. 

Modifique o html para remover uma das tags `p`, mas deixe o texto.

```tsx
<div>
  <p>Olá, Mundo</p>
  TypeScript!
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

Veja como os duas listas mudaram. `children` agora contém apenas o elemento `<p>Hello, World</p>`, e o `childNodes` contém um nó `text` em vez de dois nós `p`. A parte `text` do` NodeList` é o `Node` literal contendo o texto `TypeScript!`. A lista `children` não contém este` Node` porque não é considerado um `HTMLElement`.

## Os métodos `querySelector` e `querySelectorAll`

Ambos os métodos são ótimas ferramentas para obter listas de elementos do DOM que se encaixam em um conjunto mais exclusivo de restrições. Eles são definidos em _lib.dom.d.ts_ como:

```ts
/**
 * Retorna o primeiro elemento do nó que é descendente do nó que corresponde aos seletores.
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * Retorna todos os elementos descendentes do nó que corresponde ao seletor
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

A definição de `querySelectorAll` é similar a de `getElementsByTagName`, exceto que ele retorna um novo tipo: `NodeListOf`. Este tipo de retorno é essencialmente uma implementação customizada do elemento de lista padrão do JavaScript. Discutivelmente, substituindo `NodeListOf<E>` com `E[]` deve resultar em uma experiência do usuário muito similar. `NodeListOf` apenas implementa as seguintes propriedades e métodos: `length` , `item(index)`, `forEach((value, key, parent) => void)`, e indexação numérica. Adicionalmente, este método retorno uma lista de _elementos_, não _nós_, que é o que `NodeList` estava retornando para o método `.childNodes`. Enquanto isto pode parecer como uma discrepância, pegue nota que a interface `Element` extende de `Node`. 

Para ver estes métodos em ação modifique o código existente para:

```tsx
<ul>
  <li>Primeiro :)</li>
  <li>Segundo!</li>
  <li>Terceira vez um encanto.</li>
</ul>;

const primeiro = document.querySelector("li"); // retorna o primeiro elemento 'li'
const todos = document.querySelectorAll("li"); // retorna a lista de todos os elementos 'li'
```

## Interessado em aprender mais?

A melhor parte sobre as definições de tipo _lib.dom.d.ts_ é que elas refletem os tipos anotados no site de documentação da Rede de Desenvolvedores Mozilla (Mozilla Developer Network - MDN). Por exemplo, a interface `HTMLElement` é documentada pela [página HTMLElement](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement) na MDN. Estas páginas listam todas as propriedades disponíveis, métodos, e até mesmo alguns exemplos. Outro grande  aspecto das páginas é que elas fornecem links para os documentos padrão correspondentes. Este é o link para a [Recomendação da W3C para HTMLElement](https://www.w3.org/TR/html52/dom.html#htmlelement).

Recursos:

- [Padrão ECMA-262](http://www.ecma-international.org/ecma-262/10.0/index.html)
- [Introdução ao DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
