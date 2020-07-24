//// { title: 'Literales' }

// TypeScript tambien cuenta con algunos casos especiales
// para los literales en el código fuente.

// De hecho, gran parte del soporte está cubierto por la expansión
// y redución de tipos ( example:type-widening-narrowing ) y vale
// la pena hablar de ello primero.

// Un literal es un subtipo más concreto de un tipo común.
// Lo que esto significa es que "Hello World" es una cadena,
// pero una cadena no es "Hello World" dentro del sistema de tipos.

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // esto es una cadena porque se define con let

// Esta función acepta todas las cadenas
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// Esta función solo acepta la cadena literal "Hello World"
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// Esto te permite declarar APIs que usan uniones para decir
// que solo acepta unos literales en particular.

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// A primera vista, esta regla no se aplica a los objetos complejos.

const myUser = {
  name: "Sabrina",
};

// Notesé como transforma `name: "Sabrina"` a `name: string`
// aún cuando está definida como una constante. Esto se debe
// a que el nombre todavía puede cambiar en cualquier momento:

myUser.name = "Cynthia";

// Debido a que la propiedad `name` de `myUser` puede cambiar,
// TypeScript no puede usar la versión literal en el sistema
// de tipos. Sin embargo, hay una característica que le permitirá
// hacer esto.

const myUnchangingUser = {
  name: "Fatma",
} as const;

// Cuando se aplica "as const" al objeto, entonces se convierte
// en un objeto literal que no cambia a diferencia de un objeto
// mutable que sí puede.

myUnchangingUser.name = "Raîssa";

// "as const" es una gran herramienta para datos fijos, y lugares
// donde se trata el código como literales en línea. "as const"
// también funciona con los arreglos:

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
