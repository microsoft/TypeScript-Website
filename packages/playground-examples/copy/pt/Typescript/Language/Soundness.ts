//// {compiler: { strictFunctionTypes: false } }

// Sem um histórico na teoria de tipos, é improvável que você
// esteja familiarizado com a ideia de um sistema de tipos ser "sólido" (_sound_).

// Solidez (_Soundness_) é a ideia de que o compilador pode dar garantias sobre o tipo
// de um valor em tempo de execução, e não apenas durante a compilação.
// Isso é normal para a maioria das linguagens de programação
// que são construídas com tipos desde a sua criação.

// Construir um sistema de tipo que modela uma linguagem que existe
// há algumas décadas, no entanto, torna-se sobre tomar
// decisões que podem ter efeitos em três propriedades: Simplicidade,
// Usabilidade e Solidez.

// Com o objetivo do TypeScript de ser capaz de suportar todo o código
// JavaScript, a linguagem tende à simplicidade e usabilidade quando
// apresentada com maneiras de adicionar tipos ao JavaScript.

// Vejamos alguns casos em que o TypeScript provavelmente
// não é adequado para entender como seriam
// essas compensações de outra forma.

// Asserções de tipo

const idadeDoUsuario = ("23" as any) as number;

// O TypeScript permitirá que você use asserções de tipo para  substituir
// a inferência de algo que está totalmente errado. Usar asserções de tipo
// é uma maneira de dizer ao TypeScript que você o conhece melhor,
// e o TypeScript tentará permitir que você prossiga com isso.

// Linguagens que são sólidas ocasionalmente usariam verificações
// de tempo de execução para garantir que os dados correspondam ao que
// seus tipos dizem - mas o TypeScript visa não ter impacto no tempo
// de execução com reconhecimento de tipo no seu código transpilado.

// Função Parâmetro Bi-variância

// Parâmetros para uma função que suportam a redefinição do
// parâmetro para ser um subtipo da declaração original.

interface InputEvent {
  timestamp: number;
}
interface MouseInputEvent extends InputEvent {
  x: number;
  y: number;
}
interface KeyboardInputEvent extends InputEvent {
  keyCode: number;
}

function escuteOEvento(eventType: "keyboard" | "mouse", handler: (event: InputEvent) => void) {}

// Você pode declarar novamente o tipo de parâmetro como um subtipo
// da declaração. Acima, o manipulador esperava um tipo InputEvent,
// mas nos exemplos de uso abaixo - o TypeScript aceita um tipo
// que possui propriedades adicionais.

escuteOEvento("keyboard", (event: KeyboardInputEvent) => {});
escuteOEvento("mouse", (event: MouseInputEvent) => {});

// Isso pode voltar ao menor tipo comum:

escuteOEvento("mouse", (event: {}) => {});

// Mas não mais:

escuteOEvento("mouse", (event: string) => {});

// Isso cobre o padrão real do event listener em JavaScript,
// às custas de ser sólido.

// O TypeScript pode gerar um erro quando isso acontecer por meio
// de `strictFunctionTypes`. Ou você pode contornar este caso
// específico com sobrecargas de função, consulte:
// exemplo: typing-functions

// Casing especial para Void

// Descarte de parâmetros

// Para aprender sobre casos especiais com parâmetros de função,
// consulte o exemplo: structural-typing

// Parâmetros rest

// Os parâmetros rest são considerados opcionais, isso significa
// que o TypeScript não terá uma maneira de impor o número de
// parâmetros disponíveis para um retorno de chamada.

function obterNumerosAleatorios(count: number, callback: (...args: number[]) => void) {}

obterNumerosAleatorios(2, (first, second) => console.log([first, second]));
obterNumerosAleatorios(400, first => console.log(first));

// Funções nulas podem corresponder a uma função com um valor de retorno

// Uma função que retorna uma função void pode
// aceitar uma função que assume qualquer outro tipo.

const obterPI = () => 3.14;

function executarFuncao(func: () => void) {
  func();
}

executarFuncao(obterPI);

// Para obter mais informações sobre os locais onde
// a solidez do sistema de tipo está comprometida, consulte:

// https://github.com/Microsoft/TypeScript/wiki/FAQ#type-system-behavior
// https://github.com/Microsoft/TypeScript/issues/9825
// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
