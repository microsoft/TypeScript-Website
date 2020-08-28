//// { compiler: {  noImplicitAny: false }, order: 2 }

// Na versão 3.7 do TypeScript a correção 'dedução por uso'
// ficou mais inteligente. Ela agora poderá usar uma lista conhecida
// de tipos importantes (string, number, array, Promise)
// e deduzir se o uso do tipo combina com a API destes objetos.

// Para o próximos pequenos exemplos, selecione o parâmetro das
// funções, clique na lâmpada e selecione _Infer parameter types from usage_ (Deduzir os tipos de parâmetros pelo uso)

// Deduzir um array de números

function pushNumber(arr) {
  arr.push(12);
}

// Deduzir uma Promise

function awaitPromise(promise) {
  promise.then(valor => console.log(valor));
}

// Deduzir uma função, e o que ela retornará:

function inferAny(app) {
  const result = app.use("oi");
  return result;
}

// Deduzir um array de strings porquê uma
// string foi adicionada:

function insertString(nomes) {
  nomes[1] = "olá";
}
