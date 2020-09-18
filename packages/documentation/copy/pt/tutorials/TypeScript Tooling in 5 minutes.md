---
title: Ferramentas TypeScript em 5 minutos
layout: docs
permalink: /pt/docs/handbook/typescript-tooling-in-5-minutes.html
oneline: Um tutorial para entender como criar um pequeno site com TypeScript
translatable: true
---

Vamos começar criando um aplicativo da web simples com TypeScript.

## Instalando TypeScript

Existem duas maneiras principais de obter o TypeScript disponível para o seu projeto:

- Via npm (o gerenciador de pacotes Node.js)
- Instalando os plugins do Visual Studio do TypeScript

O Visual Studio 2017 e o Visual Studio 2015 Update 3 incluem TypeScript por padrão.
Se você não instalou o TypeScript com o Visual Studio, ainda pode [baixá-lo](/download).

Para usuários npm:

```shell
> npm install -g typescript
```

## Construindo seu primeiro arquivo TypeScript

Em seu editor, digite o seguinte código JavaScript em `greeter.ts`:

```ts twoslash
// @noImplicitAny: false
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Compilando seu código

Usamos uma extensão `.ts`, mas este código é apenas JavaScript.
Você poderia ter copiado / colado diretamente de um aplicativo JavaScript existente.

Na linha de comando, execute o compilador TypeScript:

```shell
tsc greeter.ts
```

O resultado será um arquivo `greeter.js` que contém o mesmo JavaScript que você alimentou.
Estamos funcionando usando o TypeScript em nosso aplicativo JavaScript!

Agora podemos começar a tirar proveito de algumas das novas ferramentas que o TypeScript oferece.
Adicione uma anotação do tipo `: string` ao argumento da função 'pessoa' conforme mostrado aqui:

```ts twoslash
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Digite anotações

As anotações de tipo no TypeScript são maneiras leves de registrar o contrato pretendido da função ou variável.
Neste caso, pretendemos que a função greeter seja chamada com um único parâmetro de string.
Podemos tentar alterar a chamada de greeter para passar uma matriz em vez disso:

```ts twoslash
// @errors: 2345
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

Recompilando, você verá um erro:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

Da mesma forma, tente remover todos os argumentos para a chamada de greeter.
O TypeScript permitirá que você saiba que você chamou esta função com um número inesperado de parâmetros.
Em ambos os casos, o TypeScript pode oferecer análise estática com base na estrutura do seu código e nas anotações de tipo fornecidas.

Observe que embora tenha havido erros, o arquivo `greeter.js` ainda é criado.
Você pode usar o TypeScript mesmo se houver erros no seu código. Mas, neste caso, o TypeScript está avisando que seu código provavelmente não será executado conforme o esperado.

## Interfaces

Vamos desenvolver ainda mais nosso exemplo. Aqui, usamos uma interface que descreve objetos que possuem um campo firstName e lastName.
No TypeScript, dois tipos são compatíveis se sua estrutura interna for compatível.
Isso nos permite implementar uma interface apenas tendo a forma que a interface requer, sem uma cláusula `implements` explícita.

```ts twoslash
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## Classes

Finalmente, vamos estender o exemplo uma última vez com as aulas.
TypeScript oferece suporte a novos recursos em JavaScript, como suporte para programação orientada a objetos baseada em classes.

Aqui, criaremos uma classe `Student` com um construtor e alguns campos públicos.
Observe que as classes e as interfaces funcionam bem juntas, permitindo que o programador decida sobre o nível certo de abstração.

Também digno de nota, o uso de `public` em argumentos para o construtor é uma forma abreviada que nos permite criar propriedades automaticamente com aquele nome.

```ts twoslash
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

Execute novamente `tsc greeter.ts` e você verá que o JavaScript gerado é o mesmo do código anterior.
As classes em TypeScript são apenas uma abreviatura para o mesmo OO baseado em protótipo que é freqüentemente usado em JavaScript.

## Executando seu aplicativo da web TypeScript

Agora digite o seguinte em `greeter.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

Abra `greeter.html` no navegador para executar seu primeiro aplicativo da Web TypeScript simples!

Opcional: Abra `greeter.ts` no Visual Studio ou copie o código para o playground do TypeScript.
Você pode passar o mouse sobre os identificadores para ver seus tipos.
Observe que, em alguns casos, esses tipos são inferidos automaticamente para você.
Digite novamente a última linha e veja as listas de completamento e a ajuda de parâmetros com base nos tipos de elementos DOM.
Coloque o cursor sobre a referência da função greeter e pressione F12 para ir para sua definição.
Observe também que você pode clicar com o botão direito em um símbolo e usar a refatoração para renomeá-lo.

As informações de tipo fornecidas funcionam em conjunto com as ferramentas para trabalhar com JavaScript na escala do aplicativo.
Para obter mais exemplos do que é possível no TypeScript, consulte a seção Amostras do site.

![Visual Studio picture](/images/docs/greet_person.png)
