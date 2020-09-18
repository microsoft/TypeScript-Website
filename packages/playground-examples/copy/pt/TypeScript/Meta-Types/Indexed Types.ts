// Existem situações em que você se encontra duplicando
// tipos, um exemplo comum são recursos aninhados em uma
// resposta de API gerada automaticamente.

interface ResultadosBuscaDeObras {
  artistas: {
    nome: string;
    obras: {
      nome: string;
      dataFalecimento: string | null;
      bio: string;
    }[];
  }[];
}

// Se essa interface fosse feita manualmente, é fácil imaginar
// que as obras seriam separadas em uma interface como:

interface Obras {
  nome: string;
  dataFalecimento: string | null;
  bio: string;
}

// No entanto, nesse caso não temos controle da API e, se
// criarmos a interface manualmente, é possível que o campo
// obras em ResultadosBuscaDeObras e Obras fiquem defasados
// quando houver uma mudança na resposta.

// Para resolver esse problema utilizamos tipos indexados,
// que replicam como JavaScript permite acessar propriedades
// de objetos via strings.

type ObrasInferidas = ResultadosBuscaDeObras["artistas"][0]["obras"][0];

// A interface ObrasInferidas é gerada percorrendo as
// propriedades do tipo e dando um novo nome ao subconjunto
// que você indexou.