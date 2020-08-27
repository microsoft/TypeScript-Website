// TypeScript tem alguns casos engraçados para literais em seu código

// Grande parte desse suporte é abordado em widening
// and narrowing ( example:type-widening-narrowing ) e vale
// a pena cobrir isto primeiro.

// Um literal é um subtipo mais concreto de uma coleção de tipos.
// Isso significa que "Olá Mundo" é uma string, mas uma string
// não é um "Olá Mundo" dentro do sistema de tipos.

const olaMundo = "Olá Mundo";
let oiMundo = "Oi Mundo"; // isso é uma string porque foi declarado com let

// Essa função recebe qualquer string
declare function permiteQualquerString(arg: string);
permiteQualquerString(olaMundo);
permiteQualquerString(oiMundo);

// Essa função aceita apenas o literal "Olá Mundo"
declare function permiteApenasOlaMundo(arg: "Olá Mundo");
permiteApenasOlaMundo(olaMundo);
permiteApenasOlaMundo(oiMundo);

// Isso permite você declarar APIs que usam unions para dizer
// que só aceitam literais específicos:

declare function permiteOsPrimeirosCincoNumeros(arg: 1 | 2 | 3 | 4 | 5);
permiteOsPrimeirosCincoNumeros(1);
permiteOsPrimeirosCincoNumeros(10);

let potencilamenteQualquerNumero = 3;
permiteOsPrimeirosCincoNumeros(potencilamenteQualquerNumero);

// A primeira vista essa regra não é aplicada para objetos complexos.

const meuUsuario = {
  nome: "Sabrina",
};

// Veja como isso transforma `nome: "Sabrina"` para `nome: string`
// mesmo que definido como uma constante. Isso acontece pelo fato do nome
// poder ser alterado a qualquer momento:

meuUsuario.nome = "Cynthia";

// Porque o nome do objeto meuUsuario poder ser alterado, o TypeScript
// não pode usar a versão literal no sistema de tipagem.
// No entanto existe uma funcionalidade que permite você fazer isso.

const meuUsuarioImutavel = {
  nome: "Fatma",
} as const;

// Quado "as const" é aplicado ao objeto, ele se torna
// um objeto literal que não pode ser alterado ao invés de um
// objeto mutável.

meuUsuarioImutavel.nome = "Raîssa";

// "as const" é uma ótima ferramenta para dados fixos e lugares
// onde você trata código como literal. "as const" também
// funciona com arrays:

const usuariosExemplos = [{ nome: "Brian" }, { nome: "Fahrooq" }] as const;
