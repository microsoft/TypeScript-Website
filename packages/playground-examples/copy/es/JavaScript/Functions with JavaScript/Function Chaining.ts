//// { title: 'Encadenamiento de funciones', order: 2, compiler: { esModuleInterop: true } }

// Las APIs con funciones encadenadas son un patrón común en
// JavaScript, lo que permite que tu código sea más conciso,
// con menos valores intermedios y más fácil de leer debido
// a sus habilidades de anidamiento.

// Una API muy común que funciona con encadenamiento
// es jQuery. Aquí hay un ejemplo de jQuery
// usada con tipos de DefinitelyTyped:

import $ from "jquery";

// Aquí hay un ejemplo de uso de la API de jQuery:

$("#navigation").css("background", "red").height(300).fadeIn(200);

// Si añades un punto en la línea de arriba, verás
// una larga lista de funciones. Este patrón es fácil
// de reproducir en JavaScript. La clave es asegurarse
// de que siempre retornes el mismo objeto.

// Aquí hay un ejemplo de API que crea una API con
// encadenamiento. La clave es tener una función en
// un nivel externo que mantenga información del estado
// interno, y un objeto que exponga la API que se
// devuelve siempre.

const addTwoNumbers = (start = 1) => {
  let n = start;

  const api = {
    // Implement each function in your API
    add(inc: number = 1) {
      n += inc;
      return api;
    },

    print() {
      console.log(n);
      return api;
    },
  };
  return api;
};

// Lo que permite el mismo estilo de API que
// vimos en jQuery:

addTwoNumbers(1).add(3).add().print().add(1);

// Aquí hay un ejemplo similar que usa una clase:

class AddNumbers {
  private n: number;

  constructor(start = 0) {
    this.n = start;
  }

  public add(inc = 1) {
    this.n = this.n + inc;
    return this;
  }

  public print() {
    console.log(this.n);
    return this;
  }
}

// Y aquí la vemos en acción:

new AddNumbers(2).add(3).add().print().add(1);

// Este ejemplo hace uso de la inferencia
// de tipos de TypeScript como una forma
// de proporcionar herramientas para patrones
// de JavaScript.

// Para más ejemplos sobre esto:
//
//  - example:code-flow
