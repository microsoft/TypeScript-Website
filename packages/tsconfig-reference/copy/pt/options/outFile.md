---
display: "Arquivo de saída"
oneline: "Produza um único arquivo de todos os arquivos JS concatenados"
---

Se especificado, todos os arquivos _global_ (não módulos) serão concatenados no único arquivo de saída especificado.

Se `module` for `system` ou `amd`, todos os arquivos do módulo também serão concatenados neste arquivo após todo o conteúdo global.

Nota: `outFile` não pode ser usado a menos que `module` seja `None`, `System`, ou `AMD`.
Esta opção _não pode_ pode ser usada para agrupar módulos CommonJS ou ES6.
