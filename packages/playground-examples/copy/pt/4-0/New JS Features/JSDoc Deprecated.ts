//// { compiler: { ts: "4.0.0-beta" } }

// No 4.0 a tag @deprecated no JSDoc é adicionada
// para o sistema. Você pode usar @deprecated em qualquer
// lugar usando o  JSDoc atual.

interface InformacoesDaConta {
  nome: string;
  genero: string;

  /** @deprecated ao invés use o campo genero */
  sexo: "male" | "female";
}

declare const informacoesConta: InformacoesDaConta;
informacoesConta.sexo;

// TypeScrtipt irá oferecer um aviso sem bloqueio quando a
// propiedade deprecated (descontinuada) está acessada, e
// editores como vscode irão mostrar informações nos campos
// descontinuados com uso do intellisense, no contorno de
// seu código.
