---
display: "Runtime alvo"
oneline: "Defina o runtime suportado da linguagem JavaScript para ser transpilado"
---

Navegadores modernos suportam todas as funcionalidades ES6, então `ES6` é uma boa escolha.
Você pode definir um alvo (target) mais baixo se o deploy do seu código for feito em ambientes antigos, ou um alvo mais alto se o seu código é garantido de rodar em ambientes mais novos.

A configuração `target` altera quais funcionalidades JS serão niveladas para baixo e quais ficarão inalteradas.
Por exemplo, a arrow function `() => this` será transformada na expressão `function` equivalente se o `target` for ES5 ou mais baixo.

Alterando o `target` também alterará o valor da [`lib`](#lib).
Você pode "misturar e combinar" as configurações `target` e `lib` da forma que quiser, mas você pode definir apenas o `target`, por conveniência.

Se você está trabalhando apenas com Node.js, esses são os `target`s recomendados para essas versões do Node:

| Name    | Supported Target |
| ------- | ---------------- |
| Node 8  | `ES2017`         |
| Node 10 | `ES2018`         |
| Node 12 | `ES2019`         |

Eles são baseados no banco de dados de suporte do [node.green](https://node.green).

O valor especial `ESNext` se refere a versão mais alta que a sua versão do TypeScript suporta.
Essa configuração deve ser utilizada com precaução, pois não significa a mesma coisa entre diferentes versões do TypeScript e pode tornar atualizações menos previsíveis.
