// Típicamente un arreglo contiene de cero a muchos objetos
// de un solo tipo. TypeScript tiene un análisis especial en
// torno a los arreglos que contengan múltiples tipos, y
// donde es importante el orden en que se indexan.

// Estos se llaman tuplas (en inglés **tuples**). Piensa en
// ellas como una forma de conectar algunos datos pero con
// menos sintaxis que un objeto ordenado por llaves.

// Puedes crear una tupla utilizando la sintaxis de arreglos
// en JavaScript:

const failingResponse = ["Not Found", 404];

// pero necesitarás declarar su tipo como una tupla.

const passingResponse: [string, number] = ["{}", 200];

// Al pasar el cursor sobre los nombres de ambas variables
// puedes ver la diferencia entre la variable de tipo arreglo
// ( (string | number)[] ) y la tupla ( [string, number] ).

// En un arreglo, el orden no es importante por lo que un
// elemento en cualquier indice puede ser una cadena de
// texto o un número. En la tupla, el orden y la longitud
// son garantizados.

if (passingResponse[1] === 200) {
  const localInfo = JSON.parse(passingResponse[0]);
  console.log(localInfo);
}

// Esto significa que TypeScript proporcionará el tipo
// correcto en el índice adecuado e incluso generará un
// error si intenta acceder a un objeto en un índice no
// declarado.

passingResponse[2];

// Una tupla puede lucir como un buen patrón para pedazos
// cortos de datos entrelazados o como base de otras tareas.

type StaffAccount = [number, string, string, string?];

const staff: StaffAccount[] = [
  [0, "Adankwo", "adankwo.e@"],
  [1, "Kanokwan", "kanokwan.s@"],
  [2, "Aneurin", "aneurin.s@", "Supervisor"],
];

// Cuando se tiene un conjunto conocido de tipos en el
// comienzo de la tupla y luego un tamaño desconocido, se
// puede hacer uso del operador de propagación para indicar
// que este puede tener cualquier longitud y los indices
// extras serán de un tipo de dato en particular:

type PayStubs = [StaffAccount, ...number[]];

const payStubs: PayStubs[] = [
  [staff[0], 250],
  [staff[1], 250, 260],
  [staff[0], 300, 300, 300],
];

const monthOnePayments = payStubs[0][1] + payStubs[1][1] + payStubs[2][1];
const monthTwoPayments = payStubs[1][2] + payStubs[2][2];
const monthThreePayments = payStubs[2][2];

// Puedes utilizar tuplas para describir funciones las
// cuales toman un número indefinido de parámetros con un
// tipo determinado:

declare function calculatePayForEmployee(id: number, ...args: [...number[]]): number;

calculatePayForEmployee(staff[0][0], payStubs[0][1]);
calculatePayForEmployee(staff[1][0], payStubs[1][1], payStubs[1][2]);

//
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#tuples-in-rest-parameters-and-spread-expressions
// https://auth0.com/blog/typescript-3-exploring-tuples-the-unknown-type/
