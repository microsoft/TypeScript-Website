// @ts-check

// yarn workspace typescriptlang-org update-versions

const nodeFetch = require("node-fetch").default
const { writeFileSync, existsSync } = require("fs")
const { join, dirname } = require("path")
const semver = require("semver")
const axios = require("axios").default
const { format } = require("prettier")

const get = async url => {
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.text()
  return contents
}

/**
 * Queries the VS marketplace for typescript extensions, returns
 * only official extensions
 */
const getLatestVSExtensions = async latest => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json;api-version=5.2-preview.1;excludeUrls=true",
    Host: "marketplace.visualstudio.com",
    Origin: "https://marketplace.visualstudio.com",
    Referer:
      // prettier-ignore
      `https://marketplace.visualstudio.com/search?term=typescript%20${semver.major(latest)}.${semver.minor(latest)}&target=VS&category=All%20categories&vsVersion=&sortBy=Relevance`,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15",
    "Content-Length": "1082",
    Connection: "keep-alive",
    "X-TFS-Session": "e16c1b5b-850f-42ee-ab7c-519c79f6e356",
    "X-Requested-With": "XMLHttpRequest",
    "X-VSS-ReauthenticationAction": "Suppress",
  }

  const query = name =>
    `{"assetTypes":["Microsoft.VisualStudio.Services.Icons.Default","Microsoft.VisualStudio.Services.Icons.Branding","Microsoft.VisualStudio.Services.Icons.Small"],"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Ide"},{"filterType":10,"value":"${name}"},{"filterType":12,"value":"37888"}],"direction":2,"pageSize":54,"pageNumber":1,"sortBy":0,"sortOrder":0,"pagingToken":null}],"flags":870}`

  const extensionSearchResults = await axios({
    url:
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
    method: "POST",
    headers: headers,
    data: query(`typescript ${semver.major(latest)}.${semver.minor(latest)}`),
  })

  if (!extensionSearchResults.data || !extensionSearchResults.data.results) {
    throw new Error("Got a bad response from VS marketplace")
  }

  const extensions = extensionSearchResults.data.results[0].extensions
  const officialExtensions = extensions.filter(
    e => e.publisher.publisherId === "4f0355d2-4a53-4ab1-a8ea-507f4a333a6f"
  )
  return officialExtensions
}

/** Gets VS Marketplace info for a particular semver */
const getVSInfo = async semver => {
  // console.log(
  //   `Grabbing the VS TypeScript extension for ${semver} from the marketplace`
  // )
  const extensions = await getLatestVSExtensions(semver)
  // console.log(`Found ${extensions.length} extensions`)

  const sortedByVersion = extensions.sort((l, r) =>
    r.versions[0].version.localeCompare(l.versions[0].version)
  )

  // console.log(
  //   `Looking at ${sortedByVersion.map(e => e.versions[0].version).join(", ")}`
  // )

  const currentURLs = {}

  if (sortedByVersion[0]) {
    const extensionURL = `https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.${sortedByVersion[0].extensionName}`
    currentURLs.vs2017_download = extensionURL
    currentURLs.vs2019_download = extensionURL
  }

  return currentURLs
}

/** For example
{
  latest: '3.7.5',
  next: '3.8.0-dev.20200208',
  beta: '3.8.0-beta',
  rc: '3.8.1-rc',
  insiders: '3.7.3-insiders.20191123',
  'tag-for-publishing-older-releases': '3.6.5'
}
 */

const getTypeScriptNPMVersions = async () => {
  const tagsText = await get(
    "https://registry.npmjs.org/-/package/typescript/dist-tags"
  )
  const tags = JSON.parse(tagsText)

  const stable = tags.latest
  const beta = tags.beta
  const rc = tags.rc

  const isRC = semver.gt(rc, stable)
  const isBeta = semver.gt(beta, stable)

  // prettier-ignore
  let siteReleaseNotesURL = `/docs/handbook/release-notes/typescript-${semver.major(stable)}-${semver.minor(stable)}.html`
  // prettier-ignore
  let releasePostURL = `https://devblogs.microsoft.com/typescript/announcing-typescript-${semver.major(rc)}-${semver.minor(rc)}/`
  // prettier-ignore
  let releaseNotesMDPath = `../../documentation/copy/en/release-notes/TypeScript ${semver.major(stable)}.${semver.minor(stable)}.md`
  // prettier-ignore
  let betaPostURL = `https://devblogs.microsoft.com/typescript/announcing-typescript-${semver.major(beta)}-${semver.minor(beta)}-beta/`
  // prettier-ignore
  let rcPostURL = `https://devblogs.microsoft.com/typescript/announcing-typescript-${semver.major(rc)}-${semver.minor(rc)}-rc/`

  // Incase the MD hasn't been ported yet
  const releaseNotesURL = existsSync(join(__dirname, releaseNotesMDPath))
    ? siteReleaseNotesURL
    : releasePostURL

  const next =
    semver.minor(stable) == 9
      ? `${semver.major(stable) + 1}.${semver.minor(stable)}`
      : `${semver.major(stable)}.${semver.minor(stable) + 1}`

  return {
    tags: {
      stableMajMin: `${semver.major(stable)}.${semver.minor(stable)}`,
      stable,
      betaMajMin: `${semver.major(beta)}.${semver.minor(beta)}`,
      beta,
      rc,
      rcMajMin: `${semver.major(rc)}.${semver.minor(rc)}`,
      next,
    },
    isRC,
    isBeta,
    releaseNotesURL,
    betaPostURL,
    rcPostURL,
  }
}

const go = async () => {
  const base = await getTypeScriptNPMVersions()
  const vsStable = await getVSInfo(base.tags.stable)
  const vsBeta = await getVSInfo(base.tags.beta)
  const vsRC = await getVSInfo(base.tags.rc)
  const results = {
    "_generated by":
      "node packages/typescriptlang-org/scripts/getTypeScriptNPMVersions.js",
    ...base,
    vs: {
      stable: vsStable,
      beta: vsBeta,
      rc: vsRC,
    },
  }

  const jsonPath = join(__dirname, "..", "src", "lib", "release-info.json")

  writeFileSync(
    jsonPath,
    format(JSON.stringify(results), { filepath: jsonPath })
  )
}
go()
