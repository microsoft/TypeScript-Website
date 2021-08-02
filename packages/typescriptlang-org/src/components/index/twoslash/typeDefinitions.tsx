// twoslash: { themes: ["min-dark", "../../../packages/typescriptlang-org/lib/themes/typescript-beta-dark"] }
// @noErrors
// @esModuleInterop
import express from "express"
const app = express()

app.get("/", function (req, res) {
  res.sen
//       ^|
})

app.listen(3000)
