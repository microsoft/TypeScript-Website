//// { compiler: { ts: "4.0.0-beta" } }

// Esse é o novo operadorador `??` a qual se refere a aumentar
// o comum uso de `||` do mesmo modo que `===` argumenta `==`
// como uma forma mais rigorisa de igualdade.
//
// Para entender, vamos ver como o || funciona:

const resposta = {
  valorNulo: null,
  textoDeCabecalho: "",
  duracaoDaAnimacao: 0,
  altura: 400,
  mostrarTelaInicial: false,
} as const;

const valorIndefinido = resposta.valorIndefinido || "algum outro padrão";
// Esse poderia ser: 'algum outro padrão'

const valorNulo = resposta.valorNulo || "algum outro padrão";

// Esses dois exemplos trabalham de forma similar na maioria das linguages.
// Como uma ferramenta, || é ótima em difundir as coisas, mas o JavaScript
// falsamente confere, podendo te surpreender pelos valores padrões.

// Potencialmente não intencional. '' é falsamente, o resultado é: 'Olá mundo!'
const textoDeCabecalho = resposta.textoDeCabecalho || "Olá mundo!";

// Potencialmente não intencional. 0 é falsamente, o resultado é: 300
const duracaoDaAnimacao = resposta.duracaoDaAnimacao || 300;

// Potencialmente não intencional. false é falsamente, o resultado é: true
const mostrarTelaInicial = resposta.mostrarTelaInicial || true;

// Quando começamos a usar ??, então === é igualmente usado
// para comparar os dois lados:

const textoDeCabecalhoVazio = resposta.textoDeCabecalho ?? "Olá mundo!";
const animacaoSemDuracao = resposta.duracaoDaAnimacao ?? 300;
const pularTelaInicial = resposta.mostrarTelaInicial ?? true;
