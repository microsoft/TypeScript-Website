//// { order: 3 }

// Deno é um ambiente de execução JavaScript e TypeScript
// em desenvolvimento baseado no v8 com um foco em segurança.

// https://deno.land

// Deno tem um sistema de permissão maleável que reduz o acesso que
// o JavaScript tem ao sistema de arquivos ou rede e usa importações
// baseadas em http que são baixadas e armazenadas localmente

// Aqui está um exemplo do uso do deno para criar scripts:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function cumprimento(nome: string) {
  return `Olá, ${nome}!`;
}

function gritar(x: string) {
  return x.toUpperCase();
}

const cumprimentarGritando = compose(gritar, cumprimento);

// Imprime "OLÁ, MUNDO!."
cumprimentarGritando("mundo");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// Retorna "olámundo"
concat("olá", "mundo");
