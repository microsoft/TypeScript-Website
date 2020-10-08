//// { order: 2, compiler: { esModuleInterop: true } }

// Encadeamento de funções é um padrão comum em JavaScript que pode fazer seu
// código mais legível e com menos valores intermediários, mais fácil de ler
// devido a suas qualidades de aninhamento

// JQuery é uma API comum que funciona via encadeamento.
// Aqui está um exemplo de JQuery sendo usada com os tipos
// a partir de DefinitelyTyped

import $ from "jquery";

// Aqui está um exemplo de uso da API do jQuery

$("#navigation").css("background", "red").height(300).fadeIn(200);

// Se você adicionar um ponto na linha acima, você verá
// uma lista longa de funções. Esse padrão é facil de reproduzir
// em JavaScript. A chave é certificar que você sempre tem o
// mesmo objeto como retorno.

// Aqui está um exemplo de uma API que cria um API encadeada.
// A chave é ter uma função externa que acompanha o estado interno
// e um objeto que expõe a API que é sempre retornada.

const addTwoNumbers = (start = 1) => {
  let n = start;

  const api = {
    // Implemente cada função na sua API
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

// O que permite o mesmo estilo de API como vimos no jQuery

addTwoNumbers(1).add(3).add().print().add(1);

// Aqui um exemplo similar que usa uma classe.

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

// Aqui o exemplo em ação.

new AddNumbers(2).add(3).add().print().add(1);

// Esse exemplo usou a inferência de tipos do TypeScrypt
// para fornecer uma maneira de prover ferramental para padrões JavaScript.

// Para mais exemplo disso:
//
//  - example:code-flow
