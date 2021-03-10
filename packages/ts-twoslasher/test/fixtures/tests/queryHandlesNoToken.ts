type Either2dOr3d = [number, number, number?]

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord
  //           ^?

  console.log(`Provided coordinates had ${coord.length} dimensions`)
  //                                            ^?
}
