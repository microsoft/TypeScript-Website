---
title: Compilação Noturna
layout: docs
permalink: /pt/docs/handbook/nightly-builds.html
oneline: Como usar uma compilação noturna de TypeScript
translatable: true
---

Uma compilação noturna da branch [`master` do TypeScript](https://github.com/Microsoft/TypeScript/tree/master) é publicada à meia-noite PST no npm.
Veja como você pode obtê-la e usá-la com suas ferramentas.

## Usando o npm

```shell
npm install -g typescript@next
```

## Atualizando seu IDE para usar as compilações noturnas

Você também pode atualizar seu IDE para usar o lançamento noturno.
Primeiro você precisará instalar o pacote por meio do npm.
Você pode instalar o pacote npm globalmente ou em uma pasta local `node_modules`.

O resto desta seção assume que `typescript @ next` já está instalado.

### Visual Studio Code

Atualize `.vscode/settings.json` com o seguinte:

```json
"typescript.tsdk": "<caminho para sua pasta>/node_modules/typescript/lib"
```

Mais informações estão disponíveis em [documentação VSCode](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### Sublime Text

Atualize o arquivo `Settings - User` com o seguinte:

```json
"typescript_tsdk": "<caminho para sua pasta>/node_modules/typescript/lib"
```

Mais informações estão disponíveis em [Plug-in do TypeScript para documentação de instalação do Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 and 2015

> Observação: a maioria das alterações não exige a instalação de uma nova versão do plug-in VS TypeScript.

A compilação noturna atualmente não inclui a configuração completa do plug-in, mas estamos trabalhando na publicação de um instalador todas as noites também.

1. Baixe o script [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1).

   > Veja também nossa página wiki em [usando um arquivo de serviço de idioma personalizado](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).

2. Em uma janela de comando do PowerShell, execute:

Para VS 2015:

```posh
VSDevMode.ps1 14 -tsScript <caminho para sua pasta>/node_modules/typescript/lib
```

Para VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <caminho para sua pasta>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Vá para `Preferences` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: Se você instalou com npm: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Vá para `File` > `Settings` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: Se você instalou com npm: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
