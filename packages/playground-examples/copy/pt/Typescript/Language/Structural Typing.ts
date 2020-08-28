// TypeScript é um Sistema de Tipagem Estrutural, isso significa
// que comparando tipos, o Typescript leva em consideração apenas
// as propriedades do tipo.

// Isso em contraste a sistemas de tipagem nominais, onde você
// pode criar dois tipos mas não pode atribuir um ao outro.
// Veja o example:nominal-typing

// Por exemplo, essas duas interfaces são
// transferíveis em um sistema de tipo estrutural

interface Bola {
  diametro: number;
}
interface Esfera {
  diametro: number;
}

let bola: Bola = { diametro: 10 };
let esfera: Esfera = { diametro: 20 };

esfera = bola;
bola = esfera;

// Se nós adicionarmos um tipo que possui estruturalmente todas
// as propriedades de Bola e Esfera, esse tipo também poderá ser
// atribuído a um Bola ou Esfera.

interface Tubo {
  diametro: number;
  tamanho: number;
}

let tubo: Tubo = { diametro: 12, tamanho: 3 };

tubo = bola;
bola = tubo;

// Porque a variável bola não tem a propriedade tamanho, ela não pode
// ser atribuída a tubo. No entanto, já que todas as propriedades
// de Bola estão dentro de tubo, ela pode ser atribuída a variável bola.

// TypeScript é a comparação entre propriedades de um tipo contra
// as de outro para verificar a igualdade.

// Uma função é um objeto em Javascript e isso é comparado de forma
// semelhante. Com um truque extra em volta dos parâmetros:

let criaBola = (diametro: number) => ({ diametro });
let criaEsfera = (diametro: number, emPolegadas: boolean) => {
  return { diametro: emPolegadas ? diametro * 0.39 : diametro };
};

criaEsfera = criaBola;
criaBola = criaEsfera;

// TypeScript vai permitir (number) ser igual (number, boolean)
// nos parâmetros, mas não (number, boolean) -> (number)

// TypeScript vai descartar o boolean na primeira atribuição
// porque é bastante comum para o código Javascript pular a
// passagem de parâmetros quando não são necessários.

// Por exemplo o callback do método forEach de Arrays possui
// três parâmetros, valor, index e o array completo - se o Typescript
// não suportasse o descarte de parâmetros, ele teria que incluir
// todas as opções para fazer as funções combinarem:

[criaBola(1), criaBola(2)].forEach((bola, _index, _bolas) => {
  console.log(bola);
});

// Ninguém precisa disso.

// Tipos de retorno são tratados como objetos, e qualquer diferença
// é comparada usando a mesma regra de igualdade a cima.

let criaBolaVermelha = (diametro: number) => ({ diametro, color: "red" });

criaBola = criaBolaVermelha;
criaBolaVermelha = criaBola;

// Aqui o primeiro argumento funciona (os dois possuem diâmetro)
// mas o segundo não (a variável bola não possui cor).
