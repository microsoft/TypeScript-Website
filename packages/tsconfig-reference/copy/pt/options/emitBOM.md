---
display: "Emitir BOM"
oneline: "Inclui um byte order mark nos arquivos de saída"
---

Controla se o TypeScript emitirá uma [BOM (byte order mark)](https://pt.wikipedia.org/wiki/Marca_de_ordem_de_byte) ao gravar arquivos de saída.
Alguns runtimes exigem uma BOM para interpretar corretamente os arquivos JavaScript; outros exigem que ele não esteja presente.
O valor padrão de `false` é geralmente melhor, a menos que você tenha um motivo para alterá-lo.
