---
display: "Verificações rígidas"
---

Recomendamos utilizar [a opção `strict`](#strict) para aceitar todas as melhorias possíveis a medida que são feitas.

TypeScript suporta um amplo espectro dos padrões do Javascript e padrões para permitir bastante flexibilidade em acomodar estes estilos.
Frequentemente, a segurança e escalabiliade em potencial do código base pode estar em conflito com alguma dessas técnicas.

Devido a variedade do Javascript suportado, a atualização para uma nova versão do Typescript pode revelar dois tipos de erros:

- Erros que já existem no seu código base, que o Typescript passa a revelar, dado um melhor entendimento de Javascript.
- Um novo conjunto de erros que abordam um novo escopo de problema.

O TypeScript irá adicionar um sinalizador de compilador para o último conjunto de erros, e por padrão estes não estão habilitados.
