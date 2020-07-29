---
display: "Composição"
oneline: "Usado para criar múltiplos projetos de build"
---

A opção `composite` aplica certas restrições que possibilitam que ferramentas de build (incluindo o TypeScript
no modo `--build`) determinem rapidamente se um projeto já foi construído.

Quando esta configuração está ativada:

- A configuração `rootDir`, se não foi setada explicitamente, é o diretório que contém o arquivo `tsconfig.json`.

- Todos os arquivos de implementação devem corresponder a um padrão do `include` ou listados no array `files`. Se esta restrição for violada, o `tsc` informará quais arquivos não foram especificados.

- `declaration` é setado como `true`

Você pode encontrar a documentação de projetos TypeScript [no guia](https://www.typescriptlang.org/docs/handbook/project-references.html).
