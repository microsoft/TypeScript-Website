//// { compiler: { ts: "3.8.3" } }
// A versão 3.8 adicionou os campos privados, que é uma maneira de declarar
// que um campo de uma classe é inacessível fora daquela classe, incluindo subclasses.

// Por exemplo, a classe Pessoa abaixo não permite que ninguém usando uma
// instância da classe leia o primeiroNome, sobrenome, e o prefixo.

class Pessoa {
  #primeiroNome: string;
  #sobrenome: string;
  #prefixo: string;
  
  constructor(primeiroNome: string, sobrenome: string, prefixo: string) {
    this.#primeiroNome = primeiroNome;
    this.#sobrenome = sobrenome;
    this.#prefixo = prefixo;
  }

  cumprimentar() {
    // Na Islândia é preferível que usemos o nome completo ao invés de [prefixo] [sobrenome]
    // https://www.w3.org/International/questions/qa-personal-names#patronymic
    if(navigator.languages[0] === "is") {
      console.log(`Góðan dag, ${this.#primeiroNome} ${this.#sobrenome}`);
    } else {
      console.log(`Olá, ${this.#prefixo} ${this.#sobrenome}`);
    }
  }
}

let jeremias = new Pessoa("Jeremias", "Beremias", "Sr.");
     
// Você não pode acessar nenhum dos campos dessa classe de fora dela:

// Por exemplo, isso não funciona:
console.log(jeremias.#primeiroNome);

// Nem isso:
console.log("Sobrenome de Pessoas:", jeremias["#sobrenome"]);

// Uma pergunta comum que fazemos é "Porque você usaria isso no lugar da
// palavra-chave 'private' dentro de uma classe?" - vamos fazer uma 
// comparação sobre para ver como isso funciona após a 3.8:

class Cachorro {
  private _nome: string;
  constructor(nome: string) {
    this._nome = nome;
  }
}

let rex = new Cachorro("Rex");
// Não permite que você acesse através da notação de ponto
rex._nome = "Caramelo";
// Mas permite que seja acessado através da notação de colchetes.
rex["_nome"] = "Bidu";

// A referência de private no TypeScript só existe no nível de tipos, o que
// significa que você só pode confiar nisso. Agora com os campos
// privados fazendo parte da linguagem JavaScript, você pode então
// garantir de uma forma melhor a visibilidade no seu código.

// Nós não planejamos descontinuar a palavra-chave `private` 
// no TypeScript, então os seus códigos ja existentes vão continuar
// a funcionar, mas agora você pode escrever código de uma forma mais
// proxima da linguagem JavaScript.

// Você pode aprender mais sobre campos de classes na proposta da tc39
// https://github.com/tc39/proposal-class-fields/
// e nas notas de lançamentos beta:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
