// Generics provide a way to use Types as variables in other
// types. Meta.

// We'll be trying to keep this example light, you can do
// a lot with generics and it's likely you will see some very
// complicated code using generics at some point - but that
// does not mean that generics are complicated.

// Let's start with an example where we wrap an input object
// in an array. We will only care about one variable in this
// case, the type which was passed in:

function wrapInArray<Type>(input: Type): Type[] {
  return [input];
}

// Note: it's common to see Type referred to as T. This is
// culturally similar to how people use i in a for loop to
// represent index. T normally represents Type, so we'll
// be using the full name for clarity.

// Our function will use inference to always keep the type
// passed in the same as the type passed out (though
// it will be wrapped in an array).

const stringArray = wrapInArray("hello generics");
const numberArray = wrapInArray(123);

// We can verify this works as expected by checking
// if we can assign a string array to a function which
// should be an object array:
const notStringArray: string[] = wrapInArray({});

// You can also skip the generic inference by adding the
// type yourself also:
const stringArray2 = wrapInArray<string>("");

// wrapInArray allows any type to be used, however there
// are cases when you need to only allow a subset of types.
// In these cases you can say the type has to extend a
// particular type.

interface Drawable {
  draw: () => void;
}

// This function takes a set of objects which have a function
// for drawing to the screen
function renderToScreen<Type extends Drawable>(input: Type[]) {
  input.forEach(i => i.draw());
}

const objectsWithDraw = [{ draw: () => {} }, { draw: () => {} }];
renderToScreen(objectsWithDraw);

// It will fail if draw is missing:

renderToScreen([{}, { draw: () => {} }]);

// Generics can start to look complicated when you have
// multiple variables. Here is an example of a caching
// function that lets you have different sets of input types
// and caches.

interface CacheHost {
  save: (a: any) => void;
}

function addObjectToCache<Type, Cache extends CacheHost>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// This is the same as above, but with an extra parameter.
// Note: to make this work though, we had to use an any. This
// can be worked out by using a generic interface.

interface CacheHostGeneric<ContentType> {
  save: (a: ContentType) => void;
}

// Now when the CacheHostGeneric is used, you need to tell
// it what ContentType is.

function addTypedObjectToCache<Type, Cache extends CacheHostGeneric<Type>>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// That escalated pretty quickly in terms of syntax. However,
// this provides more safety. These are trade-offs, that you
// have more knowledge to make now. When providing APIs for
// others, generics offer a flexible way to let others use
// their own types with full code inference.

// For more examples of generics with classes and interfaces:
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
