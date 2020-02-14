// @ts-check

const nodeFetch = require("node-fetch").default
const { writeFileSync, readFileSync } = require("fs")
const { join } = require("path")
const { getAllTODOFiles, toMarkdown } = require("./makeMarkdownOfTranslations")
const Octokit = require("@octokit/rest")

const languages = {
  ja: 220,
  pt: 233,
  es: 232,
}

const go = async () => {
  const octokit = Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: "TS Lang Issue Updater",
  })

  const langs = Object.keys(languages)

  for (let index = 0; index < langs.length; index++) {
    const lang = langs[index]
    const issueNumber = languages[lang]

    const files = getAllTODOFiles(lang)
    const body = toMarkdown(files)

    await octokit.issues.update({
      owner: "Microsoft",
      repo: "TypeScript-Website",
      issue_number: issueNumber,
      body,
    })
  }
}

go()
