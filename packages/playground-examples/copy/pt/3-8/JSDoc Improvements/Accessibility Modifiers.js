//// { compiler: { ts: "3.8.3" }, isJavaScript: true }
// @ts-check

// O JSDoc para TypeScript foi extendido para suportar
// os modificadores de acesso nas propriedades das classes. Aqui estão eles:
//
// @public - Padrão. É utilizado se não for definido um modificador.
// @private - O campo somente pode ser acessado na mesma classe onde foi definido.
// @protected - O campo é acessível para a classe onde foi definida e suas subclasses.
//

// No exemplo temos a classe pai Animal, ela tem propriedades private e protected.
// Subclasses podem acessar "this.isRapido" mas não podem acessar "this.type"

// Fora dessa classes, ambos os campos não são visíveis  e retornam um erro do compilador quando
// @ts-check é ativado:

class Animal {
  constructor(tipo) {
    /** @private */
    this.tipo = tipo;
    /** @protected */
    this.isRapido = tipo === "leopardo";
  }

  fazerBarulho() {
    // Supostamente são muito silenciosos
    if (this.tipo === "tigre") {
      console.log("tigre");
    } else {
      throw new Error("fazerBarulho foi invocado na classe pai");
    }
  }
}

class Gato extends Animal {
  constructor(tipo) {
    super(tipo || "gato");
  }

  fazerBarulho() {
    console.log("miau");
  }

  fugir() {
    if (this.isRapido) {
      console.log("Fugiu");
    } else {
      console.log("Não conseguiu fugir");
    }
  }
}

class Leopardo extends Gato {
  constructor() {
    super("leopardo");
  }
}

class Tigre extends Gato {
  constructor() {
    super("tigre");
  }
}

const gato = new Gato();
gato.fazerBarulho();

// Essas propriedades não são acessíveis
gato.type;
gato.isFast;

// Você pode ler mais no post abaixo:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#jsdoc-modifiers
