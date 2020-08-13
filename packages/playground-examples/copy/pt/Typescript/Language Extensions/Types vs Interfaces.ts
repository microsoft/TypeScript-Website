// Existem dois tipos principais para declarar a forma de um
// objeto: interfaces e tipos.

// Eles são bem parecidos e para a maioria dos casos
// funcionam da mesma forma.

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  wings: 2;
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { wings: 2 };

// Porque o Typescript é um sistema de tipagem estrutural
// é possível misturar o seu uso também.

const bird3: BirdInterface = bird1;

// Ambos suportam a extensão de outras interfaces e tipos.
// Os tipos fazem isso através da interseção de tipos,
// enquanto interfaces possuem uma palavra-chave.

type Owl = { nocturnal: true } & BirdType;
type Robin = { nocturnal: false } & BirdInterface;

interface Peacock extends BirdType {
  colourful: true;
  flies: false;
}
interface Chicken extends BirdInterface {
  colourful: false;
  flies: false;
}

let owl: Owl = { wings: 2, nocturnal: true };
let chicken: Chicken = { wings: 2, colourful: false, flies: false };

// Tendo dito isso nós recomendamos você a usar interfaces ao invés de tipos.
// Especialmente porque você recebe melhores mensagens de erro.
// Se passar o mouse sobre o erro, você pode ver os erros que o Typescript
// mais focados para interfaces como a Chicken.

owl = chicken;
chicken = owl;

// Uma das maiores diferenças entre tipos e interfaces é que
// interfaces são abertas e tipos são fechados.
// Isso signifca que você pode extender interfaces declarando
// uma segunda vez.

interface Kitten {
  purrs: boolean;
}

interface Kitten {
  colour: string;
}

// Por outro lado tipos não podem ser alterados fora
// da prórpia declaração.

type Puppy = {
  color: string;
};

type Puppy = {
  toys: number;
};

// Dependendo dos seus objetivos essa diferença pode ser
// positiva ou negativa. No entando, para expor os tipos publicamente
// é melhor transformá-los em interfaces.

// Como um dos melhores recursos para ver todos os casos de uso
// de tipos vs interfaces, recomendamos essa thread do Stackoverflow
// como um bom ponto de partida:

// https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
