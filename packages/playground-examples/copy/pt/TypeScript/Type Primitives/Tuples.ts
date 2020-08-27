// Normalmente um array contém de zero à muitos objetos de
// um mesmo tipo. O TypeScript possui uma análise especial
// sobre arrays que contêm múltiplos tipos, e quando a ordem 
// em que eles estão indexados é importante.

// Esses são chamados de tuplas. Pense nelas como uma forma para
// conectar dados, mas com menos sintaxe que os objetos.

// Você pode criar uma tupla usando a sintaxe de um array do JavaScript:

const ResponseFalha = ["Não Encontrado", 404];

// mas você precisa declarar o seu tipo como uma tupla.

const ResponseExitosa: [string, number] = ["{}", 200];

// Se você passar o mouse sobre o nome das duas variáveis
// você pode ver a diferença entre um array ( (string | number)[] )
// e uma tupla ( [string, number] ).

// Em um array a ordem não é importante, então um item em
// qualquer posição poderia ser tanto uma string quanto um
// número. Em uma tupla, a ordem e o comprimento são garantidos.

if (ResponseExitosa[1] === 200) {
  const InformacaoLocal = JSON.parse(ResponseExitosa[0]);
  console.log(InformacaoLocal);
}

// Isso significa que o TypeScript irá prover a tipagem
// correta na posição certa, e até lançar um erro se você
// tentar acessar um objeto em uma posição não declarada.

ResponseExitosa[2];

// Uma tupla pode ser um bom padrão para pequenos pedaços
// de dados conectados ou para fixtures.

type ContaDeFuncionario = [number, string, string, string?];

const funcionarios: ContaDeFuncionario[] = [
  [0, "Adankwo", "adankwo.e@"],
  [1, "Kanokwan", "kanokwan.s@"],
  [2, "Aneurin", "aneurin.s@", "Supervisor"],
];

// Quando você tem um conjunto de tipos conhecidos no começo
// de uma tupla e então várias posições com tipos desconhecidos,
// você pode usar o spread operator para indicar que ela pode
// ter qualquer comprimento e as posições adicionais serão de algum
// tipo específico.

type ComprovantesDePagamento = [ContaDeFuncionario, ...number[]];

const comprovantesDePagamento: ComprovantesDePagamento[] = [
  [funcionarios[0], 250],
  [funcionarios[1], 250, 260],
  [funcionarios[0], 300, 300, 300],
];

const pagamentosDoMesUm = comprovantesDePagamento[0][1] + comprovantesDePagamento[1][1] + comprovantesDePagamento[2][1];
const pagamentosDoMesDois = comprovantesDePagamento[1][2] + comprovantesDePagamento[2][2];
const pagamentosDoMesTres = comprovantesDePagamento[2][2];

// Você pode usar tuplas para descrever funções
// que recebem uma quantidade indefinida de parâmetros tipados:

declare function calcularPagamentoParaEmpregado(id: number, ...args: [...number[]]): number;

calcularPagamentoParaEmpregado(funcionarios[0][0], comprovantesDePagamento[0][1]);
calcularPagamentoParaEmpregado(funcionarios[1][0], comprovantesDePagamento[1][1], comprovantesDePagamento[1][2]);

//
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#tuples-in-rest-parameters-and-spread-expressions
// https://auth0.com/blog/typescript-3-exploring-tuples-the-unknown-type/
