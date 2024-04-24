interface Shape {}
declare function getShape(): Shape

// TODO: Feel up for a challenge, remove the extra comments
//       below to get a raised exception from TS

interface PaintOptions {
  shape: Shape
  xPos?: number
  // //  ^
  yPos?: number
  // //  ^
}

// ---cut---
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos
  //              ^?
  let yPos = opts.yPos
  //              ^?
  // ...
}
