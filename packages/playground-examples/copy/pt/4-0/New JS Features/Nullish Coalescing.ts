//// { compiler: { ts: "4.0.2" } }

// # Nullish Coalescing
//
// Esse é o novo operador `??` com o intuito de ampliar
// o uso normal do `||` da mesma maneira que `===` amplia `==`
// para uma forma mais rígida de igualidade.
//
// Para entender, vamos ver como o || funciona:

const response = {
  nullValue: null,
  headerText: "",
  animationDuration: 0,
  height: 400,
  showSplashScreen: false,
} as const;

const undefinedValue = response.undefinedValue || "some other default";
// Seria: 'some other default'

const nullValue = response.nullValue || "some other default";

// Esses dois exemplos funcionam de maneira similar na maioria
// das linguagens. A ferramenta || é muito boa em padronizar coisas
// mas as checagens de falsidade do Javascript podem te surpreender
// com alguns valores simples:

// Potencialmente indesejado. '' é falsy, resultado: 'Hello, world!'
const headerText = response.headerText || "Hello, world!";

// Potencialmente indesejado. 0 é falsy, resultado: 300
const animationDuration = response.animationDuration || 300;

// Potencialmente indesejado. false é falsy, resultado: true
const showSplashScreen = response.showSplashScreen || true;

// Alterando para usar ?? no lugar, então a igualdade === é usada
// para comparar ambos os lados:

const emptyHeaderText = response.headerText ?? "Hello, world!";
const zeroAnimationDuration = response.animationDuration ?? 300;
const skipSplashScreen = response.showSplashScreen ?? true;
