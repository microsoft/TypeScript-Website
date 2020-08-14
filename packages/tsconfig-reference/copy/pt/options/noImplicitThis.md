---
display: "Sem 'This' Implícito"
oneline: "Emite erro nas expressões 'this' com tipo 'any' implícito"
---

Emite erro nas expressões 'this' com tipo 'any' implícito.

Por exemplo, a classe abaixo retorna uma função que tenta acessar `this.largura` e `this.area` – mas o contexto para `this` dentro da função dentro de `funcaoObterArea` não é a instância de `Retangulo`.

```ts twoslash
// @errors: 2683
class Retangulo {
  largura: number;
  altura: number;

  constructor(largura: number, altura: number) {
    this.largura = largura;
    this.altura = altura;
  }

  funcaoObterArea() {
    return function () {
      return this.largura * this.altura;
    };
  }
}
```
