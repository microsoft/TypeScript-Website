//// { title: 'Funciones genéricas' }

// La genericidad proporciona una forma de utilizar tipos
// como variables en otros tipos. Meta.

// Intentaremos mantener este ejemplo simple. Puedes hacer
// muchas cosas con la genericidad y probablemente verás
// en algún punto código muy complicado usando genericidad.
// Pero eso no significa que la genericidad es complicada.

// Comenzaremos con un ejemplo donde envolvemos un objeto de
// entrada en un arreglo. Solo nos importará una variable en
// este caso, el tipo suministrado:

function wrapInArray<Type>(input: Type): Type[] {
  return [input];
}

// Nota: es común ver el tipo Type como T. Esto es culturalmente
// similar a como las personas usan i en un cliclo for para
// representar index. T normalmente representa Type, por lo
// que usaremos el nombre completo para mayor claridad.

// Nuestra función usará inferencia para siempre mantener
// el tipo suministrado como entrada igual al suministrado
// como salida (aunque será envuelto en un arreglo).

const stringArray = wrapInArray("hello generics");
const numberArray = wrapInArray(123);

// Podemos verificar que funciona como se espera comprobando
// si podemos asignar un arreglo de cadenas a una función
// que debe ser un arreglo de objetos.
const notStringArray: string[] = wrapInArray({});

// Además puedes saltarte la inferencia de tipos si añades
// el tipo tú mismo:
const stringArray2 = wrapInArray<string>("");

// wrapInArray permite que se use cualquier tipo, sin embargo
// hay casos en que necesitas permitir solo un subconjunto de
// tipos. En estos casos puedes decir que el tipo tiene que
// extender un tipo en particular.

interface Drawable {
  draw: () => void;
}

// Esta función toma un conjunto de objetos que tiene una función
// para dibujar en la pantalla
function renderToScreen<Type extends Drawable>(input: Type[]) {
  input.forEach((i) => i.draw());
}

const objectsWithDraw = [{ draw: () => {} }, { draw: () => {} }];
renderToScreen(objectsWithDraw);

// Fallará si falta draw:

renderToScreen([{}, { draw: () => {} }]);

// La genericidad puede comenzar a parecer complicada cuando tienes
// múltiples variables. Aquí hay un ejemplo de una función de caché
// que te permite tener diferentes conjuntos de tipos de entrada y
// de cachés.

interface CacheHost {
  save: (a: any) => void;
}

function addObjectToCache<Type, Cache extends CacheHost>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// Esto es lo mismo que lo anterior, pero con un parámetro extra.
// Nota: Sin embargo para que esto funcione debimos usar any.
// Esto puede solucionarse usando una interfaz genérica.

interface CacheHostGeneric<ContentType> {
  save: (a: ContentType) => void;
}

// Ahora cuando se usa CacheHostGeneric, necesitas decirle
// qué ContentType es.

function addTypedObjectToCache<Type, Cache extends CacheHostGeneric<Type>>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// Eso escaló bastante rápido en términos de sintaxis. Sin
// embargo provee más seguridad. Estas son decisiones que
// ahora tienes más conocimiento para hacer. Al proporcionar
// APIs para terceros, la genericidad ofrece una forma flexible
// de permitir a otros utilizar sus propios tipos con total capacidad
// de inferencia de código.

// Para más ejemplos de genericidad con clases e interfaces:
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
