// Você pode chegar bem longe usando a inferência do TypeScript,
// porém existem muitas outras maneiras de prover um modo mais
// rico para documentar a forma das suas funções.

// Uma boa primeira opção é observar os parâmetros opcionais,
// que é uma forma de deixar os outros saberem que alguns
// parâmetros podem ser pulados.

let i = 0;
const incrementarIndice = (valor?: number) => {
  i += valor === undefined ? 1 : valor;
};

// Esta função pode ser invocada das seguintes maneiras:

incrementarIndice();
incrementarIndice(0);
incrementarIndice(3);

// Você pode tipar parâmetros como funções, que provêm
// inferência de tipos quando escrever estas funções.

const callbackComIndice = (callback: (i: number) => void) => {
  callback(i);
};

// Embutir interfaces de funções pode dificultar um pouco a leitura
// com todas essas setas. Usar um apelido para o tipo permitirá
// que você nomeie a função passada como parâmetro.

type CallbackComNumero = (i: number) => void;
const callbackComIndice2 = (callback: CallbackComNumero) => {
  callback(i);
};

// Esta função pode ser invocada da seguinte maneira:

callbackComIndice2(indice => {
  console.log(indice);
});

// Se passar o cursor sobre o índice acima, você verá como o TypeScript
// inferiu corretamente que o índice deveria ser um número.

// A inferência do TypeScript também pode funcionar quando passamos uma
// função como uma referência de instância. Para demonstrar, usaremos
// uma função que transforma um número em uma string:

const numeroParaString = (n: number) => {
  return n.toString();
};

// Isso pode ser utilizado em uma função como map em um array
// para converter todos os números em strings. Se passar o cursor
// sobre numerosComoString abaixo, você verá os tipos esperados.
const numerosComoString = [1, 4, 6, 10].map(i => numeroParaString(i));

// Podemos usar uma abreviação para passar a função diretamente
// e termos o mesmo resultado com um código mais focado:
const numerosComoStringConciso = [1, 4, 6, 10].map(numeroParaString);

// Você pode ter funções que aceitam muitos tipos
// mas estar somente interessado em algumas propriedades.
// Esse é um caso útil para assinaturas indexadas em tipos.
// O seguinte tipo declara que nesta função é OK usar qualquer objeto,
// contanto que ele inclua a propriedade nome:

interface QualquerObjetoDeveTerNome {
  nome: string;
  [chave: string]: any;
}

const apresentaNomeFormatado = (entrada: QualquerObjetoDeveTerNome) => {};

apresentaNomeFormatado({ nome: "joey" });
apresentaNomeFormatado({ nome: "joey", age: 23 });

// Se quiser aprender mais sobre assinaturas indexadas
// nós recomendamos:
//
// https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks
// https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

// Você também pode permitir este tipo de comportamento em qualquer lugar
// usando a flag suppressExcessPropertyErrors do arquivo tsconfig -
// porém, você não tem como saber se quem estiver usando sua API
// têm esta configuração desligada.

// Funções em JavaScript podem aceitar diferentes conjuntos de parâmetros.
// Existem dois padrões comuns para descrevê-los: union types (união de tipagens)
// para parâmetros/retorno, e function overloads (sobrecarga de funções).

// Usar union types nos seus parâmetros faz sentido se existirem
// apenas uma ou duas mudanças e a documentação não precisar ser
// modificada entre essas funções.

const FuncaoBoolOuNumber = (input: boolean | number) => {};

FuncaoBoolOuNumber(true);
FuncaoBoolOuNumber(23);

// Function overloads, por outro lado, oferecem uma sintaxe
// bem mais rica para parâmetros e tipos de retorno.

interface FuncaoBoolOuNumberOuString {
  /** Recebe um boolean, retorna um boolean */
  (entrada: boolean): boolean;
  /** Recebe um número, retorna um número */
  (entrada: number): number;
  /** Recebe uma string, retorna um boolean */
  (entrada: string): boolean;
}

// Se esta for a primeira vez que esteja vendo a expressão declare,
// ela permite que você diga ao TypeScript que algo existe, mesmo
// que não esteja presente em runtime neste arquivo. Isso é útil para
// mapear código com side-effects mas extremamente útil para demos, onde
// implementar algo poderia ser bem custoso.

declare const funcaoBoolOuNumberOuString: FuncaoBoolOuNumberOuString;

const valorBool = funcaoBoolOuNumberOuString(true);
const valorNumero = funcaoBoolOuNumberOuString(12);
const valorBool2 = funcaoBoolOuNumberOuString("string");

// Se passar o cursor sobre os valores e funções acima
// você verá a documentação e valores retornados corretos.

// Você pode chegar bem longe usando function overloads, porém
// existe uma outra ferramenta para lidar com diferentes tipos
// de valores de entrada e retorno: tipos genéricos.

// Tipos genéricos provêm uma forma de você ter tipos como variáveis
// substituíveis em definições de tipo.

// example:generic-functions
// example:function-chaining
