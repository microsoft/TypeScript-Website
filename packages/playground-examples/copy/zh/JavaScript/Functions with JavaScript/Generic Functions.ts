// 泛型提供了在类型中以变量的形式使用类型的元方法，

// 我们将努力使本例保持简洁，您可以使用泛型做很多事，并且您可能有时
// 会看到一些非常复杂的使用泛型的代码——但这并不意味着泛型很复杂。

// 让我们从将 input 对象包装在数组中的示例开始，在这种情况下，我们
// 只关心一个类型变量，即传入的类型。

function wrapInArray<Type>(input: Type): Type[] {
  return [input];
}

// 注：通常将 Type 称为 T，在文化上，这是一种类似于人们在 for 循环中使用
// i 来表示索引。T 通常表示 Type，因此为了清楚起见，我们将使用全名。

// 我们的函数将使用推导来确保传入的类型与传出的类型相同（即使它被包含在数组中）。

const stringArray = wrapInArray("hello generics");
const numberArray = wrapInArray(123);

// 我们可以通过检查是否可以将字符串数组赋值诶应为对象数组的函数
// 来验证其是否正常工作。
const notStringArray: string[] = wrapInArray({});

// 您还可以通过自行添加类型来跳过泛型类型推导：
const stringArray2 = wrapInArray<string>("");

// wrapInArray 允许使用任何类型，但在某些情况下，您只允许某些类型的
// 子集。在这种情况下，您可以指定类型必须扩展特定类型。

interface Drawable {
  draw: () => void;
}

// 这个函数接收一组对象，这些对象具有用于在屏幕上绘制的功能：
function renderToScreen<Type extends Drawable>(input: Type[]) {
  input.forEach((i) => i.draw());
}

const objectsWithDraw = [{ draw: () => {} }, { draw: () => {} }];
renderToScreen(objectsWithDraw);

// 如果没有 draw，它会报错：

renderToScreen([{}, { draw: () => {} }]);

// 当您有多个变量时，泛型看起来可能会很复杂。这是一个缓存函数的示例，
// 可以让您拥有不同的输入类型和缓存。

interface CacheHost {
  save: (a: any) => void;
}

function addObjectToCache<Type, Cache extends CacheHost>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// 这和上面相同，但有一个额外的参数。
// 注：尽管如此，我们必须使用 any。这可以使用泛型接口来解决。

interface CacheHostGeneric<ContentType> {
  save: (a: ContentType) => void;
}

// 在使用 CacheHostGeneric 时，您必须告诉它 ContentType 是什么。

function addTypedObjectToCache<Type, Cache extends CacheHostGeneric<Type>>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// 单从语法而言，这很快就变复杂了。但是这提供了额外的安全性。这是取舍，您
// 现在有更多相关的知识要做。在为其他人提供 API 时，泛型提供了一种灵活的
// 方法，让他们通过完整的类型推导使用自己的类型。

// 更多关于泛型、类和函数的示例可以查看：
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
