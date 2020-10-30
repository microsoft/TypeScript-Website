---
title: Inferência de Tipo
layout: docs
permalink: /pt/docs/handbook/type-inference.html
oneline: Como a analise do fluxo de código funciona em TypeScript
translatable: true
---

Em TypeScript, existem vários locais onde a inferência de tipos é usada para prover informação quando não se tem um tipo explícito de anotação. Por exemplo, nesse código

```ts twoslash
let x = 3;
//  ^?
```

O tipo da variável `x` é inferido como sendo `number`.
Esse tipo de inferência ocorre ao inicializar variáveis e membros, definir valores padrão de parâmetros e ao determinar o tipo de valor retornado por funções. 

Na maioria dos casos, inferência de tipos é fácil de entender.
Na próxima sessão, iremos explorar algumas das nuances em como tipos são inferidos.

## Melhor tipo comum

Quando uma inferência de tipo é composta por várias expressões, o tipo dessas expressões é usada para calcular o "melhor tipo comum". Por exemplo:

```ts twoslash
let x = [0, 1, null];
//  ^?
```

Para inferir o tipo de `x` no exemplo acima, nós precisamos considerar o tipo de cada elemento do array. 
Aqui nos foi dada duas escolhas para o tipo do array: `number` e `null`.
O algoritmo do melhor tipo comum considera o tipo de cada candidato e escolhe o tipo que é compatível com todos os outros candidatos.

Porquê o melhor tipo comum tem de ser escolhido a partir dos tipos candidatos providos, existem alguns casos onde tipos compartilham uma estrutura comum, mas nenhum tipo é o supertipo de todos os tipos candidatos. Por Exemplo:

```ts twoslash
// @strict: false
class Animal {}
class Rinoceronte extends Animal {
  temChifre: true;
}
class Elefante extends Animal {
  temTromba: true;
}
class Cobra extends Animal {
  temPernas: false;
}
// ---cut---
let zoo = [new Rinoceronte(), new Elefante(), new Cobra()];
//    ^?
```

De forma ideal, queremos que `zoo` seja inferido como um `Animal[]`, mas como não existe um objeto que seja estritamente do tipo `Animal` no array, nós não fazemos inferências sobre o tipo de elemento do array.
Para corrigir isso, em troca forneça explicitamente o tipo quando nenhum outro tipo é um supertipo de todos os outros candidatos:

```ts twoslash
// @strict: false
class Animal {}
class Rinoceronte extends Animal {
  temChifre: true;
}
class Elefante extends Animal {
  temTromba: true;
}
class Cobra extends Animal {
  temPernas: false;
}
// ---cut---
let zoo: Animal[] = [new Rinoceronte(), new Elefante(), new Cobra()];
//    ^?
```

Quando nenhum tipo comum é encontrado, a inferência resultante é a união dos tipos do array, `(Rinoceronte | Elefante | Cobra)[]`.

## Tipagem Contextual

Inferência de tipo também funciona "em direção oposta" em alguns casos no TypeScript.
Isso é conhecido como "tipagem contextual". Tipagem contextual ocorre quando o tipo de uma expressão é inferido por sua localização. Por exemplo:

```ts
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.botao); //<- OK
  console.log(mouseEvent.canguru); //<- Error!
};
```

Aqui, o verificador de tipos do TypeScript usa o tipo da função `Window.onmousedown` para inferir o tipo da expressão função do lado direito da atribuição.
Ao fazer isso, ele foi capaz de inferir o [tipo](https://developer.mozilla.org/docs/Web/API/MouseEvent) do parâmetro `mouseEvent`, que de fato contém uma propriedade `botao`, mas não uma propriedade `canguru`.

TypeScript é inteligente o suficiente para inferir tipos em outros contextos também:

```ts
window.onscroll = function (uiEvent) {
  console.log(uiEvent.botao); //<- Erro!
};
```

Baseado no fato que a função acima foi atribuida a `Window.onscroll`, TypeScript sabe que `uiEvent` é um [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent), e não um [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) como no exemplo anterior. Objetos `UIEvent` não contém a propriedade `botao`, dessa forma TypeScript irá lançar um erro.

Se essa função não estivesse digitada em uma posição contextualizada, os argumentos da função teriam implicitamente o tipo `any`, e nenhum erro seria emitido (a não ser que você esteja usando a opção `--noImplicitAny`):

```ts
const handler = function (uiEvent) {
  console.log(uiEvent.botao); //<- OK
};
```

Nós também podemos fornecer explicitamente informação sobre o tipo para que os argumentos da função sobrescrevam qualquer tipo contextual:

```ts
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.botao); //<- Agora, nenhum erro é fornecido
};
```

Entretanto, esse código será exibido no log como `undefined`, uma vez que `uiEvent` não tem nenhuma propriedade `botao`.

Tipagem contextual se aplica em muitos casos.
Casos comuns incluem argumentos para chamadas de funções, lado direito de atribuições, asserções de tipo, membros de objetos, arrays literais, e declarações de retorno.
O tipo contextual também age como um tipo candidato no melhor tipo comum. Por exemplo: 

```ts
function criaZologico(): Animal[] {
  return [new Rinoceronte(), new Elefante(), new Cobra()];
}
```

Nesse exemplo, o melhor tipo comum tem um grupo de quatro candidatos: `Animal`, `Rinoceronte`, `Elefante`, e `Cobra`.
Desses, `Animal` pode ser escolhido pelo algorítimo de melhor candidato comum.
