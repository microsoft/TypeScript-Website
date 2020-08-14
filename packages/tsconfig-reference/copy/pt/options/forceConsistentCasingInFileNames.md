---
display: "Manter a consistência nos nomes do arquivo"
oneline: "Verifica se as letras maiúsculas e minúsculas estão corretas nas importações"
---

TypeScript diferencia letras maiúsculas e minúsculas no arquivo que está sendo executado.
Isso pode se tornar um problema se alguns desenvolvedores trabalharem com diferenciação de letras maiúsculas e minúsculas no arquivo, e outros não. Se um arquivo tentar importar `fileManager.ts` especificando `./FileManager.ts` em sistemas que não fazem a diferenciação de maiúsculas e minúsculas, vai encontrar o arquivo, porém, em sistemas que fazem essa diferenciação, o arquivo não será encontrado.

Quando essa opção está definida, o TypeScript vai gerar um erro caso o programa tente incluir um arquivo com padrão diferente - de diferenciação maiúsculas e minúsculas - no sistema.
