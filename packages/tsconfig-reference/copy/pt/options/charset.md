---
display: "Charset"
oneline: "Seta manualmente o encoding do texto para leitura de arquivos"
---

Nas versões anteriores do TypeScript, isso controlava qual codificação era usada ao ler arquivos de texto do disco.
Hoje, o TypeScript assume a codificação UTF-8, mas detectará corretamente as codificações UTF-16 (BE e LE) ou UTF-8 com [BOMs](https://pt.wikipedia.org/wiki/Marca_de_ordem_de_byte).
