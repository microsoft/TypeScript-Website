// TypeScript é um Sistema de Tipagem Estrutural, isso significa
// que comparando tipos, o Typescript leva em consideração apenas
// as propriedades do tipo.

// Isso em contraste a sistemas de tipagem nominais, onde você
// pode criar dois tipos mas não pode atribuir um ao outro.
// Veja o exemplo: nominal-typing

// Por exemplo, essas duas interfaces são
// transferíveis em um sistema de tipo estrutural

interface Ball {
  diameter: number;
}
interface Sphere {
  diameter: number;
}

let ball: Ball = { diameter: 10 };
let sphere: Sphere = { diameter: 20 };

sphere = ball;
ball = sphere;

// Se nós adicionarmos um tipo que possui estruturalmente todas
// as propriedades de Ball e Sphere, esse tipo também poderá ser
// atribuído a um Ball ou Sphere.

interface Tube {
  diameter: number;
  length: number;
}

let tube: Tube = { diameter: 12, length: 3 };

tube = ball;
ball = tube;

// Porque a variável ball não tem a priedade length, ela não pode
// ser atribuída a tube. No entanto, já que todas as propriedades
// de Ball estão dentro de tube, ela pode ser atribuída a variável ball.

// TypeScript é a comparação entre propriedades de um tipo contra
// as de outro para verificar a igualdade.

// Uma função é um objeto em Javascript e isso é comparado de forma
// semelhante. Com um truque extra em volta dos parâmetros:

let createBall = (diameter: number) => ({ diameter });
let createSphere = (diameter: number, useInches: boolean) => {
  return { diameter: useInches ? diameter * 0.39 : diameter };
};

createSphere = createBall;
createBall = createSphere;

// TypeScript vai permitir (number) ser igual (number, boolean)
// nos parâmetros, mas não (number, boolean) -> (number)

// TypeScript vai descartar o boolean na primeira atribuição
// porque é bastante comum para o código Javascript pular a
// passagem de parâmetros quando não são necessários.

// Por exemplo o callback do método forEach de Arrays possui
// três parâmetros, valor, index e o array completo - se o Typescript
// não suportasse o descarte de parâmetros, ele teria que incluir
// todas as opções para fazer as funções combinarem:

[createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
  console.log(ball);
});

// Ninguém precisa disso.

// Tipos de retorno são tratados como objetos, e qualquer diferença
// é comparada usando a mesma regra de igualdade a cima.

let createRedBall = (diameter: number) => ({ diameter, color: "red" });

createBall = createRedBall;
createRedBall = createBall;

// Aqui o primeiro argumento funciona (os dois possuem diâmetro)
// mas o segundo não (a variável ball não possui cor).
