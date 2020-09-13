// União de tipos (type unions) é uma forma de declarar que um objeto
// pode ser mais de um tipo.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// Se o uso de "open" e "closed" vs string é
// novo para você, verifique: example:literals

// Podemos misturar diferentes tipos em um union, dizendo que o valor é 
// de um destes tipos.

// TypeScript irá então deixar para você o trabalho de 
// determinar qual valor deve ser em tempo de execução.

// Unions podem ser prejudicados pelo 'type-widening', 
// por exemplo:

type WindowStates = "open" | "closed" | "minimized" | string;

// Se você passar o mouse por cima, você poderá ver que o WindowStates
// se transforma em uma string - não em um union. Isto é explicado em
// example:type-widening-and-narrowing

// Se um union é um 'OU', então um intersection é um 'E'.
// Interseção de tipos (type intersection) consiste de dois tipos que
// se cruzam para criar um novo tipo. Ele permite a composição de tipos.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// Essas interfaces podem ser compostas em respostas que possuem
// ambos manipulação de erros e dados.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// Por exemplo:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// Uma mistura dos tipos Intersection e Union se torna realmente
// útil quando você tem um caso em que um objeto precisa 
// incluir um de dois valores:

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = (CreateArtistBioBase & { html: string }) | { markdown: string };

// Agora você pode apenas criar uma requisição quando você incluir
// artistsID e html ou markdown.

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy é um artista anonimo de grafite que mora na Inglaterra",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};
