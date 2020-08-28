// Unknown

// Unknown é um daqueles tipos que, assim que você entende,
// acha muitos casos de uso. Ele age como um irmão para o tipo any.
// any permite ambiguidade - unknown requer especificidades.

// Um bom exemplo poderia envolver um JSON parser. Dados JSON podem vir
// de diferentes formas e o criador da função que analisa o JSON não
// saberá a forma do dado - a pessoa chamando a função deve.

const transformadorJson = (stringJson: string) => JSON.parse(stringJson);

const minhaConta = transformadorJson(`{ "nome": "Dorothea" }`);

minhaConta.nome;
minhaConta.email;

// Se você passar o mouse em transformadorJson, poderá ver que ele tem
// o tipo de retorno any, assim como o minhaConta. É possível ajustar isso
// com tipos Genéricos - mas também é possível ajustar isso com o unkown.

const transformadorJsonUnkown = (stringJson: string): unknown => JSON.parse(stringJson);

const minhaOutraConta = transformadorJsonUnkown(`{ "nome": "Samuel" }`);

minhaOutraConta.nome;

// O objeto minhaOutraConta não pode ser usado até o tipo ser declarado
// para o TypeScript. Isso pode ser usado para garantir que
// quem consumir a API pense em sua tipagem com antecedência:

type Usuario = { nome: string };
const minhaContaDeUsuario = transformadorJsonUnkown(`{ "nome": "Samuel" }`) as Usuario;
minhaContaDeUsuario.nome;

// Unknown é uma boa ferramenta, para entendê-lo ainda mais leia:
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never

// Como o Typescript suporta análise de fluxo do código, a linguagem
// precisa ser capaz de representar quando lógicamente o código não pode
// acontecer. Por exemplo, essa função não pode retornar:

const nuncaRetorna = () => {
  // Se for lançado um erro na primeira linha
  throw new Error("Sempre lança um erro, nunca retorna");
};

// Se você passar o mouse em cima da função, verá () => never
// que significa que isso nunca deverá acontecer. Estes ainda
// podem ser passados como outros valores:

const meuValor = nuncaRetorna();

// Tendo uma função que retorna never pode ser útil quando lidamos com
// a imprevisiblidade do runtime JavaScript e os
// consumidores da API que podem não estar usando tipos:

const validarUsuario = (usuario: Usuario) => {
  if (usuario) {
    return usuario.nome !== "NaN";
  }

  // De acordo com o sistema de tipos, esse caminho do código
  // nunca deveria acontecer, que combina com o tipo de
  // retorno do nuncaRetorna.

  return nuncaRetorna();
};

// O estado da definição de tipos indica que um usuário deve ser
// passado, mas existem muitas válvulas de escape no JavaScript
// por meio das quais você não pode garantir isso.

// Usar uma função que retorna never te permite adicionar
// código em partes que não deveriam ser possíveis.
// Isso é útil para mostrar uma mensagem de erro melhor,
// ou fechar recursos como arquivos ou loops.

// Um tipo de uso bem popular para o never é garantir que um
// switch é exaustivo. Por exemplo, todos os caminhos são cobertos.

// Aqui tem um enum e um switch exaustivo, tente adicionar
// uma nova opção para o enum (talvez Tulipa?)

enum Flor {
  Rosa,
  Rododendro,
  Violeta,
  Margarida,
}

const nomeDaFlorEmLatim = (flor: Flor) => {
  switch (flor) {
    case Flor.Rosa:
      return "Rosa rubiginosa";
    case Flor.Rododendro:
      return "Rhododendron ferrugineum";
    case Flor.Violeta:
      return "Viola reichenbachiana";
    case Flor.Margarida:
      return "Bellis perennis";

    default:
      const _checagemExaustiva: never = flor;
      return _checagemExaustiva;
  }
};

// Você vai ter um erro de compilação falando que seu
// novo tipo de flor não pode ser convertido em never.

// Never em Unions

// O never é removido automaticamente do tipo union.

type NeverERemovido = string | never | number;

// Se você olhar no tipo para NeverERemovido, verá que
// é string | number. Isso é porque never nunca deve acontecer em
// tempo de execução, já que você não pode atribuir a ele.

// Esse recurso é muito utilizado em example:conditional-types
