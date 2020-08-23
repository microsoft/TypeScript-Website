---
display: "Caminhos"
oneline: "Um conjunto de locais para buscar importações"
---

Uma série de entradas que remapeiam as importações para locais de pesquisa relativos à `baseUrl`, há uma cobertura mais abrangente de `paths` no [manual](/docs/handbook/module-resolution.html#path-mapping).

`paths` permite que você declare como o TypeScript deve resolver importações nos seus `requires` e `imports`.

```json tsconfig tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // isto deve ser especificado se "paths" está especificado.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // este mapeamento é relativo à "baseUrl"
    }
  }
}
```

Isto permitiria que você escreva `import "jquery"`, e obtenha toda a digitação correta localmente.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "app/*": ["app/*"],
        "config/*": ["app/_config/*"],
        "environment/*": ["environments/*"],
        "shared/*": ["app/_shared/*"],
        "helpers/*": ["helpers/*"],
        "tests/*": ["tests/*"]
    },
}
```

Neste caso, você pode infomar o resolvedor de arquivos do TypeScript para dar suporte à vários prefixos personalizados para encontrar código.
Este padrão pode ser usado para evitar caminhos relativos longos no seu código base.
