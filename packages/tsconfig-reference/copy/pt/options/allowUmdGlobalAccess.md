---
display: "Permitir Acesso Global UMD"
oneline: "Assume que todos os imports UMD estão disponíveis globalmente"
---

Quando setado para `true`, a flag `allowUmdGlobalAccess` deixa que você acesse todos os exports UMD como globais de dentro dos arquivos de módulo. Um arquivo de módulo é um arquivo que tem imports e/ou exports. Sem essa configuração, usando um export de dentro de um módulo UMD vai pedir uma declaração de import.

Um caso de exemplo para essa flag seria um projeto web onde você sabe que uma biblioteca em particular (como o jQuery ou Lodash) vai estar sempre disponível em runtime, mas você não pode acessá-la com um import.