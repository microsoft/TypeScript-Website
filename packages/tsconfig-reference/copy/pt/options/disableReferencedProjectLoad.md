---
display: "Desabilitar o carregamento do projeto referenciado"
oneline: "Reduz o número de projetos carregados automaticamente pelo TypeScript"
---

Em aplicações Typescript de multi projetos, o TypeScript irá carregar todos os projetos disponíveis na memória com o objetivo de
fornecer resultados mais precisos para as respostas do editor que requerem um gráfico de conhecimento completo como 'Localizar todas as referências'.

Se o seu projeto for grande, você pode utilizar a _flag_ `disableReferencedProjectLoad` para desabilitar o carregamento automático de todos os projetos. Com isso, os projetos serão carregados dinamicamente quando você abrir os arquivos através do seu editor.
