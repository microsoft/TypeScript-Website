//// { compiler: {  noImplicitAny: false }, order: 2 }

// Na versão 3.7 do TypeScript há existência de 'dedução por uso'
// deixando o codigo mais inteligênte, Você agora poderá usar
// uma lita de importantes tipos conhecidos (string, number, array, Promise)
// e deduzer se o uso do tipo combina com a API de objetos.

// Para o próximos pequenos exmplos, selecione o parâmetro das
// funções, clique na lâmpada e selecione "Deduzier os tipos de Parâmetros..."

// Deduzir um array de números

function pushNumber(arr) {
  arr.push(12);
}

// Deduzir uma Promise

function awaitPromise(promise) {
  promise.then(value => console.log(value));
}

// Deduzir uma função, e o que ela retornará:

function inferAny(app) {
  const result = app.use("hi");
  return result;
}

// Deduzir um array de strings porquê uma
// string foi adicionada:

function insertString(names) {
  names[1] = "hello";
}
