// Uma união de tipos discriminados é quando você usa análise
// de fluxo de código para reduzir um conjunto de objetos
// para um objeto específico.

// Esse padrão funciona muito bem para conjuntos de objetos
// semelhantes com propriedades em comum, por exemplo: uma
// lista de eventos nomeados, ou um conjunto de objetos
// versionados.

type EventoCronometrado = { nome: "inicio"; usuarioIniciou: boolean } | { nome: "encerrado"; duracao: number };

// Quando o evento chega na função abaixo, ele pode ser
// qualquer um dos dois tipos possíveis.

const tratarEvento = (evento: EventoCronometrado) => {
  // Usando um switch com evento.nome, a análise de fluxo de
  // código do TypeScript consegue determinar que um objeto
  // pode ser representado somente por um tipo da união.

  switch (evento.nome) {
    case "inicio":
      // Isso significa que você pode acessar usuarioIniciou
      // com segurança, porque esse é o único tipo dentro de
      // EventoCronometrado onde nome é "inicio".
      const usuarioIniciou = evento.usuarioIniciou;
      break;

    case "encerrado":
      const intervaloDeTempo = evento.duracao;
      break;
  }
};

// Também podemos usar números como o discriminador, seguindo
// o mesmo padrão.

// Nesse exemplo, temos uma união discriminada e um estado
// de erro adicional para tratar.

type RespostasAPI = { versao: 0; mensagem: string } | { versao: 1; mensagem: string; status: number } | { erro: string };

const tratarResposta = (resposta: RespostasAPI) => {
  // Tratar o caso de erro, e então retornar.
  if ("erro" in resposta) {
    console.error(resposta.erro);
    return;
  }

  // O TypeScript agora sabe que respostas não pode ser do
  // tipo erro. Caso fosse, a função teria retornado. Você
  // pode verificar isso passando o mouse sobre resposta no
  // trecho abaixo.

  if (resposta.versao === 0) {
    console.log(resposta.mensagem);
  } else if (resposta.versao === 1) {
    console.log(resposta.status, resposta.mensagem);
  }
};

// É recomendado utilizar um bloco switch no lugar de um
// bloco if porque assim você pode garantir que todas as
// partes da união são checadas. Existe um bom padrão para
// isso usando o tipo never no manual (em inglês):
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
