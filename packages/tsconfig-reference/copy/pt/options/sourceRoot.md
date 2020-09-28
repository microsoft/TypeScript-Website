---
display: "Raiz do código-fonte"
oneline: "Configura o caminho da raiz para depuradores acharem o código-fonte referenciado"

---

Especifica a localização onde o depurador deve encontrar os arquivos TypeScript ao invés de outros locais relativos de origem.
Essa string é processada literalmente dentro do mapa de origem, onde você pode utilizar um caminho ou uma URL:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "https://my-website.com/debug/source/"
  }
}
```

Declara que o `index.js` tem um arquivo fonte em `https://my-website.com/debug/source/index.ts`.
