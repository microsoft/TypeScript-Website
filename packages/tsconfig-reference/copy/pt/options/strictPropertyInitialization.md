---
display: "Inicialização restrita de propriedade"
oneline: "Garante que todas as propriedades da classe correspondam aos seus tipos depois que o construtor finalizar"
---

Quando definido como `true`, o TypeScript gerará um erro quando uma propriedade de classe for declarada, mas não definida no construtor.

```ts twoslash
// @errors: 2564
class Conta {
  nome: string;
  tipo = "usuario";

  email: string;
  endereco: string | undefined;

  constructor(nome: string) {
    this.nome = nome;
    // Note que this.email não foi atribuído
  }
}
```

No caso acima:

- `this.nome` é atribuído especificamente.
- `this.tipo` é atribuído por padrão.
- `this.email` não é atribuído e gera um erro.
- `this.endereco` é declarado como possível `undefined`, o que significa que não precisa ser atribuído.
