// Una unión de tipo discriminado es cuando se utiliza el
// análisis de flujo de código para reducir un conjunto de
// objetos potenciales a un objeto específico.
//
// Este patrón funciona muy bien para conjuntos de objetos
// similares con una cadena o constante numérica diferente,
// por ejemplo: una lista de eventos con nombre, o conjuntos
// de objetos versionados.

type TimingEvent = { name: "start"; userStarted: boolean } | { name: "closed"; duration: number };

// Cuando el evento entra en esta función, podría ser
// cualquiera de los dos tipos potenciales.

const handleEvent = (event: TimingEvent) => {
  // Mediante el uso de un interruptor en event.name el
  // análisis de flujo de código de TypeScript puede
  // determinar que un objeto sólo puede ser representado
  // por un tipo en la unión.

  switch (event.name) {
    case "start":
      // Esto significa que puedes acceder con seguridad a
      // userStarted porque es el único tipo dentro de
      // TimingEvent donde el nombre es "start".
      const initiatedByUser = event.userStarted;
      break;

    case "closed":
      const timespan = event.duration;
      break;
  }
};

// Este patrón es el mismo con los números que podemos usar
// como el discriminador.

// En este ejemplo, tenemos una unión discriminante y un
// estado de error adicional que manejar.

type APIResponses = { version: 0; msg: string } | { version: 1; message: string; status: number } | { error: string };

const handleResponse = (response: APIResponses) => {
  // Maneja el caso de error, y luego retorna
  if ("error" in response) {
    console.error(response.error);
    return;
  }

  // TypeScript ahora sabe que APIResponse no puede ser el
  // tipo de error. Si fuera el error, la función habría
  // retornado. Puede verificar esto pasando el cursor sobre
  // response a continuación.

  if (response.version === 0) {
    console.log(response.msg);
  } else if (response.version === 1) {
    console.log(response.status, response.message);
  }
};

// Es mejor usar una declaración switch en lugar de
// declaraciones if, porque puedes asegurarte de que todas
// las partes de la unión son revisadas. Hay un buen patrón
// para esto usando el tipo `never` en el manual:

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
