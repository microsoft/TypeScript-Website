---
display: "Excluir"
oneline: "Arquivos ou padrões a serem ignorados pela opção de incluir"
---

Especifica uma array de nomes de arquivos ou padrões que devem ser ignorando durante o `include`.

**Importante**: `exclude` altera _apenas_ os arquivos que estão nos resultados da configuração `include`.
Um arquivo marcado como `exclude` ainda pode fazer parte do seu código através de uma instrução `import`, uma inclusão de `types`, uma diretiva `/// <reference` ou sendo relacionado na lista de `files`.

Não é um mecanismo que **impede** um arquivo ser incluído no código base - apenas altera o que a configuração `include` pode selecionar.
