// Any é a cláusula de escape do Typescript. Você pode usar any para 
// declarar uma seção do seu código para ser dinâmica ou semelhante ao 
// JavaScript, ou para contornar as limitações do sistema de tipos.

// Um bom caso de uso para any é o parsing de JSON:

const myObject = JSON.parse("{}");

// Any declara ao Typescript para confiar no seu código
// como sendo seguro porque você sabe mais sobre ele, mesmo se isso
// não seja estritamente verdadeiro. 
// Por exemplo, esse código iria falhar:

myObject.x.y.z;

// Utilizar any provê a você a habilidade de escrever código próximo 
// ao JavaScript original sem a segurança de tipos.

// Any é muito semelhante a um 'tipo coringa' do qual 
// você pode substituir com qualquer tipo (exceto never) 
// para fazer um tipo atribuível a outro.

declare function debug(value: any): void;

debug("a string");
debug(23);
debug({ color: "blue" });

// Cada chamada para debug é permitida porque você pode substituir o
// tipo any com o tipo do argumento correspondente.

// TypeScript irá considerar a posição dos anys de diferentes formas,
// como, por exemplo, com essas tuplas como argumento da função.

declare function swap(x: [number, string]): [string, number];

declare const pair: [any, any];
swap(pair);

// A chamada de swap é autorizada porque o argumento pode ser 
// correspondente ao repor o primeiro any do par com um 
// número e o segundo any com uma string.

// Se tuplas são novas para você, veja: example:tuples

// Unknown é um irmão do tipo any, any é como dizer "Eu sei 
// o que é melhor", já Unknown é como dizer "Eu não sei o que 
// é o melhor, então você precisa dizer ao TS o tipo".
// example:unknown-and-never
