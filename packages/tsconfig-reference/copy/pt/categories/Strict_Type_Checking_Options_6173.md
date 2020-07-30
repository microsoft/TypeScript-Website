---
display: "Verificações Estritas"
---

Recomendamos usar o [compiler option `strict`](#strict) para aceitar todas as melhorias possíveis à medida em que elas são construídas.

O TypeScript suporta uma vasta gama de padrões JavaScript permitindo grande flexibilidade na acomodação desses estilos. Frequentemente a segurança e o potencial de escalabilidade de uma base de código podem estar em desacordo com algumas dessas técnicas.

Devido a variedade de JavaScript suportado, atualizar para uma nova versão do TypeScript pode revelar dois tipos de erros:

- Erros que já existiam no seu código e o TypeScript descobriu porque a linguagem aprimorou sua compreensão de JavaScript.
- Um novo conjunto de erros sobre um novo domínio de problemas.

O TypeScript geralmente vai adicionar uma sinalizador de compilador para o conjunto de erros mais recente e, por padrão, eles não estarão habilitados.
