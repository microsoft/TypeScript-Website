//// { compiler: { ts: "3.8.3" } }
// Na versão 3.8 nós adicionamos uma nova sintaxe para importar tipos,
// que seria similar para usuários que vieram do Flow.

// 'import type' fornece uma maneira de declarar um tipo 'only import'
// que significa que você tem certeza que o código será apagado quando
// convertido para JavaScript de uma maneira bem previsível porque
// isso sempre será removido.

// Por exemplo, esta linha nunca adicionará um 'import' ou 'require' na saída
import type { CSSProperties } from "react";

// Esse tipo é utilizado aqui
const style: CSSProperties = {
  textAlign: "center",
};

// Isto está em contraste com este 'import':
import * as React from "react";

// Que será incluído no JavaScript
export class Welcome extends React.Component {
  render() {
    return (
      <div style={style}>
        <h1>Olá, mundo</h1>
      </div>
    );
  }
}

// Contudo, se utilizar o 'import' comum para importar apenas
// tipos, ele também pode ser removido. Se você olhar na
// saída compilada do JavaScript, este 'import' não está incluído.

import { FunctionComponent } from "react";

export const BetaNotice: FunctionComponent = () => {
  return <p>Esta página ainda está em beta</p>;
};

// Isto é chamado de 'import elision', e pode ser a fonte
// da confusão. A sintaxe 'import type' permite que você seja
// específico sobre o que você quer no JavaScript.

// Esta é uma pequena visão geral para um dos principais casos de uso
// de 'import types' mas existem outros que você pode ler nas notas
// de lançamento da versão 3.8.

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports
