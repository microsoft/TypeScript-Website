//// { order: 1, compiler: { strict: false } }

//Objetos em JavaScript são coleções de valores agrupados
//com chaves nomeadas.

const userAccount = {
  name: "Kieron",
  id: 0,
};

//Você pode combiná-las para tornar os modelos de dados maiores
//e mais complexos. 

const pie = {
  type: "Apple",
};

const purchaseOrder = {
  owner: userAccount,
  item: pie,
};

//Se você passar o mouse sobre algumas dessas palavras
//(tente purchaseOrder acima) você poderá ver como o
//TypeScript interpreta o JavaScript com rótulos de tipagem.

//Os valores podem ser acessados por meio de ".", para
//obter um nome de usuário para um pedido de compra.
console.log(purchaseOrder.item.type);

//Se você passar o mouse por cima de cada parte do código
//entre os ()s, você poderá ver o TypeScript oferecendo mais
//informações sobre cada parte. Tente reescrever isso baixo:

//Copie isso na próxima linha, caractere por caractere:
//
//   purchaseOrder.item.type

//TypeScript fornece feedback para o playground
//sobre quais objetos do JavaScript estão disponíveis neste
//arquivo e permite você evitar erros de digitação e ver 
//informações adicionais sem precisar procurar em outro local

//TypeScript também oferece esses mesmos recursos para arrays.
//Aqui temos um array com apenas nossos pedidos de compra acima.

const allOrders = [purchaseOrder];

//Se você passar o mouse por cima de allOrders, você poderá
//afirmar que é um array, porque as informações passadas pelo
//cursor terminam com um []. Você pode acessar o primeiro pedido
//usando colchetes com um índice (começando do zero).

const firstOrder = allOrders[0];
console.log(firstOrder.item.type);

//Uma maneira alternativa para obter um objeto é por meio do
//uso do método pop() no array para remover objetos. Fazer
//isso remove o objeto do array e retorna o objeto.
//Isso é chamado de mutação do array, pois alteara os dados
//subjacentes de seu interior.

const poppedFirstOrder = allOrders.pop();

//Agora 'allOrders' está vazio. Dados mutantes podem ser úteis para
//muitas coisas, mas uma forma de reduzir a complexidade em seu
//código-base é evitar a mutação. Para isso, o TypeScript oferece
//uma forma de declarar um array para somente leitura:

//Cria uma tipagem baseada no formato de 'purchaseOrder':
type PurchaseOrder = typeof purchaseOrder;

//Cria um array de readonly (somente-leitura) de pedidos de compra
const readonlyOrders: readonly PurchaseOrder[] = [purchaseOrder];

//Sim! Há um pouco mais de código, com certeza. Existem quatro
//coisas novas aqui:
//
//  type PurchaseOrder - Declara uma nova tipagem para o TypeScript.
//
//  typeof - Usa o sistema de dedução de tipos para definir a tipagem
//           baseada na 'const' que é passada em seguida.
//
//  purchaseOrder - Obtem a variável purchaseOrder e informa ao 
//                  TypeScript que este é o formato de todos
//                  os objetos no array de pedidos.
//
//  readonly - Este objeto não permite mutação, uma vez criado,
//             o conteúdo do array sempre permanecerá o mesmo.
//
//
//Agora, se você tentar utilizar o método pop() do array readonlyOrders,
//o TypeScript gerará um erro.

readonlyOrders.pop();

//Você pode usar o readonly em todos os tipos 
//de lugares. É um pouco de sintaxe extra aqui e ali, 
//mas fornece muito mais segurança.

//Você pode encontrar mais sobre o readonly aqui:
//  - https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties
//  - https://basarat.gitbooks.io/typescript/content/docs/types/readonly.html

//E você pode continuar aprendendo sobre JavaScript e TypeScript
//no exemplo de funções:
// example:functions
//
// Ou se desejar saber mais sobre imutabilidade:
// example:immutability
