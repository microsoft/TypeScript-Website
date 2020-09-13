//// { order: 0 }

// Uma classe é um tipo especial do objeto JavaScript, no qual
// sempre é criada a partir de um constructor. Essas classes
// agem muito como objetos, e possuem uma estrutura de herança
// parecida a linguagens como Java/C#/Swift.

// Aqui está um exemplo de uma classe:

class Vendor {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return "Hello, welcome to " + this.name;
  }
}

// Uma instância pode ser criada por meio da palavra-chave new, e
// você pode chamar métodos e acessar propriedades do
// objeto.

const shop = new Vendor("Ye Olde Shop");
console.log(shop.greet());

// Você pode criar uma subclasse de um objeto. Aqui está um carrinho de comida que
// tem uma variedade assim como um nome:

class FoodTruck extends Vendor {
  cuisine: string;

  constructor(name: string, cuisine: string) {
    super(name);
    this.cuisine = cuisine;
  }

  greet() {
    return "Hi, welcome to food truck " + this.name + ". We serve " + this.cuisine + " food.";
  }
}

// Porque nós indicamos que deve ter dois argumentos
// para criar um novo FoodTruck, TypeScript fornecerá erros
// caso você utilize apenas um:

const nameOnlyTruck = new FoodTruck("Salome's Adobo");

// Passar dois argumentos corretamente permitirá que você crie uma
// nova instância do FoodTruck:

const truck = new FoodTruck("Dave's Doritos", "junk");
console.log(truck.greet());
