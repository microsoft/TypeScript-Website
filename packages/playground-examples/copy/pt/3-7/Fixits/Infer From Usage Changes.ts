//// { compiler: {  noImplicitAny: false }, order: 2 }

// Com a 3.7 a correção do código tornou-se mais inteligente 
// com a existência da 'inferência do uso'. Agora é utilizado uma lista
// dos tipos importantes conhecidos (string, number, array, Promise)
// e inferido se houver o uso de um tipo corresponde à API desses objetos.

// Para os próximos exemplos, selecione os parâmetros
// para as funções, clique na lâmpada e escolha 
// "Inferir os tipos de parâmetros..."

// Inferir uma lista de números:

function acrescentarNumero(lista) {
  lista.push(12);
}

// Inferir uma promise:

function aguardarPromise(promise) {
  promise.then((value) => console.log(value));
}

// Inferir a função e seu tipo de retorno:

function inferirQualquer(app) {
  const resultado = app.use("hi");
  return resultado;
}

// Inferir uma lista de textos, porque 
// um texto foi adicionado a ela:

function inserirTexto(nomes) {
  nomes[1] = "hello";
}
