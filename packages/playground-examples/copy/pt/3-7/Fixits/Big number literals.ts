//// { compiler: {  target: 99 }, order: 1 }

// Você sabia que existe um limite para o maior
// número que você pode representar enquanto
// você está escrevendo em Javascript?

const valorMaximo = 9007199254740991;
const valorMinimo = -9007199254740991;

// Se você ultrapassar um ou mais desses números
// então você entrará em um território perigoso

const umAcimaDoMaximo = 9007199254740992;
const umAbaixoDoMinimo = -9007199254740992;

// A solução para lidar com números desse tamanho
// é converter esses números em BigInts ao invés
// de um número:
//
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScript fornecerá agora uma solução para os números
// literais que estão acima de 2 ^ 52 (positivo / negativo)
// adicionando o sufixo "n" que informa ao javascript
// que esse número deverá ser BigInt.

// Números literiais
9007199254740993;
-9007199254740993;
9007199254740994;
-9007199254740994;

// Números Hexadecimais
0x19999999999999;
-0x19999999999999;
0x20000000000000;
-0x20000000000000;
0x20000000000001;
-0x20000000000001;
