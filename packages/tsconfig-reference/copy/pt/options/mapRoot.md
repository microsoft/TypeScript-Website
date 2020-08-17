---
display: "Raiz do mapa"
oneline: "Defina uma raiz externa para mapas de origem"
---

Especifique o local onde o depurador deve localizar os arquivos de mapa em vez dos locais gerados.
Esta string é tratada literalmente dentro do source-map, por exemplo:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://my-website.com/debug/sourcemaps/"
  }
}
```

Declararia que `index.js` terá mapas de origem em `https://my-website.com/debug/sourcemaps/index.js.map`.
