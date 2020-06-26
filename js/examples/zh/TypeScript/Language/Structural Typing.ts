// TypeScript 是结构化类型系统，结构化类型系统意味着
// 在比较类型时，TypeScript 仅考虑类型上的成员。

// 这与标称类型系统可以创建两种类型，但不能将他们互相赋值的行为不同。
// 查看 example:nominal-typing 以了解更多.

// 例如，如下两个接口在结构化类型系统中，完全可以互相转移。

interface Ball {
  diameter: number;
}
interface Sphere {
  diameter: number;
}

let ball: Ball = { diameter: 10 };
let sphere: Sphere = { diameter: 20 };

sphere = ball;
ball = sphere;

// 如果我们添加了一个包含所有 Ball 和 Sphere 类型成员的类型，
// 那么它也可以赋值给 ball 或 sphere。

interface Tube {
  diameter: number;
  length: number;
}

let tube: Tube = { diameter: 12, length: 3 };

tube = ball;
ball = tube;

// 因为 ball 没有 length 属性，所以它不可以被赋值给 tube 变量。
// 然而 tube 包含所有 Ball 的成员，所以 tube 可以被赋值给 ball。

// TypeScript 将类型中的每个成员进行比较，以验证他们的相等性。

// JavaScript中，一个函数是一个对象，并且他们以类似的方式比较。
// 一个参数的额外技巧：

let createBall = (diameter: number) => ({ diameter });
let createSphere = (diameter: number, useInches: boolean) => {
  return { diameter: useInches ? diameter * 0.39 : diameter };
};

createSphere = createBall;
createBall = createSphere;

// TypeScript 认为 (number) 与 (number, boolean) 在参数中相等，
// 但是不认为 (number, boolean) 与 (number) 相等。

// TypeScript 将丢弃在第一个赋值中的 boolean 参数。
// 因为这是一个在 JavaScript 中，忽略不需要的参数的常见的方法。

// 例如，数组的 'forEach' 方法的回调有 3 个参数，值，索引，和整个数组。
// 如果 TypeScript 不支持丢弃参数，您必须包含所有的参数以使函数完备。

[createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
  console.log(ball);
});

// 没有人希望这样。

// 返回值被视为对象，并且所有差异均按照上述对象相等性规则进行比较。

let createRedBall = (diameter: number) => ({ diameter, color: "red" });

createBall = createRedBall;
createRedBall = createBall;

// 第一个赋值是有效的（他们都有 diameter），
// 第二个赋值不是有效的（ball 没有 color）。
