---
display: "Profundidade JS do módulo de nó máximo"
oneline: "Quão profundo o TypeScript deve executar a verificação de tipo em node_modules"
---

A profundidade máxima de dependência para pesquisar em `node_modules` e carregar arquivos JavaScript.

Este sinalizador só pode ser usado quando [`allowJs`](#allowJs) está habilitado, e é usado se você quiser ter tipos de inferência TypeScript para todo o JavaScript dentro de seu `node_modules`.

Idealmente, isso deve ficar em 0 (o padrão), e os arquivos `d.ts` devem ser usados para definir explicitamente a forma dos módulos.
No entanto, há casos em que você pode querer ativar isso em detrimento da velocidade e da precisão potencial.
