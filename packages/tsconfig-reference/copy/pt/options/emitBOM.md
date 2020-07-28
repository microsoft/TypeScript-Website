---
display: "Emitir BOM"
oneline: "Inclui um byte order mark nos arquivos de saída"
---

Controla se o TypeScript emitirá uma [BOM (byte order mark)](https://wikipedia.org/wiki/Byte_order_mark) ao gravar arquivos de saída.
Alguns runtimes exigem que uma BOM interprete corretamente os arquivos JavaScript; outros exigem que ele não esteja presente.
O valor padrão de `false` é geralmente melhor, a menos que você tenha um motivo para alterá-lo.