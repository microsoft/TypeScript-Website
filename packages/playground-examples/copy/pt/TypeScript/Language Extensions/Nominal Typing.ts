// Um sistema de tipos nominal significa que cada tipo é
// único e, mesmo se os tipos possuam os mesmos dados, eles
// não podem ser atribuídos entre tipos.

// O sistema de tipos do TypeScript é estrutural, o que
// significa que se um tipo tem a forma de um pato, ele é
// um pato. Se um ganso tem todos os atributos de um pato,
// então ele também é um pato. Você pode aprender mais em:
// example:structural-typing

// Isso pode trazer desvantagens, por exemplo, existem casos
// em que uma string ou número podem ter um contexto especial
// e você não quer que esses valores sejam transferíveis.
// Por exemplo:

// - Strings com entradas de usuários (inseguro)
// - Strings de tradução
// - Números de identificação de usuário
// - Tokens de acesso

// É possível implementar a maior parte das funções de um 
// sistema de tipos nominal com um pouco de código adicional.

// Utilizando um tipo de interseção, com uma restrição na
// forma de uma propriedade chamada __brand (isso é uma
// convenção), tornamos impossível atribuir uma string comum
// a um tipo StringDeEntradaValidada.

type StringDeEntradaValidada = string & { __brand: "Entrada de Usuário Após Validação" };

// Agora utilizaremos uma função para transformar uma string
// em uma StringDeEntradaValidada - mas algo a se notar é que
// nós estamos apenas dizendo ao TypeScript que isso é verdade.

const validarEntradaDeUsuario = (entrada: string) => {
  const validacaoSimplesDeEntrada = entrada.replace(/\</g, "≤");
  return validacaoSimplesDeEntrada as StringDeEntradaValidada;
};

// Assim, podemos criar funções que aceitam somente o nosso
// novo tipo nominal, e não o tipo string mais genérico.

const imprimirNome = (nome: StringDeEntradaValidada) => {
  console.log(nome);
};

// Por exemplo, aqui temos uma entrada insegura de um usuário
// que, após passar pelo validador, é impressa sem problemas:

const entrada = "\n<script>alert('bobby tables')</script>";
const validatedInput = validarEntradaDeUsuario(entrada);
imprimirNome(validatedInput);

// Por outro lado, passar uma string não-validada para a função
// imprimirNome causará um erro no compilador:

imprimirNome(entrada);

// Você pode consultar uma visão geral das diferentes maneiras
// de criar tipos nominais, com suas vantagens e desvantagens,
// nesse issue do GitHub (em inglês):

// https://github.com/Microsoft/TypeScript/issues/202

// Também pode acessar um ótimo sumário neste post (em inglês):
// https://michalzalecki.com/nominal-typing-in-typescript/
