//// {compiler: { strictFunctionTypes: false } }

// Sin antecedentes en la teoría de tipos, es poco probable que esté
// familiarizado con la idea de que un sistema de tipos sea "sólido".

// La Solidez es la idea de que el compilador puede dar garantías sobre el tipo
// de valor que tiene un valor en tiempo de ejecución, y no sólo durante la
// compilación. Esto es normal para la mayoría de los lenguajes de programación
// que se construyen con tipos desde el primer día.

// Sin embargo, la construcción de un sistema de tipos que modela un lenguaje el
// cual ha existido por algunas décadas se torna en la toma de decisiones para
// compensar tres cualidades: Simplicidad, Usabilidad y Solidez.

// Siendo el objetivo de TypeScript de ser capaz de soportar todo el código
// JavaScript, el lenguaje tiende a la simplicidad y la usabilidad cuando se
// presenta con formas de añadir tipos a JavaScript.

// Veamos algunos casos en los cuales TypeScript probablemente no es sólido,
// para entender cómo se verían esas compensaciones de otra manera.

// Aserciones de Tipo

const usersAge = ("23" as any) as number;

// TypeScript le permitirá usar aserciones de tipo para anular la inferencia de
// algo que está mal. El uso de aserciones de tipo es una manera de decirle a
// TypeScript que usted sabe lo que hace, y TypeScript tratará de dejarle
// continuar con ello.

// Los lenguajes que son sólidos ocasionalmente usarían comprobaciones de tiempo
// de ejecución para asegurarse de que los datos coinciden con lo que dicen sus
// tipos - pero TypeScript tiene como objetivo no tener un impacto en tiempo de
// ejecución de los tipos en su código transpilado.

// Parámetro de función Bi-variante

// Los parámetros de una función soportan la redefinición del parámetro para que
// sea un subtipo de la declaración original.

interface InputEvent {
  timestamp: number;
}
interface MouseInputEvent extends InputEvent {
  x: number;
  y: number;
}
interface KeyboardInputEvent extends InputEvent {
  keyCode: number;
}

function listenForEvent(eventType: "keyboard" | "mouse", handler: (event: InputEvent) => void) {}

// Puede volver a declarar el tipo de parámetro para que sea un subtipo de la
// declaración. En lo anterior, el parámetro `handler` esperaba un tipo
// InputEvent pero en los siguientes ejemplos - TypeScript acepta un tipo que
// tiene propiedades adicionales.

listenForEvent("keyboard", (event: KeyboardInputEvent) => {});
listenForEvent("mouse", (event: MouseInputEvent) => {});

// Esto puede extenderse hasta el tipo común más pequeño:

listenForEvent("mouse", (event: {}) => {});

// Pero no más allá:

listenForEvent("mouse", (event: string) => {});

// Esto cubre el patrón del mundo real para escuchar eventos en JavaScript, a
// expensas de tener un código más sólido.

// TypeScript puede arrojar un error cuando esto sucede a través de la opción
// `strictFunctionTypes`. O, podrías trabajar alrededor de este caso particular
// con sobrecargas de funciones,
// Véase: example:typing-functions

// Caso especial para Void

// Descarte de parámetros

// Para conocer acerca de los casos especiales con parámetros de función
// Véase example:structural-typing

// Parámetros Rest

// Los parámetros rest se asumen todos como opcionales, esto significa que
// TypeScript no tiene manera de hacer cumplir el número de parámetros
// disponibles para una llamada de retorno.

function getRandomNumbers(count: number, callback: (...args: number[]) => void) {}

getRandomNumbers(2, (first, second) => console.log([first, second]));
getRandomNumbers(400, first => console.log(first));

// Las funciones declaradas `void` pueden coincidir con una función con un valor de retorno

// Una función que retorna una función declarada `void` puede aceptar una
// función que acepta cualquier otro tipo.

const getPI = () => 3.14;

function runFunction(func: () => void) {
  func();
}

runFunction(getPI);

// Para más información sobre los lugares donde la solidez del sistema de tipos
// se ve comprometida, véase:

// https://github.com/Microsoft/TypeScript/wiki/FAQ#type-system-behavior
// https://github.com/Microsoft/TypeScript/issues/9825
// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
