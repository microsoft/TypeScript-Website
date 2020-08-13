// TypeScript tem alguns casos engraçados para literais em seu código

// Grande parte desse suporte é abordado em widening
// and narrowing ( exemplo:type-widening-narrowing ) e vale
// a pena cobrir isto primeiro.

// Um literal é um subtipo mais concreto de uma coleção de tipos.
// Isso significa que "Olá Mundo" é uma string, mas uma string
// não é um "Olá Mundo" dentro do sistema de tipos.

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // isso é uma string porque é um let

// Essa função recebe qualquer string
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// Essa função aceita apenas o literal "Hello World"
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// Isso permite você declarar APIs que usam unions para dizer
// que só aceitam literais específicos:

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// A primeira vista essa regra não é aplicada para objetos complexos.

const myUser = {
  name: "Sabrina",
};

// Veja como isso transforma `name: "Sabrina"` para `name: string`
// mesmo que definido como uma constante. Isso acontece pelo fato do nome
// poder ser alterado a qualquer momento:

myUser.name = "Cynthia";

// Porque o nome do objeto myUser poder ser alterado, o TypeScript
// não pode usar a versão literal no sistema de tipagem.
// No entanto existe uma funcionalidade que permite você fazer isso.

const myUnchangingUser = {
  name: "Fatma",
} as const;

// Quado "as const" é aplicado ao objeto, ele se torna
// um objeto literal que não pode ser alterado ao invés de um
// objeto mutável.

myUnchangingUser.name = "Raîssa";

// "as const" é uma ótima ferramenta para dados fixos e lugares
// onde você trata código como literal. "as const" também
// funciona com arrays:

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
