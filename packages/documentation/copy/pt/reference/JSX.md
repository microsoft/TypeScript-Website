---
title: JSX
layout: docs
permalink: /pt/docs/handbook/jsx.html
oneline: Utilizando JSX com TypeScript
translatable: true
---

[JSX](https://facebook.github.io/jsx/) é uma sintaxe semelhante a um XML incorporável.
Ele deve ser transformado em JavaScript válido, embora a semântica dessa transformação seja específica da implementação.
JSX ganhou popularidade com o framework [React](https://reactjs.org/), mas desde então viu outras implementações também.
TypeScript suporta incorporação, verificação de tipo, e compilação de JSX diretamente para JavaScript.

## Uso básico

Para usar JSX, você deve fazer duas coisas.

1. Nomeie seus arquivos com extensão `.tsx`
2. Ativar a opção `jsx`

TypeScript vem com três modos JSX: `preserve`, `react`, e `react-native`.
Esses modos afetam apenas o estágio de emissão - verificação de tipo não é afetada.
O modo `preserve` manterá o JSX como parte da output para ser posteriormente consumido por outra etapa de transformação (e.g. [Babel](https://babeljs.io/)).
Além disso, a output terá uma extensão de arquivo `.jsx`.
O modo `react` vai emitir `React.createElement`, não precisa passar por uma transformação JSX antes de usar, e a saída terá uma extensão de arquivo `.js`.
O modo `react-native` é o equivalente ao modo `preserve` no sentido de que mantém todos os JSX, mas a saída terá uma extensão de arquivo `.js`.

| Modo           | Input     | Output                                            | Output File Extension |
| -------------- | --------- | ------------------------------------------------- | --------------------- |
| `preserve`     | `<div />` | `<div />`                                         | `.jsx`                |
| `react`        | `<div />` | `React.createElement("div")`                      | `.js`                 |
| `react-native` | `<div />` | `<div />`                                         | `.js`                 |
| `react-jsx`    | `<div />` | `_jsx("div", {}, void 0);`                        | `.js`                 |
| `react-jsxdev` | `<div />` | `_jsxDEV("div", {}, void 0, false, {...}, this);` | `.js`                 |

Você pode especificar esse modo usando tanto a flag na linha de comando `--jsx` ou a opção [`jsx` correspondente no seu arquivo tsconfig.json](/tsconfig#jsx).

> \*Nota: Você pode especificar a função factory JSX para usar quando direcionar react JSX com a opção `--jsxFactory` (padrão para `React.createElement`)

## O operador `as`

Observe como escrever uma declaração de tipo:

```ts
var foo = <foo>bar;
```

Isso afirma que a variável `bar` tem o tipo `foo`.
Uma vez que o TypeScript também usa colchetes angulares para afirmações de tipo, combiná-lo com a sintaxe JSX apresentaria certas dificuldades de análise. Como resultado, o TypeScript não permite afirmações do tipo colchete angular em arquivos `.tsx`.

Uma vez que a sintaxe acima não pode ser usada em arquivos `.tsx`, um operador de asserção de tipo alternativo deve ser usado: `as`.
O exemplo pode ser facilmente reescrito com o operador `as`.

```ts
var foo = bar as foo;
```

O operador `as` está disponívem em ambos arquivos `.ts` e `.tsx`, e é idêntico em comportamento ao estilo de asserção do tipo colchete angular.

## Verificação de tipos

Para entender a verificação de tipo com JSX, você deve primeiro entender a diferença entre os elementos intrínsecos e os elementos baseados em valores.
Dada uma expressão JSX `<expr />`, `expr` pode se referir a algo intrínseco ao ambiente (e.g. uma `div` ou `span` em um ambiente DOM) ou a um componente personalizado que você criou.
Isto é importante por duas razões:

1. Para React, os elementos intrínsecos são emitidos como strings (`React.createElement("div")`), enquanto um componente que você criou não é (`React.createElement(MyComponent)`).
2. Os tipos de atributos passados no elemento JSX devem ser pesquisados de forma diferente.
   Atributos de elementos intrínsecos devem ser conhecidos _intrinsicamente_, enquanto os componentes provavelmente desejarão especificar seu próprio conjunto de atributos.

TypeScript usa a [mesma convenção que React usa](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components) para distinguir entre estes.
Um elemento intrínseco sempre começa com uma letra minúscula e um elemento baseado em valor sempre começa com uma letra maiúscula.

## Elementos intrínsecos

Os elementos intrínsecos são pesquisados na interface especial `JSX.IntrinsicElements`.
Por padrão, se esta interface não for especificada, então vale tudo e os elementos intrínsecos não serão verificados por tipo.
No entanto, se esta interface _estiver_ presente, então o nome do elemento intrínseco é procurado como uma propriedade na interface `JSX.IntrinsicElements`.
Por exemplo:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

<foo />; // ok
<bar />; // erro
```

No exemplo acima, `<foo />` vai funcionar bem, mas `<bar />` resultará em um erro, pois não foi especificado em `JSX.IntrinsicElements`.

> Nota: Você também pode especificar um indexador de string abrangente em `JSX.IntrinsicElements` do seguinte modo:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
```

## Elementos baseados em valor

Os elementos baseados em valor são simplesmente pesquisados por identificadores que estão no escopo.

```ts
import MyComponent from "./myComponent";

<MyComponent />; // ok
<SomeOtherComponent />; // erro
```

Existem duas maneiras de definir um elemento baseado em valor:

1. Function Component (FC)
2. Class Component

Como esses dois tipos de elementos baseados em valor são indistinguíveis um do outro em uma expressão JSX, primeiro o TS tenta resolver a expressão como um componente de função usando resolução de sobrecarga. Se o processo for bem-sucedido, o TS termina de resolver a expressão para sua declaração. Se o valor não resolver como um componente de função, o TS tentará resolvê-lo como um componente de classe. Se isso falhar, o TS relatará um erro.

### Function Component

Como o nome sugere, o componente é definido como uma função JavaScript em que seu primeiro argumento é um objeto `props`.
TS impõe que seu tipo de retorno deve ser atribuível a `JSX.Element`.

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: { name: string });
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: { value: string }, context: { color: string }) => (
  <button />
);
```

Como um componente de função é simplesmente uma função JavaScript, sobrecargas de função também podem ser usadas aqui:

```ts
interface ClickableProps {
  children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
  home: JSX.Element;
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
  ...
}
```

> Nota: Componentes de Função eram anteriormente conhecidos como Stateless Function Components (SFC). Como Function Components não pode mais ser considerado sem estado nas versões recentes do react, o tipo `SFC` e seu alias `StatelessComponent` foram descontinuados.

### Class Component

É possível definir o tipo de um componente da classe.
No entanto, para fazer isso, é melhor entender dois novos termos: o _tipo de classe de elemento_ e _tipo de instância de elemento_.

Dado `<Expr />`, o _tipo de classe de elemento_ é o tipo de `Expr`.
Portanto, no exemplo acima, se `MyComponent` era uma classe ES6, o tipo de classe seria o construtor dessa classe e estática.
Se `MyComponent` era uma função factory, o tipo de classe seria essa função.

Uma vez que o tipo de classe é estabelecido, o tipo de instância é determinado pela união dos tipos de retorno da construção do tipo de classe ou assinaturas de chamada (o que estiver presente).
Então, novamente, no caso de uma classe ES6, o tipo de instância seria o tipo de uma instância dessa classe, e no caso de uma função factory, seria o tipo do valor retornado da função.

```ts
class MyComponent {
  render() {}
}

// use uma assinatura de construção
var myComponent = new MyComponent();

// element class type => MyComponent
// element instance type => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {},
  };
}

// use uma assinatura de chamada
var myComponent = MyFactoryFunction();

// element class type => MyFactoryFunction
// element instance type => { render: () => void }
```

O tipo de instância do elemento é interessante porque deve ser atribuível a `JSX.ElementClass` ou resultará em um erro.
Por padrão `JSX.ElementClass` é `{}`, mas pode ser aumentado para limitar o uso de JSX apenas aos tipos que estão em conformidade com a interface adequada.

```ts
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} };
}

