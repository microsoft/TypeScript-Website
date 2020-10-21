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
  zh: 296,
  ko: 910,
  id: 938,
  uk: 1149,
  pl: 1235,
}

const go = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: "TS Lang Issue Updater",
  })

  const langs = Object.keys(languages)

  for (let index = 0; index < langs.length; index++) {
    const lang = langs[index]
    const issueNumber = languages[lang]

    const files = getAllTODOFiles(lang)
    const header = `Hi! This issue is for keeping track of the localization effort for \`${lang}+"\`. You can learn about the whole roadmap in #100. If you see an un-ticked area below, that means there isn't an version of that file in this language.\n\n`
    const body = header + toMarkdown(files)

    console.log("Updating: ", issueNumber)
    await octokit.issues.update({
      owner: "Microsoft",
      repo: "TypeScript-Website",
      issue_number: issueNumber,
      body,
    })
  }
}

go()
