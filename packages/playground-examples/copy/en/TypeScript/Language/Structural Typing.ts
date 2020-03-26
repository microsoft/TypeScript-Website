// TypeScript is a Structural Type System. A structural type
// system means that when comparing types, TypeScript only
// takes into account the members on the type.

// This is in contrast to nominal type systems, where you
// could create two types but could not assign them to each
// other. See example:nominal-typing

// For example, these two interfaces are completely
// transferrable in a structural type system:

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

// If we add in a type which structurally contains all of
// the members of Ball and Sphere, then it also can be
// set to be a ball or sphere.

interface Tube {
  diameter: number;
  length: number;
}

let tube: Tube = { diameter: 12, length: 3 };

tube = ball;
ball = tube;

// Because a ball does not have a length, then it cannot be
// assigned to the tube variable. However, all of the members
// of Ball are inside tube, and so it can be assigned.

// TypeScript is comparing each member in the type against
// each other to verify their equality.

// A function is an object in JavaScript and it is compared
// in a similar fashion. With one useful extra trick around
// the params:

let createBall = (diameter: number) => ({ diameter });
let createSphere = (diameter: number, useInches: boolean) => {
  return { diameter: useInches ? diameter * 0.39 : diameter };
};

createSphere = createBall;
createBall = createSphere;

// TypeScript will allow (number) to equal (number, boolean)
// in the parameters, but not (number, boolean) -> (number)

// TypeScript will discard the boolean in the first assignment
// because it's very common for JavaScript code to skip passing
// params when they're not needed.

// For example the array's forEach's callback has three params,
// value, index and the full array - if TypeScript didn't
// support discarding parameters, then you would have to
// include every option to make the functions match up:

[createBall(1), createBall(2)].forEach((ball, _index, _balls) => {
  console.log(ball);
});

// No one needs that.

// Return types are treated like objects, and any differences
// are compared with the same object equality rules above.

let createRedBall = (diameter: number) => ({ diameter, color: "red" });

createBall = createRedBall;
createRedBall = createBall;

// Where the first assignment works (they both have diameter)
// but the second doesn't (the ball doesn't have a color).
