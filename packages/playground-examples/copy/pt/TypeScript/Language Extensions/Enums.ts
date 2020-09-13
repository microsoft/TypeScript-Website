// Enums são uma funcionalidade adicionada ao JavaScript pelo TypeScript
// na qual facilita o manuseio de grupos de constantes nomeadas.

// Por padrão um enum é baseado em números, começando no zero,
// e para cada opção é assinalado um número incrementado por um.
// Isso é útil quando o valor em si não importa.

enum DirecaoBussola {
  Norte,
  Leste,
  Sul,
  Oeste,
}

// Quando se escreve uma opção do enum, o valor é atribuido;
// incrementos continuam a partir daquele valor:

enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
}

// Você referencia um enum usando EnumName.Value

const direcaoInicial = DirecaoBussola.Leste;
const statusAtual = StatusCodes.OK;

// Enums suportam o acesso ao dado em ambos os lados: Da chave
// ao valor e do valor a chave.

const ok = StatusCodes.OK;
const indiceOk = StatusCodes["OK"];
const stringBadRequest = StatusCodes[400];

// Enums podem ser de diferentes tipos, sendo o tipo string mais comum.
// Quando se usa string, o debug da aplicação pode ser mais fácil de ser
// realizado porque o valor em tempo de execução não requer que você olhe o número.

enum entradaGamePad {
  Cima = "UP",
  Baixo = "DOWN",
  Esquerda = "LEFT",
  Direita = "RIGHT",
}

// Se você quer reduzir o número de objetos em tempo de
// execução no JavaScript, você vai criar um enum constante.

// Um valor constante de um enum é substituído pelo TypeScript durante
// a transpilação do seu código, ao invés de buscar o valor por
// um objeto em temp ode execução.

const enum MouseAction {
  MouseDown,
  MouseUpOutside,
  MouseUpInside,
}

const handleMouseAction = (action: MouseAction) => {
  switch (action) {
    case MouseAction.MouseDown:
      console.log("Clique");
      break;
  }
};

  // Se você olhar o JavaScript transpilado, você poderá ver
  // como os outros enums existem como objetos e funções, apesar
  // de que MouseAction não estará lá.

  // Isto também é verdade para a conferência contra MouseAction.MouseDown
  // dentro do bloco de switch dentro de handleMouseAction

  // Enums podem fazer mais que isso, você pode ler mais sobre no
  // manual do TypeScript:
  //
  // https://www.typescriptlang.org/docs/handbook/enums.html
