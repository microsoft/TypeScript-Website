//// { compiler: {  }, order: 1 }

// No 3.7, há a nova capacidade de converter rapidamente
// uma variável const para uma let quando o valor
// for reatribuído.

// Você pode tentar isso destacando o erro abaixo
// e optando por executar a correção rápida.

const displayName = "Andrew";

displayName = "Andrea";
