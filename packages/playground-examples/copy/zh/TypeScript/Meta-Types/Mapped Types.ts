// 映射类型（Mapped types）是通过一个类型创建另一个类型的方法。
// 从效果上来说，它是一种转换类型。

// 常见的映射类型的使用场景是处理某些现有类型的部分子集。
// 例如，有一个 API 返回 Artist 类型。

interface Artist {
  id: number;
  name: string;
  bio: string;
}

// 但是，如果要将更新的请求发送给 API，而这个请求只更新 Artist 的
// 一个子集，则需要创建其他类型：

interface ArtistForEdit {
  id: number;
  name?: string;
  bio?: string;
}

// 这很可能导致与上面的 Artist 不同步，映射类型允许你根据
// 已有的类型创建更改的类型。

type MyPartialType<Type> = {
  // 将 Type 的每个存在的属性转换为可选（?:）的
  [Property in keyof Type]?: Type[Property];
};

// 现在我们可以使用映射类型去创建我们的修改请求接口：
type MappedArtistForEdit = MyPartialType<Artist>;

// 这接近于完美，但是这样做会允许 id 为 null，这是不应该发生的。
// 所以，让我们使用交集类型（查看 example:union-and-intersection-types）来快速改进。

type MyPartialTypeForEdit<Type> = {
  [Property in keyof Type]?: Type[Property];
} & { id: number };

// 这将获取映射类型的结果，并且与设置了 { id: number } 的对象类型合并，
// 有效的在类型中确保了 id 的存在。

type CorrectMappedArtistForEdit = MyPartialTypeForEdit<Artist>;

// 这是演示映射类型工作方式的一个非常简单的例子，并且涵盖了大多数基础知识。
// 如果你想更深入的了解更多信息，可以查看手册：
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
