// You can test it by running
// yarn danger pr https://github.com/microsoft/TypeScript-Website/pull/115

import { danger, message, markdown } from "danger"
// import { basename } from "path"
// import spellcheck from "danger-plugin-spellcheck"
import lighthouse from "danger-plugin-lighthouse"
import { readFileSync } from "fs"

// Spell check all the things
// spellcheck({ settings: "artsy/peril-settings@spellcheck.json" })

export default () => {
  // JSON reference: https://github.com/haya14busa/github-actions-playground/runs/987846369
  const contextText = readFileSync(process.env.GITHUB_CONTEXT, "utf8")
  const context = JSON.parse(contextText)

  const repo = { owner: context.event.repository.owner.login, repo: context.event.repository.name }
  const prNumber = context.event.workflow_run.pull_requests[0].number
  console.log(repo)

  console.log(process.env.PR_DEPLOY_URL_ROOT)

  const changedFiles = getChangedFiles(prNumber)
  console.log(changedFiles)

  // Print out the PR url
  const deployURL = process.env.PR_DEPLOY_URL_ROOT
  message(
    `Deployed to [a PR branch](${deployURL}) - [playground](${deployURL}/play) [tsconfig](${deployURL}/tsconfig) [old handbook](${deployURL}/docs/handbook/integrating-with-build-tools.html)`
  )

  lighthouse()
}

const getChangedFiles = async (prNumber: number) => {
  const repo = { owner: "microsoft", name: "TypeScript-website" }

  // https://developer.github.com/v3/pulls/#list-pull-requests-files
  const options = danger.github.api.pulls.listFiles.endpoint.merge({ ...repo, pull_number: prNumber })

  /** @type { import("@octokit/rest").PullsListFilesResponseItem[]} */
  const files = await danger.github.api.paginate(options)
  const fileStrings = files.map(f => `/${f.filename}`)
  return fileStrings
}

// // Look for new snapshots and show in a HTML table
// const snapshots = danger.git.fileMatch("packages/typescriptlang-org/_tests/backstop_data/bitmaps_reference/*.png")
// if (snapshots.modified) {
//   const oldSha = danger.github.pr.base.sha
//   const newSha = danger.github.pr.head.sha

//   const tables = snapshots.getKeyedPaths().modified.map(p => {
//     const oldURL = `https://raw.githubusercontent.com/microsoft/TypeScript-Website/${oldSha}/${p}`
//     const newURL = `https://raw.githubusercontent.com/microsoft/TypeScript-Website/${newSha}/${p}`

//     return `
// ###### \`${basename(p)}\`

// Before             |  After
// :-------------------------:|:-------------------------:
// ![](${oldURL})  |  ![](${newURL})
// `
//   })

//   markdown(`## Snapshots updated\n\n ${tables.join("\n\n")}`)
// }
