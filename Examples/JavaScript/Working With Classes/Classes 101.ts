
class Greeter {
  greeting: string;

  constructor(message: string) {
      this.greeting = message;
  }

  message() {
      return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
console.log(greeter.message())
