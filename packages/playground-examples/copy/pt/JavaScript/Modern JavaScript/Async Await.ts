//// { order: 1, target: "es5" }

// O JavaScript moderno adicionou um modo de lidar com callbacks
// de uma maneira elegante adicionando uma API baseada em Promises
// a qual tem uma sintaxe especial que te permite tratar
// código assíncrono como se fosse síncrono.

// Assim como todos os recursos da linguagem, isso é uma troca em
// complexidade: fazer uma função assíncrona significa que o valor de
// retorno está envolvido em Promises. O que costumava retornar uma
// string, agora retorn uma Promise<string>.

const funcao = () => ":onda:";
const funcaoAsync = async () => ":onda:";

const minhaString = funcao();
const minhaPromiseString = funcaoAsync();

minhaString.length;

// minhaPromiseString é uma Promise, não uma string:

minhaPromiseString.length;

// Você pode usar a palavra chave await para converter uma promise
// ao seu valor. Atualmente, isso funciona apenas dentro de uma
// função assíncrona.

const minhaFuncao = async () => {
  const minhaString = funcao();
  const minhaPromiseResolvidaEmString = await funcaoAsync();

  // Com a palavra chave await, agora minha minhaPromiseResolvidaEmString
  // é uma string
  minhaString.length;
  minhaPromiseResolvidaEmString.length;
};

// Códigos rodando em await podem lançar erros,
// e é importante pegar esses erros em algum lugar.

const minhaFuncaoLancando = async () => {
  throw new Error("Não chame isso");
};

// Podemos envolver a chamada de uma função assíncrona em um try catch
// para lidar com casos onde a função age inexperadamente.

const funcaoAssincronaPegando = async () => {
  const meuValorDeRetorno = "Olá mundo";
  try {
    await minhaFuncaoLancando();
  } catch (erro) {
    console.error("minhaFuncaoLancando falhou", erro);
  }
  return meuValorDeRetorno;
};

// Devido à ergonomia dessa API estar retornando um
// único valor, ou lançando, você deve considerar
// oferecer informação sobre o resultado dentro do valor
// retornado e usar o throw apenas quando algo
// realmente excepcional ocorreu.

const funcaoExemploRaizQuadrada = async (input: any) => {
  if (isNaN(input)) {
    throw new Error("Apenas números são aceitos");
  }

  if (input < 0) {
    return { sucesso: false, mensagem: "Não existe raiz quadrada de número negativo" };
  } else {
    return { sucesso: true, valor: Math.sqrt(input) };
  }
};

// Então a função consumidora pode checar a resposta e
// descobrir o que fazer com o valor retornado. Por enquanto
// este é um exemplo trivial, assim que você começar a trabalhar
// com códigos de rede, essa sintaxe extra valerá a pena.

const checarRaizQuadrada = async (valor: number) => {
  const resposta = await funcaoExemploRaizQuadrada(valor);
  if (resposta.sucesso) {
    resposta.valor;
  }
};

// Async/Await pega um código parecido com esse:

// pegarResposta(url, resposta => {
//   pegarResposta(resposta.url, (segundaResposta) => {
//     const dadosDaResposta = segundaResposta.data
//     pegarResposta(dadosDaResposta.url, (terceiraResposta) => {
//       ...
//     })
//   })
// })

// E deixa se tornar linear como:

// const resposta = await pegarResposta(url)
// const segundaResposta = await pegarResposta(reposta.url)
// const dadosDaResposta = segundaResposta.data
// const terceiraResposta = await pegarResposta(dadosDaResposta.url)
// ...

// O qual pode fazer o código ficar mais perto do canto esquerdo
// e ser lido com um ritmo consistente.
