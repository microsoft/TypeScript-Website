// Los tipos condicionales proporcionan una forma de hacer
// lógica simple en el sistema de tipos de TypeScript. Esta
// es definitivamente una característica avanzada, y es
// bastante factible que no necesites usar esto en tu código
// del día a día.

// Un tipo condicional se parece a:
//
//   A extends B ? C : D
//
// Donde la condición es si un tipo extiende una expresión
// y, en caso afirmativo, qué tipo debe devolverse.

// Veamos algunos ejemplos, para ser breves vamos a usar
// letras simples para los genéricos. Esto es opcional, pero
// al restringirnos a 60 caracteres es difícil que quepa en
// la pantalla.

type Cat = { meows: true };
type Dog = { barks: true };
type Cheetah = { meows: true; fast: true };
type Wolf = { barks: true; howls: true };

// Podemos crear un tipo condicional que permita extraer
// tipos que sólo se ajusten a un animal que ladra.

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// Entonces podemos crear tipos soportados por ExtractDogish:

// Un gato no ladra, por lo que retorna `never`
type NeverCat = ExtractDogish<Cat>;
// Un lobo puede ladrar, por lo que retorna la forma del
// objeto `Wolf`
type Wolfish = ExtractDogish<Wolf>;

// Esto resulta útil cuando se quiere trabajar con un unión
// de muchos tipos y reducir el número de opciones
// potenciales en una unión:

type Animals = Cat | Dog | Cheetah | Wolf;

// Cuando aplicas ExtractDogish a una unión de tipos, es
// igual a ejecutar los condicionales en cada uno de los
// miembros del tipo:

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf (Veasé example:unknown-and-never)

// Se denomina tipo condicional distributivo porque el tipo
// se distribuye sobre cada miembro de la unión.

// Tipos Condicionales Diferidos

// Los tipos condicionales pueden utilizarse para reforzar
// sus APIs, que pueden devolver diferentes tipos en función
// de las entradas.

// Por ejemplo, esta función que puede devolver una cadena o
// un número dependiendo del booleano pasado.

declare function getID<T extends boolean>(fancy: T): T extends true ? string : number;

// Entonces, dependiendo de cuánto sepa el sistema de tipos
// sobre el booleano, obtendrá diferentes tipos de retorno:

let stringReturnValue = getID(true);
let numberReturnValue = getID(false);
let stringOrNumber = getID(Math.random() < 0.5);

// En este caso, TypeScript puede saber el valor de retorno
// al instante. Sin embargo, puede usar tipos condicionales
// en funciones donde el tipo no se conoce todavía. Esto se
// denomina tipo condicional diferido.

// Igual que nuestro "Dogish" anterior, pero como función
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// Hay una herramienta extra útil dentro de los tipos
// condicionales, que es capaz de decirle específicamente a
// TypeScript que debe inferir el tipo al diferir. Esa es la
// palabra clave "infer".

// "infer" se usa típicamente para crear meta-tipos que
// inspeccionan los tipos existentes en tu código, piensa en
// ello como crear una nueva variable dentro del tipo.

type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

// Básicamente:
//
//  - Este es un tipo genérico condicional llamado
//    GetReturnValue el cual acepta un tipo como su primer
//    parámetro.
//
//  - El condicional revisa si el tipo es una función, y si
//    es así crea un nuevo tipo llamado R basado en el valor
//    retornado por esa función.
//
//  - Si la revisión pasa, el valor del tipo es el valor de
//    retorno inferido, sino es el tipo original.
//

type getIDReturn = GetReturnValue<typeof getID>;

// Esto falla en la comprobación de ser una función, y sólo
// devolvería el tipo pasado a ella.
type getCat = GetReturnValue<Cat>;
