// Podría ser más fácil comenzar el debate sobre la ampliación y
// la reducción con un ejemplo:

const welcomeString = "Hello There";
let replyString = "Hey";

// Aparte de las diferencias de texto en las cadenas, welcomeString
// es una const (lo que significa que el valor nunca cambiará)
// y replyString es un let (lo que significa que puede cambiar).

// Si pasas el cursor por encima de ambas variables, obtienes
// información de tipo muy diferente de TypeScript:
//
//   const welcomeString: "Hello There"
//
//   let replyString: string

// TypeScript ha inferido el tipo de welcomeString como la cadena
// literal "Hello There", mientras que replyString es una cadena
// general.

// Esto se debe a que let necesita un tipo mas amplio, podrias
// establecer replyString como cualquier otra cadena, lo que
// significa que tiene un conjunto más amplio de posibilidades.

replyString = "Hi :wave:";

// Si replyString tiene como tipo la cadena literal "Hey" -
// entonces nunca podrías cambiar el valor porque sólo podría
// cambiar a "Hey" de nuevo.

// La ampliación y reducción de tipos se basa en aumentar o
// reducir las posibilidades que un tipo puede representar.

// Un ejemplo de reducción de tipo es trabajar con uniones, el
// ejemplo del análisis de flujo de código se basa casi
// enteramente en la reducción: example:code-flow

// La reducción de tipo es lo que impulsa el modo estricto de
// TypeScript a través de las verificaciones de nulidad. Con el
// modo estricto desactivado, los marcadores de nulidad como
// indefinido y nulo son ignorados en una unión.

declare const quantumString: string | undefined;
// Esto fallará sólo en modo estricto
quantumString.length;

// En el modo estricto la responsabilidad es del autor del código
// para asegurar que el tipo se ha reducido al tipo no nulo.
// Normalmente esto es tan simple como una comprobación de tipo if:

if (quantumString) {
  quantumString.length;
}

// En el modo estricto, el tipo quantumString tiene dos representaciones.
// Dentro del condicional if, el tipo fue reducido a solo una cadena.

// Puede ver más ejemplos de reducción en:
//
// example:union-and-intersection-types
// example:discriminate-types

// Y aún más recursos en la web:
//
// https://mariusschulz.com/blog/literal-type-widening-in-typescript
// https://sandersn.github.io/manual/Widening-and-Narrowing-in-Typescript.html
