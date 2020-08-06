//// { compiler: {  }, order: 1 }

// No novo 3.7 a capacidade de converter rapidamente
// uma variável const para uma let quando o valor
// for redesignado.

// Você pode tentar isso destacando o erro abaixo
// e optando por executar a correção rápida.

const displayName = "Andrew";

displayName = "Andrea";
