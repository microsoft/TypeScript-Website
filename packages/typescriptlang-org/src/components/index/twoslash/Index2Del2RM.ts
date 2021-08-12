// twoslash: { themes: ["../../../packages/typescriptlang-org/lib/themes/typescript-beta-light"] }
// codefence: {1}
type Result = "pass" | "fail"

function verify(result: Result) {
  //                    ^^^^^^^^
  if (result === "pass") {
    console.log("Passed")
  } else {
    console.log("Failed")
  }
}
