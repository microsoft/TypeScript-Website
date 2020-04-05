// 声明一个对象的类型时，有两个主要的工具：接口（interface）和类型别名（type aliases）。
//
// 他们非常相似，并且在大多数情况下是相同的。

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  wings: 2;
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { wings: 2 };

// 因为 TypeScript 有着结构化类型系统。
// 我们也可以混合使用他们。

const bird3: BirdInterface = bird1;

// 他们都支持扩展另一个些接口或类型。
// 类型别名通过并集类型来实现，接口通过 extends 关键字。

type Owl = { nocturnal: true } & BirdType;
type Robin = { nocturnal: false } & BirdInterface;

interface Peacock extends BirdType {
  colourful: true;
  flies: false;
}
interface Chicken extends BirdInterface {
  colourful: false;
  flies: false;
}

let owl: Owl = { wings: 2, nocturnal: true };
let chicken: Chicken = { wings: 2, colourful: false, flies: false };

// 也就是说，我们建议您使用接口而不是类型别名，因为你可以在接口中获得更好的错误提示。
// 如果你将鼠标悬停在下面的错误上，你会看到在使用接口（例如 Chicken）时，
// TypeScript 会提供更简洁的提示信息。

owl = chicken;
chicken = owl;

// 一个接口和类型别名的主要区别是，接口是开放的，类型别名是封闭的。
// 这意味着你可以你可以通过多次声明同一个接口来扩展它。

interface Kitten {
  purrs: boolean;
}

interface Kitten {
  colour: string;
}

// 与此同时，类型别名不可以在外部变更它的声明。

type Puppy = {
  color: string;
};

type Puppy = {
  toys: number;
};

// 基于你不同的目的，这个区别可以是证明的也可以是负面的。
// 一般来说，对于公开的需要暴露的类型，将他们作为接口是更好的选择。

// 要查看接口和类型定义之间所有边际条件，下面的 StackOverflow 讨论是最好的资源之一:

// https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
