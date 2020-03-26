//// { title: 'TypeScript con Deno', order: 3 }

// Deno es un entorno en tiempo de ejecución aún
// incompleto para JavaScript y TypeScript basado en
// v8 con un enfoque marcado en la seguridad.

// https://deno.land

// Deno cuenta con un sistema de permisos con base en el aislamiento,
// lo cual reduce el acceso que tiene JavaScript al sistema de
// archivos o a la red y utiliza importaciones basadas en http, las
// cuales son descargadas y almacenadas localmente.

// Aquí hay un ejemplo del uso de deno para crear scripts:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `¡Hola, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// Dice "¡HOLA, MUNDO!."
greetLoudly("mundo");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// Devuelve "holamundo"
concat("hola", "mundo");
