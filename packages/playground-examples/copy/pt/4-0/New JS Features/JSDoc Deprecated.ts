//// { compiler: { ts: "4.0.2" } }

// Na versão 4.0 a tag JSDoc @deprecated foi adicionada ao
// sistema de tipos. Você pode usar @deprecated em qualquer
// lugar que usaria JSDoc atualmente.

interface AccountInfo {
  name: string;
  gender: string;

  /** @deprecated use o campo de gênero no lugar */
  sex: "male" | "female";
}

declare const userInfo: AccountInfo;
userInfo.sex;

// TypeScript irá oferecer um aviso não bloqueante quando
// uma propriedade descontinuada for acessada, e editores como
// vscode irão usar essa informação em lugares como o
// intellisense, outlines e no seu código.
