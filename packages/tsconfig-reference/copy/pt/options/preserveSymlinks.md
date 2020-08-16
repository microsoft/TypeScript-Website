---
display: "Preservar Symlinks"
oneline: "Não resolva caminhos de links simbólicos"
---

Esta opção serve para refletir a mesma flag do Node.js; que não resolve o caminho real de links simbólicos.

Esta flag também exibe o comportamento oposto ao da opção `resolve.symlinks` do Webpack (ou seja, definir `preserveSymlinks` do TypeScript para true é o mesmo que definir `resolve.symlinks` do Webpack para false, e vice-versa).

Com esta opção habilitada, as referências para módulos e pacotes (ex. diretivas `import` e `/// <reference type="..." />`) são todas resolvidas em relação ao local do symlink em si, em vez de relativas ao caminho que o symlink resolve.
