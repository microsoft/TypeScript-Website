import fs from "fs"

const toChange = "src/components/HeadSEO.tsx"
const content = fs
  .readFileSync(toChange, "utf8")
  .replace("const staging = false", "const staging = true")

fs.writeFileSync(toChange, content)
