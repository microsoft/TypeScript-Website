//// { order: 4 }

// Mixins são um falso padrão de herança múltipla para classes
// em JavaScript para o qual o TypeScript tem suporte. O padrão
// permite que você crie uma classe que é uma fusão de múltiplas
// classes.

// Para começar, precisamos de um tipo que usaremos para estender
// de outras classes. A principal responsabilidade é declarar
// que o tipo que está sendo passado é uma classe.

type Constructor = new (...args: any[]) => {};

// Então podemos criar uma série de classes que estendem
// a classe final envolvendo-a. Este padrão funciona bem
// quando objetos semelhantes têm recursos diferentes.

// Este mixin adiciona uma propriedade de escala, com getters e setters
// para alterá-lo com uma propriedade privada encapsulada:

function Scale<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Mixins não podem declarar propriedades privadas / protegidas
    // entretanto, você pode usar campos privados ES2020
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}

// Este mixin adiciona métodos extras em torno da composição alpha
// algo que os computadores modernos usam para criar profundidade:

function Alpha<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    alpha = 1;

    setHidden() {
      this.alpha = 0;
    }

    setVisible() {
      this.alpha = 1;
    }

    setAlpha(alpha: number) {
      this.alpha = alpha;
    }
  };
}

// Uma classe base de sprite simples que será estendida:

class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// Aqui nós criamos dois tipos diferentes de sprites
// que têm recursos diferentes:

const ModernDisplaySprite = Alpha(Scale(Sprite));
const EightBitSprite = Scale(Sprite);

// A criação de instâncias dessas classes mostra que
// os objetos têm diferentes conjuntos de propriedades
// e métodos devido aos seus mixins:

const flappySprite = new ModernDisplaySprite("Bird");
flappySprite.x = 10;
flappySprite.y = 20;
flappySprite.setVisible();
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

const gameBoySprite = new EightBitSprite("L block");
gameBoySprite.setScale(0.3);

// Falha porque um EightBitSprite não tem
// o mixin para mudar alphas:
gameBoySprite.setAlpha(0.5);

// Se você quiser dar mais garantias sobre as classes
// que você embrulha, você pode usar um construtor com genéricos.

type GConstructor<T = {}> = new (...args: any[]) => T;

// Agora você pode declarar que este mixin só pode ser
// aplicado quando a classe base tem uma determinada forma.

type Moveable = GConstructor<{ setXYAcceleration: (x: number, y: number) => void }>;

// Podemos então criar um mixin que depende da função
// presente no parâmetro para o GConstructor acima.

function Jumpable<TBase extends Moveable>(Base: TBase) {
  return class extends Base {
    jump() {
      // Este mixin conhece setXYAcceleration agora
      this.setXYAcceleration(0, 20);
    }
  };
}

// Não podemos criar este sprite até que haja uma classe
// na hierarquia mixin que adiciona setXYAcceleration:

const UserSprite = new Jumpable(ModernDisplaySprite);
