---
display: "Diretórios Raiz"
oneline: "Define múltiplos diretórios raiz"
---

Usando `rootDirs`, você pode informar ao compilador que existem vários diretórios raiz agindo como um único diretório raiz "virtual".
Isso faz com que o compilador resolva importações relativas de módulos como se estes diretórios fossem um único diretório raiz.

Por exemplo:

```
 src
 └── views
     └── view1.ts (pode importar "./template1", "./view2`)
     └── view2.ts (pode importar "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (pode importar "./view1", "./view2")
```

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

Esta propriedade não altera como TypeScript emite JavaScript, mas apenas emula a suposição de que
os arquivos JavaScript poderão trabalhar através desses caminhos relativos em tempo de execução.
