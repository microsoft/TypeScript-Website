// O JavaScript é uma linguagem que possui algumas maneiras de
// declarar que alguns de seus objetos não mudam.
// O mais proeminente é const - que diz que o valor não mudará.

const olaMundo = "Olá Mundo";

// Você não pode mudar olaMundo agora, o TypeScript
// te dará um erro, porque você teria um erro em
// tempo de execução.

olaMundo = "Oi mundo";

// Por que se importar com imutabilidade? Muito disso
// é sobre reduzir a complexidade no seu código.
// Se você pode reduzir o número de coisas que podem mudar,
// então existem menos coisas para se manter o controle.

// Usar const é um bom começo, de qualquer maneira isso
// falha um pouco quando usamos objetos.

const meuObjetoConstate = {
  mensagem: "Olá Mundo",
};

// meuObjetoConstante não é constante o suficiente,
// porque nós ainda podemos fazer mudanças de partes do objeto,
// por exemplo, podemos mudar a mensagem:

meuObjetoConstate.mensagem = "Oi Mundo";

// const significa que o valor naquele ponto se mantém o mesmo,
// mas o objeto em si pode mudar internamente. Isso pode ser
// mudado utilizando o Object.freeze.

const meuObjetoDefinitivamenteConstante = Object.freeze({
  mensagem: "Olá Mundo",
});

// Quando um objeto é congelado, você não pode mudá-lo
// internamente. O TypeScript te dará erros nesses casos:

meuObjetoDefinitivamenteConstante.mensagem = "Oi mundo";

// Funciona igualmente com arrays:

const meuArrayCongelado = Object.freeze(["Oi"]);
meuArrayCongelado.push("Mundo");

// Usar o freeze significa que você pode confiar que o
// objeto se permanece o mesmo por baixo dos panos.

// O TypeScript tem alguns ganchos de sintaxe para melhorar o
// trabalho com dados imutáveis que pode ser encontrado
// na seção de exemplos do TypeScript:
//
// example:literals
// example:type-widening-and-narrowing
