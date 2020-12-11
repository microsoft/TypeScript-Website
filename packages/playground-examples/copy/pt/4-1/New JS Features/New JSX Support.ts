//// { compiler: { ts: "4.1.0-dev.20201028", jsx: 4 } }

// Na versão 17, o time React introduziu um novo formato
// para o Javascript emitido pelas transformações JSX.
// Você pode ver o código javascript no lado direito
// do playground na aba ".JS" ->

import { useState } from "react";

export function ExampleApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// Algumas das mudanças principais:
//
// - Use "import" para fornecer funções ao invés de um identificador React
// - Diferentes funções para um único elemento (jsx) vs múltiplos filhos (jsxs)
// - "Key" é separada das props
//
// Você pode ler o RFC que esta mudança implementa aqui:
// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

// A maioria dessas mudanças são por debaixo dos panos
// o que não deve afetar na forma como você escreve código JSX
// como um usuário final.
