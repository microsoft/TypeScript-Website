import path from "path"
import fs from "fs"
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs, withPrefix } from "gatsby"
import { invertCodeToHTML } from "../../utils/invertCodeToHTML"
import { isMultiLingual } from "./languageFilter"

export const createPlaygroundExamplePages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Playground Example Pages`)

  const playPage = path.resolve(`./src/templates/play-example.tsx`)
  const result = await graphql(`
    query GetAllPlaygroundSamples {
      allFile(
        filter: {
          sourceInstanceName: { eq: "all-playground-examples" }
          extension: { in: ["js", "ts"] }
        }
      ) {
        nodes {
          name
          relativePath
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const docs = anyData.allFile.nodes

  // {
  //   "name": "Code Flow",
  //   "relativePath": "vo/JavaScript/JavaScript Essentials/Code Flow.ts"
  // }

  docs.forEach(example => {
    const rPath = example.relativePath
    const name = example.name
    const idize = string =>
      string
        .toLowerCase()
        .replace(/[^\x00-\x7F]/g, "-")
        .replace(/ /g, "-")
        .replace(/\//g, "-")
        .replace(/\+/g, "-")

    const language = rPath.split("/")[0]
    if (!isMultiLingual && language !== "en") return

    const postLangPath = rPath.split("/").slice(1).map(idize).join("/")

    const langPrefix = language === "en" ? "" : language
    const newPagePath = langPrefix + "/play/" + postLangPath

    const appRoot = path.join(__dirname, "..", "..", "..", "..")
    // prettier-ignore
    const exampleCodePath = path.join(appRoot, "playground-examples", "copy", rPath)
    const code = fs.readFileSync(exampleCodePath, "utf8")

    const id = postLangPath.split("/").slice(-1)[0].split(".")[0]

    const { inlineTitle, compilerSettings } = getCompilerDetailsFromCode(code)

    // Intentionally not adding addPathToSite here

    createPage({
      path: newPagePath + ".html",
      component: playPage,
      context: {
        name,
        title: inlineTitle || name,
        lang: language,
        html: invertCodeToHTML(code),
        redirectHref: hrefForExample({ name, compilerSettings, id }, language),
      },
    })
  })
}

const hrefForExample = (
  example: { name: string; compilerSettings: any; id: string },
  lang: string
) => {
  const isJS = example.name.indexOf(".js") !== -1
  const prefix = isJS ? "filetype=js" : ""
  const hash = "example/" + example.id
  const params = example.compilerSettings || {}
  const queryParams = Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&")

  const langURL = lang === "en" ? "" : lang
  return `${langURL}/play/?${prefix + queryParams}#${hash}`
}

const getCompilerDetailsFromCode = (contents: string) => {
  let compilerSettings = {}
  let inlineTitle = undefined

  if (contents.startsWith("//// {")) {
    // convert windows newlines to linux new lines
    const preJSON = contents
      .replace(/\r\n/g, "\n")
      .split("//// {")[1]
      .split("}\n")[0]
    contents = contents.split("\n").slice(1).join("\n")
    const code = "{" + preJSON + "}"

    try {
      const obj = JSON.parse(code)
      if (obj.title) {
        inlineTitle = obj.title
        delete obj.title
      }
      compilerSettings = obj.compiler
    } catch (err) {
      console.error("Issue with: ", code)
      throw err
    }
  }
  return { compilerSettings, inlineTitle }
}
