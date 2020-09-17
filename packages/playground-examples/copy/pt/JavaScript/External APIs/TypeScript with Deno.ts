//// { order: 3 }

// Deno é um ambiente de execução JavaScript e TypeScript
// em desenvolvimento baseado no v8 com um foco em segurança.

// https://deno.land

// Deno tem um sistema de permissão maleável que reduz o acesso que
// o JavaScript tem ao sistema de arquivos ou rede e usa importações
// baseadas em http que são baixadas e armazenadas localmente

// Aqui está um exemplo do uso do deno para criar scripts:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// Imprime "HELLO, WORLD!."
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// Retorna "helloworld"
concat("hello", "world");