<MyComponent />; // ok
<MyFactoryFunction />; // ok

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // error
<NotAValidFactoryFunction />; // error
```

## Verificação de tipo de atributo

A primeira etapa para os atributos de verificação de tipo é determinar o _tipo de atributos de elemento_.
Isso é ligeiramente diferente entre os elementos intrínsecos e os baseados em valores.

Para elementos intrínsecos, é o tipo da propriedade em `JSX.IntrinsicElements`

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// tipo de atributos de elemento para 'foo' é '{bar?: boolean}'
<foo bar />;
```

Para elementos baseados em valor, é um pouco mais complexo.
É determinado pelo tipo de uma propriedade no _tipo de instância do elemento_ que foi determinado anteriormente.
Qual propriedade usar é determinada por `JSX.ElementAttributesProperty`.
Deve ser declarado com uma única propriedade.
O nome dessa propriedade é então usado.
A partir do TypeScript 2.8, se `JSX.ElementAttributesProperty` não for fornecido, o tipo de primeiro parâmetro do construtor do elemento de classe ou a chamada do fucntion componenent será usada.

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // especifica o nome da propriedade a usar
  }
}

class MyComponent {
  // especifica a propriedade no tipo de instância do elemento
  props: {
    foo?: string;
  };
}

// tipo de atributos de elemento para 'MyComponent' é '{foo?: string}'
<MyComponent foo="bar" />;
```

O tipo de atributo de elemento é usado para verificar o tipo dos atributos no JSX.
Propriedades opcionais e obrigatórias são suportadas.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number };
  }
}

<foo requiredProp="bar" />; // ok
<foo requiredProp="bar" optionalProp={0} />; // ok
<foo />; // error, requiredProp is missing
<foo requiredProp={0} />; // error, requiredProp should be a string
<foo requiredProp="bar" unknownProp />; // error, unknownProp does not exist
<foo requiredProp="bar" some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier
```

