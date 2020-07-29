---
display: "Iteração Downlevel"
oneline: "Emite JavaScript mais compatível, porém mais verboso, para objetos iterativos"
---

Downleveling é o termo do TypeScript para transpilar para uma versão mais antiga do JavaScript.
Esse sinalizador permite que, em runtimes mais antigos do JavaScript, haja o suporte a uma implementação mais precisa de como o JavaScript moderno interage com novos conceitos.

O ECMAScript 6 adicionou várias novas primitivas de iteração: o loop `for / of` (`for (el of arr)`), operador de spread (`[a, ...b]`), spread de argumento (`fn (... args)`) e o [`Symbol.iterator`](https://medium.com/trainingcenter/iterators-em-javascript-880adef14495). `--downlevelIteration` permite que essas primitivas de iteração sejam usadas com mais precisão nos ambientes ES5 se uma implementação do [`Symbol.iterator`](https://medium.com/trainingcenter/iterators-em-javascript-880adef14495) estiver presente.

#### Exemplo: Efeitos no `for / of`

Sem a flag `downlevelIteration` ativa, um loop `for / of` em qualquer objeto sofre um downlevel para um loop `for` tradicional:

```ts twoslash
// @target: ES5
// @showEmit
const str = "Olá!";
for (const s of str) {
  console.log(s);
}
```

Isso geralmente é o que as pessoas esperam, mas não é 100% compatível com o comportamento do ECMAScript 6.
Certas strings, como emoji (😜), têm um `.length` de 2 (ou até mais!), Mas devem iterar como 1 unidade em um loop `for-of`.
Consulte [esta postagem no blog de Jonathan New](https://blog.jonnew.com/posts/poo-dot-length-equals-two) para obter uma explicação mais detalhada.

Quando o `downlevelIteration` estiver ativado, o TypeScript usará uma função auxiliar que verifica a implementação do `Symbol.iterator` (nativo ou polyfill). Se essa implementação estiver ausente, ela retornará à iteração baseada em índice.

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Olá!";
for (const s of str) {
  console.log(s);
}
```

> > **Nota:** ativar o `downlevelIteration` não melhora a compatibilidade se o `Symbol.iterator` não estiver presente no runtime.

#### Exemplo: Efeitos em Spreads de Arrays

Isso é um operador spread em um array:

```js
// Cria um novo array onde os elementos são: 1 seguido por todos os elementos do arr2
const arr = [1, ...arr2];
```

Baseado nas descrições, parece fácil fazer um downlevel para ES6:

```js
// Mesma coisa, certo?
const arr = [1].concat(arr2);
```

No entanto, isso é claramente diferente em certos casos bem raros.
Por exemplo, se o array tiver um "buraco" no meio, o índice faltante vai criar uma propriedade _própria_ quando sofrer o spread, mas isso não acontece quando usamos `concat`:

```js
// Fazemos um array onde temos o elemento do índice '1' faltando
let faltando = [0, , 1];
let spread = [...faltando];
let concatenado = [].concat(faltando);

// true
"1" in spread;
// false
"1" in concatenado;
```

Assim como `for / of`, `downlevelIteration` vai usar o `Symbol.iterator` (se presente) para emular de forma mais precisa o comportamento do ES 6.
