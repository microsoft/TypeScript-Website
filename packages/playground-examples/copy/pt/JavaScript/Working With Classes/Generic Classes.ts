//// { order: 3 }

// Este exemplo é, em sua maioria, em TypeScript, porque é um modo muito
// mais fácil de entender primeiro. Ao fim, nós iremos
// ver como criar a mesma classe, porém utilizando JSDoc.

// Classes Genéricas são um meio de dizer que um tipo em particular
// depende de outro tipo. Por exemplo, aqui está uma gaveta
// que pode conter qualquer tipo de objeto, mas somente um tipo:

class Gaveta<TipoDeRoupa> {
  conteudo: TipoDeRoupa[] = [];

  adicionar(objeto: TipoDeRoupa) {
    this.conteudo.push(objeto);
  }

  remover() {
    return this.conteudo.pop();
  }
}

// Para usar uma Gaveta você precisará trabalhar com outro tipo:

interface Meia {
  cor: string;
}

interface Camiseta {
  tamanho: "s" | "m" | "l";
}

// Nós podemos criar uma Gaveta somente para meias passando
// o tipo Meia quando criamos uma nova Gaveta:
const gavetaDeMeias = new Gaveta<Meia>();

// Agora nós podemos adicionar ou remover meias na/da gaveta
gavetaDeMeias.adicionar({ cor: "branco" });
const minhaMeia = gavetaDeMeias.remover();

// Assim como criar uma gaveta de Camisetas:
const gavetaDeCamisetas = new Gaveta<Camiseta>();
gavetaDeCamisetas.adicionar({ tamanho: "m" });

// Se você for um pouco excêntrico, você pode até criar
// uma gaveta que tem Meias e Camisetas usando para isso
// uma união ("union"):

const gavetaMista = new Gaveta<Meia | Camiseta>();

// Criar uma classe como a Gaveta sem a sintaxe do TypeScript
// requer o uso da tag "template" em JSDoc.
// Neste exemplo nós definimos a variável template, então
// definimos as propriedades da classe:

// Para ter esse exemplo funcionando no playground, você terá
// que mudar as configurações para que seja um arquivo JavaScript,
// e apagar o código TypeScript acima.

/**
 * @template {{}} TipoDeRoupa
 */
class Comoda {
  constructor() {
    /** @type {TipoDeRoupa[]} */
    this.conteudo = [];
  }

  /** @param {TipoDeRoupa} object */
  adicionar(objeto) {
    this.conteudo.push(objeto);
  }

  /** @return {TipoDeRoupa} */
  remover() {
    return this.conteudo.pop();
  }
}

// Então nós criamos um tipo novo através do JSDoc:

/**
 * @typedef {Object} Casaco uma roupa
 * @property {string} cor cor do casaco
 */

// Então, quando nós criamos uma nova instância daquela classe
// nós utilizamos @type para marcar a variável como uma Comoda
// que lida com Casacos

/** @type {Comoda<Casaco>} */
const comodaDeCasacos = new Comoda();

comodaDeCasacos.adicionar({ cor: "verde" });
const casaco = comodaDeCasacos.remover();
