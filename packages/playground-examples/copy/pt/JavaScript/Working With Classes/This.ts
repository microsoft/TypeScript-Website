//// { order: 2 }

// Quando um método de uma classe é chamado, você geralmente espera
// que ele se refira a atual instância dessa classe.

class Cofre {
  conteudo: string;
  
  constructor(conteudo: string) {
    this.conteudo = conteudo;
  }
  
  imprimeConteudo() {
    console.log(this.conteudo);
  }
}

const cofre = new Cofre("Jóias da Coroa");
cofre.imprimeConteudo();

// Se você veio de uma linguagem orientada a objetos onde
// a variável this/self é facilmente previsível, então você
// talvez precise ler sobre como o "this" pode ser confuso:
//
// https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
// https://aka.ms/AA5ugm2

// Obs: isso pode mudar. A referência que o this se refere
// pode ser diferente dependendo de como você chama a função.

// Por exemplo, se você usa uma referência para uma função em
// outro objeto, e então chama ela através dele - a variável this
// vai passar a ter de referência o objeto que recebe:

const objetoCapturandoThis = { conteudo: "http://gph.is/VxeHsW", imprime: cofre.imprimeConteudo };
objetoCapturandoThis.imprime(); // Imprime "http://gph.is/VxeHsW", e não "Jóias da Coroa"

// Isso é complicado, porque quando lidamos com callback de APIs
// pode ser bastante tentador passar a referência direto para
// a função. Isso pode ser resolvido criando uma nova função
// no lugar de chamada.

const objetoQueNaoCapturaThis = { conteudo: "N/A", imprime: () => cofre.imprimeConteudo() };
objetoQueNaoCapturaThis.imprime();

// Existem algumas outras formas de resolver esse problema. Uma delas
// é forçar a ligação do this com o objeto que você originalmente
// pretendia ligar.

const objetoCapturandoOThisDeNovo = { conteudo: "N/A", imprime: cofre.imprimeConteudo.bind(cofre) };
objetoCapturandoOThisDeNovo.imprime();

// Para lidar com um contexto inesperado, você também pode
// mudar a forma com que criou a função na sua classe.
// Ao criar uma função que use uma arrow function, o momento
// que a vinculação acontece vai ser diferente. O que faz com
// que seja mais previsível para os que têm menos experiência
// com o tempo de execução do JavaScript.

class CofreComSegurança {
  conteudo: string;
  
  constructor(conteudo: string) {
    this.conteudo = conteudo;
  }
  
  imprimeConteudo = () => {
    console.log(this.conteudo);
  };
}

// Agora ao passar a função para outro objeto
// ele não vai acidentalmente mudar o this.

const cofreASegurado = new CofreComSegurança("Caveira de Cristal");
cofreASegurado.imprimeConteudo();

const objetoTentandoMudarOThis = {
  conteudo: "http://gph.is/XLof62",
  imprime: cofreASegurado.imprimeConteudo,
};

objetoTentandoMudarOThis.imprime();

// Se você tem um projeto em TypeScript, você pode usar a flag
// do compilador noImplicitThis para marcar casos onde o TypeScript
// não pode determinar que tipo de "this" é para a função.

// Você pode ler mais sobre no manual:
//
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
