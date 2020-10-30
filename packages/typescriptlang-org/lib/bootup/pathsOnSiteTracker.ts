import { writeFileSync } from "fs"
import { join } from "path"

const paths = [] as string[]
export const addPathToSite = (path: string) => paths.push(path)

export const writeAllPathsToFixture = () => {
  // prettier-ignore
  const allPagesPath =  join(__dirname, "..", "..", "src", "__generated__", "allPages.ts")
  writeFileSync(
    allPagesPath,
    `
// Generated during bootstapping via onPostBuild.ts
  
export const allFiles = ["${paths.join('", "')}"]`
  )
}
