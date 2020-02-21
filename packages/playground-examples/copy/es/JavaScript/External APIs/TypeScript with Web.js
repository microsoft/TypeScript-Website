//// { title: 'TypeScript con la Web', order: 0, isJavaScript: true }

// El DOM (Document Object Model) es la API por detrás del
// trabajo con una página web, y TypeScript tiene excelente
// compatibilidad con esa API.

// Creemos un globo de ayuda (en inglés, popover) que se muestra cuando 
// se presiona "Ejecutar" en la barra de herramientas de arriba.

const popover = document.createElement("div");
popover.id = "example-popover";

// Observa que el globo está correctamente anotado con el tipo
// HTMLDivElement porque pasamos el elemento "div".

// Para hacer posible volver a ejecutar este código, primero
// añadiremos una función para eliminar el globo si ya existía.

const removePopover = () => {
  const existingPopover = document.getElementById(popover.id);
  if (existingPopover && existingPopover.parentElement) {
    existingPopover.parentElement.removeChild(existingPopover);
  }
};

// Y entonces llamarla inmediatamente.

removePopover();

// Podemos establecer los estilos en línea del elemento a través
// de la propiedad .style en un HTMLElement: tiene todos los tipos
// definidos

popover.style.backgroundColor = "#0078D4";
popover.style.color = "white";
popover.style.border = "1px solid black";
popover.style.position = "fixed";
popover.style.bottom = "10px";
popover.style.right = "20px";
popover.style.width = "200px";
popover.style.height = "100px";
popover.style.padding = "10px";

// Incluidos atributos CSS menos conocidos u obsoletos.
popover.style.webkitBorderRadius = "4px";

// Para añadir contenido al globo, necesitaremos añadir
// un elemento de párrafo y usarlo para añadir algún texto.

const message = document.createElement("p");
message.textContent = "Here is an example popover";

// Y también añadiremos un botón de cerrar.

const closeButton = document.createElement("a");
closeButton.textContent = "X";
closeButton.style.position = "absolute";
closeButton.style.top = "3px";
closeButton.style.right = "8px";
closeButton.style.color = "white";

closeButton.onclick = () => {
  removePopover()
}

// Y entonces añadir todos estos elementos a la página.
popover.appendChild(message);
popover.appendChild(closeButton);
document.body.appendChild(popover);

// Si ejecutas "Run"  arriba, el popup debe aparecer
// abajo a la izquierda, y lo puedes cerrar haciendo
// click en la x en la parte superior derecha del popup.

// Este ejemplo muestra cómo puedes trabajar con la API
// del DOM en JavaScript, pero usando TypeScript para
// obtener mejores herramientas de asistencia.

// Hay un ejemplo extendido para las herramientas de TypeScript
// con WebGL disponible aquí: example:typescript-with-webgl
