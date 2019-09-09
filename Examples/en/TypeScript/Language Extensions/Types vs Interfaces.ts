// There are two main tools to declare the shape of an
// object: interfaces and type aliases.
//
// They are very similar, and for the most common cases
// act the same.

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  wings: 2;
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { wings: 2 };

// Because TypeScript is a structural type system,
// it's possible to intermix their use too.

const bird3: BirdInterface = bird1;

// They both support extending other interfaces and types.
// Type aliases do this via intersection types, while
// interfaces have a keyword.

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

// That said, we recommend you use interfaces over type
// aliases. Specifically, because you will get better error
// messages. If you hover over the following errors, you can
// see how TypeScript can provide terser and more focused
// messages when working with interfaces like Chicken.

owl = chicken;
chicken = owl;

// One major difference between type aliases vs interfaces
// are that interfaces are open and type aliases are closed.
// This means you can extend an interface by declaring it
// a second time.

interface Kitten {
  purrs: boolean;
}

interface Kitten {
  colour: string;
}

// In the other case a type cannot be changed outside of
// it's declaration.

type Puppy = {
  color: string;
};

type Puppy = {
  toys: number;
};

// Depending on your goals, this difference could be a
// positive or a negative. However for publicly exposed
// types, it's a better call to make them an interface.

// One of the best resources for seeing all of the edge
// cases around types vs interfaces, this stack overflow
// thread is a good place to start

// https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
