// Tipos mapeados são uma maneira de criar tipos baseados
// em outros tipos. É praticamente um tipo transformacional.

// Um caso comum para se usar um tipo mapeado é quando
// lidamos com subconjuntos opcionais. Por exemplo, uma
// API pode retornar um Artista:

interface Artista {
  id: number;
  nome: string;
  bio: string;
}

// No entanto, caso fosse necessário enviar para a API uma
// atualização que alterasse apenas uma parte de Artista, 
// normalmente seria necessário criar uma interface adicional:

interface ArtistParaEdicao {
  id: number;
  nome?: string;
  bio?: string;
}

// É provável que ela acabe defasada da interface Artista
// acima. Tipos mapeados resolvem esse problema, permitindo
// que seja criado um novo tipo que altera um tipo existente.

type MeuTipoParcial<Tipo> = {
  // Para cada propriedade existente em Tipo, converta
  // ela em uma propriedade opcional (?).
  [Propriedade in keyof Tipo]?: Tipo[Propriedade];
};

// Agora podemos usar o tipo mapeado para criar nosso tipo
// para edição:
type ArtistaMapeadoParaEdicao = MeuTipoParcial<Artista>;

// Já está quase perfeito, porém esse tipo permite que o id
// seja nulo, o que nunca deve acontecer. Então, vamos fazer
// uma pequena melhoria usando um tipo de interseção (veja:
// example:union-and-intersection-types).

type MeuTipoParcialParaEdicao<Tipo> = {
  [Propriedade in keyof Tipo]?: Tipo[Propriedade];
} & { id: number };

// Isso faz com que o tipo mapeado parcial seja combinado
// com um objeto que tem o id obrigatório, efetivamente
// forçando o id a estar definido no tipo.

type ArtistaMapeadoCorretamenteParaEdicao = MeuTipoParcialParaEdicao<Artista>;

// Esse é um exemplo bastante simples de como tipos mapeados
// funcionam, mas cobre os conceitos mais básicos. Se você
// quiser se aprofundar, veja o manual (em inglês):
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
