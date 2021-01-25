//// { compilador: { ts: "4.1.0-beta" } }

// Na versão 4.1 o JSDoc parser no Typescript
// utilizado tanto em arquivos JavaScript quanto TypeScript
// suporta o parâmetro @see.

// Você pode utilizar o @see para auxiliar as pessoas rapidamente
// acessar outro código relacionado clicando
// (cmd/ctrl + clique) ou passando o mouse sobre

/**
 * @see hello
 */
const adeus = "Ad";

/**
 * Você diz O, eu digo lá
 *
 * @see adeus
 * */
const ola = "Olá, olá";
