---
display: "Tipo de Funções Restritos"
oneline: "Garante que os parâmetros da função são consistentes"
---

Quando ativado, esta opção faz com que os parâmetros das funções sejam verificados mais corretamente.

Aqui está um exemplo básico com `strictFunctionTypes` desativado:

```ts twoslash
// @strictFunctionTypes: false
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Atribuição não segura
let func: StringOrNumberFunc = fn;
// Chamada não segura - vai quebrar
func(10);
```

Com `strictFunctionTypes` ativado, o erro é detectado corretamente:

```ts twoslash
// @errors: 2322
function fn(x: string) {
  console.log("Olá, " + x.toLowerCase());
}

type StringOuNumeroFn = (ns: string | number) => void;

// Atribuição não segura é prevenida
let func: StringOuNumeroFn = fn;
```

Durante o desenvolvimento desse recurso, descobrimos um grande número de hierarquias de classes profundamente não seguras, incluindo algumas no DOM.
Por causa disso, a configuração apenas se aplica a funções escritas na sintaxe _function_, não àquelas na sintaxe _method_:

```ts twoslash
type PareceUmMetodo = {
  func(x: string | number): void;
};

function fn(x: string) {
  console.log("Olá, " + x.toLowerCase());
}

// Por fim, uma atribuição insegura, porém não detectada.
const m: PareceUmMetodo = {
  func: fn,
};
m.func(10);
```
