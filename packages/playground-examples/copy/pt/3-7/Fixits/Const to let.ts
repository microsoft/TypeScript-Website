//// { compiler: {  }, order: 1 }

// No 3.7, há a nova capacidade de converter rapidamente
// uma variável const para uma let quando o valor
// for reatribuído.

// Você pode experimentar isso destacando o erro abaixo
// e optando por executar o _Quick Fix_ (Correção rápida).

const nomeDeExibicao = "Andrew";

nomeDeExibicao = "Andrea";
