---
display: "JSX"
oneline: "Controla como o JSX é emitido"
---

Define como a sintaxe JSX é gerada em um arquivo JavaScript.
Isso afeta apenas a saída JS para arquivos que terminam em `.tsx`.

- `preserve`: Gera um arquivo `.jsx` sem alterar o JSX
- `react`: Converte JSX em equivalente `React.createElement` e gera arquivo`.js`
- `react-native`: Gera arquivo `.js` sem alterar o JSX
