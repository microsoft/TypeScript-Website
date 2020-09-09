//// { order: 2 }

// Quando um metodo de uma classe é chamado, você geralmente espera
// que ele se refira a atual instancia dessa classe.

class Seguro{
  conteudo: string;
  
  constructor(contents: string) {
    this.conteudo = conteudo;
  }
  
  printConteudo() {
    console.log(this.conteudo);
  }
}

const seguro = new Seguro("Joias da Coroa");
seguro.printConteudo();
// Se você vem de uma linguagem orientada a objeto aonde
// a variavel this/self é facilmente previsivel, entao você
// talvez precise ler sobre como o "this" pode ser confuso:
//
// https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
// https://aka.ms/AA5ugm2

// Obs: isso pode mudar. A referencia que o this se refere
// pode ser diferente dependendo de como você chama a função.

// Por exemplo, se você usa uma referencia para uma função em
// outro objeto, e então chama ela atraves dele - a variavel this
// vai ser passar a ter de referencia o objeto que recebe:

const objetoCapturandoThis = { conteudo: "http://gph.is/VxeHsW", print: safe.printConteudo };
objetoCapturandoThis.print(); // Imprimre "http://gph.is/VxeHsW", e não "Joias da Coroa"

// Isso é complicado, porque quando lidamos com callback de APIs
// pode ser bastante tentador passar a referencia direto para
// a função. Isso pode ser resolvido criando uma nova função
// no lugar de chamada.

const objetoQueNaoCapturaThis = { conteudo: "N/A", print: () => safe.printConteudo() };
objetoQueNaoCapturaThis.print();

// Existem algumas outras formas de resolver esse problema. Uma delas
// é forçar a ligação do this com o objeto que você originalmente
// pretendia ligar.

const objetoCapturandoOThisDeNovo = { conteudo: "N/A", print: safe.printContents.bind(safe) };
objetoCapturandoOThisDeNovo.print();

// Para lidar com um contexto inesperado, você tambem pode
// mudar a forma com que criou a função na sua classe.
// Ao criar uma função que use uma arrow function, o momento
// que a vinculação acontece vai ser diferente. O que faz com
// que seja mais previsivel para os que tem menos experiencia
// com o tempo de execução do JavaScript.

class SeguroComSegurança {
  conteudo: string;
  
  constructor(conteudo: string) {
    this.contents = contents;
  }
  
  printConteudo = () => {
    console.log(this.conteudo);
  };
}

// Agora ao passar a função para outro objeto
// ele não vai acidentalmente mudar o this.

const segurançaASegurada = new SeguroComSegurança ("Caveira de Cristal");
segurançaASegurada.printConteudo();

const objetoTentandoMudarOThis = {
  conteudo: "http://gph.is/XLof62",
  print: segurançaASegurada.printConteudo,
};

objetoTentandoMudarOThis.print();
// Se você tem um projeto em TypeScript, você pode usar a flag
// do compilador noImplicitThis para marcar casos aonde o TypeScript
// não pode determinar que tipo de "this" é para a função.

// Você pode ler mais sobre no manual:
//
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
