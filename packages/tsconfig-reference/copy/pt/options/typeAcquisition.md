---
display: "Aquisição de tipo"
oneline: "Conjunto de opções para aquisição de tipo automática no JavaScript"
---

Quando você tem um projeto JavaScript no seu editor, TypeScript providenciará tipos para o seu `node_modules` automaticamente utilizando o conjunto de definições de `@types`, DefinitelyTyped.
Isso é conhecido como aquisição de tipo automática e você pode modificá-la utilizando o objecto `typeAcquisition` no seu arquivo de configuração.

Se você quiser desabilitar ou modificar essa funcionalidade, crie o `jsconfig.json` na raíz do seu projeto:

```json
{
  "typeAcquisition": {
    "enable": false
  }
}
```

Se você quer incluir um módulo específico (mas ele não está em `node_modules`):

```json
{
  "typeAcquisition": {
    "include": ["jest"]
  }
}
```

Se um módulo não deve ser automaticamente adquirido, por exemplo, se uma biblioteca está disponível no seu `node_modules`, mas a sua equipe concordou em não utilizá-lo:

```json
{
  "typeAcquisition": {
    "exclude": ["jquery"]
  }
}
```
