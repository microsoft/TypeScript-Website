//// { compiler: { ts: "3.8.3" } }
// A habilidade do TypeScript de re-exportar ficou mais perto de suportar
// os casos adicionais disponíveis na ES2018.
//
// 'JavaScript exports' tem a habilidade de re-exportar
// elegantemente uma parte de uma dependência:

export { ScriptTransformer } from "@jest/transform";

// Quando você quer exportar o objeto inteiro, isso
// fica um pouco mais verboso em versões anteriores do TypeScript:

import * as console from "@jest/console";
import * as reporters from "@jest/reporters";

export { console, reporters };

// Com a versão 3.8, o TypeScript suporta mais das formas
// de declaração de 'export', conforme as especificações do JavaScript,
// deixando você escrever uma única linha para re-exportar um módulo.

export * as jestConsole from "@jest/console";
export * as jestReporters from "@jest/reporters";
