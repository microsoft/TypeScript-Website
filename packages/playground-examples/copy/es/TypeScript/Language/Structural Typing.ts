// TypeScript es un sistema de tipo estructural. Un sistema
// de tipo estructural significa que cuando se comparan los
// tipos, TypeScript sólo tiene en cuenta los miembros en el
// tipo.

// Esto es en contraste con los sistemas de tipo nominal,
// donde se pueden crear dos tipos pero no se pueden asignar
// uno al otro. Véase example:nominal-typing

// Por ejemplo, estas dos interfaces son completamente
// transferibles en un sistema de tipo estructural:

interface Ball {
  diameter: number;
}
interface Sphere {
  diameter: number;
}

let ball: Ball = { diameter: 10 };
let sphere: Sphere = { diameter: 20 };

sphere = ball;
ball = sphere;

// Si añadimos un tipo que estructuralmente contiene todos
// los miembros de Ball (Bola) y Sphere (Esfera), entonces
// también puede ser configurado para ser una bola o esfera.

interface Tube {
  diameter: number;
  length: number;
}

let tube: Tube = { diameter: 12, length: 3 };

tube = ball;
ball = tube;

// Debido a que una bola no tiene una longitud, no puede ser
// asignada a la variable `tube`. Sin embargo, todos los
// miembros de Ball están dentro de Tube, y por lo
// tanto puede ser asignada.

// TypeScript está comparando cada miembro del tipo con los
// demás para verificar su igualdad.

// Una función es un objeto en JavaScript y se compara de
// manera similar. Con un útil truco extra alrededor de los
// parámetros:

let createBall = (diameter: number) => ({ diameter });
let createSphere = (diameter: number, useInches: boolean) => {
  return { diameter: useInches ? diameter * 0.39 : diameter };
};

createSphere = createBall;
createBall = createSphere;

// TypeScript permitirá que (number) sea igual a (number, boolean)
// en los parámetros, pero no (number, boolean) -> (number)

// TypeScript descartará el booleano en la primera
// asignación porque es muy común que el código JavaScript
// salte los parámetros de paso cuando no se necesitan.

// Por ejemplo, el método forEach del arreglo tiene tres
// parámetros, value, index y el arreglo entero - si
// TypeScript no soportará el descarte de parámetros,
// entonces tendrías que incluir todas las opciones para
// hacer que las funciones coincidieran:

[createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
  console.log(ball);
});

// Nadie necesita eso.

// Los tipos de retorno se tratan como objetos, y cualquier
// diferencia se compara con las mismas reglas de igualdad
// de objetos de arriba.

let createRedBall = (diameter: number) => ({ diameter, color: "red" });

createBall = createRedBall;
createRedBall = createBall;

// Donde la primera asignación funciona (ambos tienen
// diámetro) pero la segunda no (la bola no tiene color).