> Nota: Se um nome de atributo não for um identificador JS válido (como um atributo `data-*`), não é considerado um erro se não for encontrado no tipo de atributos do elemento.

Além disso, a interface `JSX.IntrinsicAttributes` pode ser usada para especificar propriedades extras usadas pela estrutura JSX que geralmente não são usadas pelos adereços ou argumentos dos componentes - por exemplo `key` em React. Especializando-se ainda mais, o tipo genérico `JSX.IntrinsicClassAttributes<T>` também pode ser usado para especificar o mesmo tipo de atributos extras apenas para class components (e não Function Components). Nesse tipo, o parâmetro genérico corresponde ao tipo de instância de classe. Em React, isso é usado para permitir o atributo `ref` do tipo `Ref<T>`. De modo geral, todas as propriedades dessas interfaces devem ser opcionais, a menos que você pretenda que os usuários de sua estrutura JSX precisem fornecer algum atributo em cada tag.

O operador de propagação também funciona:

```ts
var props = { requiredProp: "bar" };
<foo {...props} />; // ok

var badProps = {};
<foo {...badProps} />; // erro
```

## Verificação de tipos filhos

No TypeScript 2.3, TS introduziu verificação de tipo _filho_. _filho_ é uma propriedade especial em um _tipo de atributos de elemento_ onde *JSXExpression*s são consideradas para seres inseridas nos elementos.
Semelhante a como o TS usa `JSX.ElementAttributesProperty` para determinar o nome de _props_, TS usa `JSX.ElementChildrenAttribute` para determinar o nome do _filho_ dentro dessas props.
`JSX.ElementChildrenAttribute` deve ser declarado com uma única propriedade.

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // especifica o nome dos filhos a serem usados
  }
}
```

```ts
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

Você pode especificar o tipo do _filho_ como qualquer outro atributo. Isso substituirá o tipo padrão de, por exemplo, a [tipagem React](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) se você os usar.

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// OK
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element or string.
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>
```

## O tipo de resultado JSX

Por padrão, o resultado de uma expressão JSX é digitado como `any`.
Você pode personalizar o tipo, especificando a interface `JSX.Element`.
No entanto, não é possível recuperar informações de tipo sobre o elemento, atributos ou filhos do JSX a partir desta interface.
É uma caixa preta.

## Incorporando Expressões

JSX permite que você incorpore expressões entre as tags circundando as expressões com chaves (`{ }`).

```ts
var a = (
  <div>
    {["foo", "bar"].map((i) => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```

O código acima resultará em um erro, pois você não pode dividir uma string por um número.
A saída, ao usar a opção `preserve`, parece:

```ts
var a = (
  <div>
    {["foo", "bar"].map(function (i) {
      return <span>{i / 2}</span>;
    })}
  </div>
);
```

## Integração com React

Para usar JSX com React, você deve usar a [tipagem React](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react).
Essa tipagem define o namespace `JSX` apropriadamente para uso com React.

```ts
/// <reference path="react.d.ts" />

interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}

<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // error
```

### Configurando o JSX

Existem vários sinalizadores de compilador que podem ser usados para personalizar seu JSX, que funcionam tanto como um sinalizador do compilador quanto por meio de pragmas embutidos por arquivo. Para saber mais, consulte as páginas de referência do tsconfig:

- [`jsxFactory`](/tsconfig/#jsxFactory)
- [`jsxFragmentFactory`](/tsconfig/#jsxFragmentFactory)
- [`jsxImportSource`](/tsconfig/#jsxImportSource)
