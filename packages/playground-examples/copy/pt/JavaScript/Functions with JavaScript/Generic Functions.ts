// Tipos genéricos permitem usar Tipos como variáveis em outros tipos.
// Meta

// Tentaremos manter este exemplo leve. Você pode fazer
// muita coisa com tipos genéricos e é provável que veja algum código bem
// complicado usando tipos genéricos em algum ponto - mas isso
// não significa que tipos genéricos são complicados.

// Vamos começar com um exemplo onde envolveremos um objeto de entrada
// em um array. Só vamos nos importar com uma variável neste caso:
// o tipo que foi passado como argumento:

function envolverEmArray<Tipo>(entrada: Tipo): Tipo[] {
  return [entrada];
}

// Nota: é comum ver Tipo ser referido como T. Isso é
// culturalmente similar a como as pessoas usam i em um loop for
// para representar índice. T normalmente representa Tipo (Type), então
// usaremos o nome completo para maior clareza

// Nossa função usará inferência para sempre manter o tipo
// passado como argumento igual ao tipo retornado (porém
// envolvido em um array)

const stringArray = envolverEmArray("hello generics");
const numberArray = envolverEmArray(123);

// Podemos verificar que isso funciona como esperado ao checar
// se podemos atribuir um array de strings a uma função que
// deveria ser um array de objetos
const naoArrayDeStrings: string[] = envolverEmArray({});

// Você também pode evitar a inferência adicionando
// o tipo você mesmo:
const arrayDeStrings2 = envolverEmArray<string>("");

// envolverEmArray permite que qualquer tipo seja usado, porém existem
// casos onde você precisa permitir apenas um subconjunto de tipos.
// Nesses casos você pode dizer que o tipo deve estender um
// tipo específico.

interface Desenhavel {
  desenhar: () => void;
}

// Esta função recebe um conjunto de objetos que possuem uma função
// para desenhar na tela
function renderizarNaTela<Tipo extends Desenhavel>(entrada: Tipo[]) {
  entrada.forEach(i => i.desenhar());
}

const objetosComDesenhar = [{ desenhar: () => {} }, { desenhar: () => {} }];
renderizarNaTela(objetosComDesenhar);

// Isso falhará se desenhar não estiver presente:

renderizarNaTela([{}, { desenhar: () => {} }]);

// Tipos genéricos podem começar a parecer complicados quando você tem
// múltiplas variáveis. Aqui está um exemplo de uma função de caching
// que permite que você tenha diferentes conjuntos de tipos de entrada
// e caches.

interface HostDeCache {
  salvar: (a: any) => void;
}

function adicionarObjetoAoCache<Tipo, Cache extends HostDeCache>(obj: Tipo, cache: Cache): Cache {
  cache.salvar(obj);
  return cache;
}

// Este é o mesmo exemplo que acima, porém com um parâmetro extra.
// Nota: para fazê-lo funcionar, porém, tivemos que usar any. Isso
// pode ser resolvido usando uma interface genérica

interface HostDeCacheGenerico<TipoDeConteudo> {
  salvar: (a: TipoDeConteudo) => void;
}

// Agora quando o HostDeCacheGenerico é usado, você deve dizer
// a dele qual é o TipoDeConteudo

function adicionarObjetoTipadoAoCache<Tipo, Cache extends HostDeCacheGenerico<Tipo>>(obj: Tipo, cache: Cache): Cache {
  cache.salvar(obj);
  return cache;
}

// O exemplo acima é bem intenso em termos de sintaxe. Porém,
// isso provê uma segurança maior. Essas são escolhas que
// agora você tem conhecimento para fazer. Quando for prover APIs
// a outras pessoas, tipos genéricos oferecem um jeito flexível de permitir
// que elas usem seus próprios tipos sem ter que inferir seu código por completo.

// Para mais exemplos de tipos genéricos com classes e interfaces:
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
