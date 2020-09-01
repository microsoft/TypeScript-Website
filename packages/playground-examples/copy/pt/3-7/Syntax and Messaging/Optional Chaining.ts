//// { compiler: {  }, order: 1 }

// O encadeamento opcional alcançou o consenso de estágio 3 no TC39
// durante o desenvolvimento da versão 3.7. Encadeamento opcional
// permite você escrever um código que pode interromper imediatamente
// a execução de expressões quando atingir um valor null ou undefined.

// Acesso à Propriedade

// Vamos imaginar que temos um álbum onde o artista e a
// biografia do artista podem não estar presentes nos dados.
// Por exemplo, uma lista pode não ter um único artista.

type AlbumAPIResponse = {
  title: string;
  artist?: {
    name: string;
    bio?: string;
    previousAlbums?: string[];
  };
};

declare const album: AlbumAPIResponse;

// Com encadeamento opcional você pode escrever
// código como esse:

const artistBio = album?.artist?.bio;

// Ao invés desse:

const maybeArtistBio = album.artist && album.artist.bio;

// Nessa caso ?. age diferente que o && já que o && agirá
// diferente em valores falsy (ex.: uma string vazia,
// 0, NaN, e false).

// Encadeamento opcional apenas considerá null ou
// undefined como sinal de parada e retornará um undefined.

// Acesso a Elemento Opcional

// Acesso à Propriedade é através do operador ., o encadeamento
// opcional também funciona com os operadores [] quando acessa
// elementos.

const maybeArtistBioElement = album?.["artist"]?.["bio"];

const maybeFirstPreviousAlbum = album?.artist?.previousAlbums?.[0];

// Chamadas opcionais

// Ao lidar com funções que podem ou não existir em tempo de execução,
// o encadeamento opcional suporta apenas a chamada de uma função
// se ela existir. Isso pode substituir o código onde você
// tradicionalmente escreveria algo como: if (func) func()

// Por exemplo, aqui está uma chamada opcional para o callback
// de uma requisição API:

const callUpdateMetadata = (metadata: any) => Promise.resolve(metadata); // Falsa chamada API

const updateAlbumMetadata = async (metadata: any, callback?: () => void) => {
  await callUpdateMetadata(metadata);

  callback?.();
};

// Você pode ler mais sobre encadeamento opcional no post da versão 3.7
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
