---
display: "Inicialização de Propriedade Restrita"
oneline: "Garante que todas as propriedades da classe correspondam aos seus tipos depois que o construtor finalizar"
---

Quando definido como verdadeiro, o TypeScript gerará um erro quando uma propriedade de classe for declarada, mas não definida no construtor.

```ts twoslash
// @errors: 2564
class UserAccount {
  name: string;
  accountType = "user";

  email: string;
  address: string | undefined;

  constructor(name: string) {
    this.name = name;
    // Note quer this.email não foi atribuído
  }
}
```

No caso acima:

- `this.name` é atribuído especificamente.
- `this.accountType` é atribuído por padrão.
- `this.email` não é atribuído e gera um erro.
- `this.address` é declarado como possível `undefined`, o que significa que não precisa ser atribuído.
