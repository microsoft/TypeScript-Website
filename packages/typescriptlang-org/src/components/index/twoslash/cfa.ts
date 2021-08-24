// twoslash: { themes: ["min-dark", "../../../packages/typescriptlang-org/lib/themes/typescript-beta-dark"] }
const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }]

const jon = users.find(u => u.name === "jon")

if (jon) {
  console.log(jon)
} else {
  throw new Error('Could not find user "Jon"')
}
