import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"

const paths = [] as string[]
export const addPathToSite = (path: string) => paths.push(path)

export const writeAllPathsToFixture = () => {
  const generated = join(__dirname, "..", "..", "src", "__generated__")
  if (!existsSync(generated)) {
    mkdirSync(generated)
  }

  const allPagesPath = join(generated, "allPages.ts")
  writeFileSync(
    allPagesPath,
    `
// Generated during bootstapping via pathsOnSiteTracker.ts
  
export const allFiles = [${paths
      .map(item => '"' + item.replace(/\\/g, "/") + '",')
      .join("\n")}]`
  )
}
