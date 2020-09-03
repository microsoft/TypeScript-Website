// @ts-check

/* Creates a markdown summary of the last week's worth of analytics,
 * run with:
    APP_INSIGHTS_ID="X" APP_INSIGHTS_API_KEY="Y" node packages/typescriptlang-org/scripts/makeMarkdownForAppInsights.js
  */

const nodeFetch = require("node-fetch").default
const querystring = require("querystring")

// Get these from: https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/57bfeeed-c34a-4ffd-a06b-ccff27ac91b8/resourceGroups/typescriptlang-org/providers/microsoft.insights/components/TypeScriptLang-Prod-Ai/apiKeys
if (!process.env.APP_INSIGHTS_ID)
  throw new Error("No App Insights ID at process.env.APP_INSIGHTS_ID")

if (!process.env.APP_INSIGHTS_API_KEY)
  throw new Error("No App Insights ID at process.env.APP_INSIGHTS_API_KEY")

const getJSON = async (query, params) => {
  const headers = {
    "x-api-key": process.env.APP_INSIGHTS_API_KEY,
  }

  const queryParams = querystring.stringify(params)
  const root = `https://api.applicationinsights.io/v1/apps/${process.env.APP_INSIGHTS_ID}`
  const href = `${root}${query}?${queryParams}`
  const response = await nodeFetch(href, { headers })

  if (!response.ok) {
    console.error("Error in API call to app insights")
    console.error(response)
  }

  const json = await response.json()
  return json
}

const makeQuery = query => getJSON("/query", { query })

const makeAToSitePath = path =>
  `<a href='https://www.typescriptlang.org/${path}'><code>${path}</code></a>`

const makeAToPlaygroundSample = path =>
  `<a href='https://www.staging-typescript.org/play/#example/${path}'>${path}</a>`

const makeAnchorAsNPMModule = path =>
  `<a href='https://www.npmjs.com/package/${path}'>${path}</a>`

const makeMarkdownOfWeeklyAppInsightsInfo = async () => {
  const mds = []
  // You'll be looking at this stuff and think? Err how do I make these complex queries.
  //
  // It's actually pretty trivial, you do it all in the portal, then there is a button to get it:
  // "Run last query in logs view" (it's like 9 dots, then a speech bubble above the bar graph)
  // Which gives you the exact query for the data you see.

  mds.push(
    `Hello! This is an always updating GitHub Issue which pulls out the last week of interesting eco-system analytics from the TypeScript website and makes it available for everyone. If you have ideas for things you'd like to see in here, feel free to comment. Microsoft staff can find the [PM focused version here](https://dev.azure.com/devdiv/DevDiv/_dashboards/dashboard/bf4dee3f-7c4b-42b0-805b-670de64052e5).`
  )

  const likedPages = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(1d)  | where iif('*' in ("Liked Page"), 1==1, name in ("Liked Page")) | where customDimensions["slug"] startswith "/" ; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["slug"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )

  const mostLikedPages = likedPages.tables[0].rows
  mds.push(`#### Most liked/disliked pages`)
  mds.push(`###### Liked`)
  mds.push(
    mostLikedPages
      .map(e => "- " + makeAToSitePath(e[0]) + ` (${e[1]})`)
      .join("\n")
  )

  const dislikedPagesTable = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(1d)  | where iif('*' in ("Disliked Page"), 1==1, name in ("Disliked Page")) | where customDimensions["slug"] startswith "/" ; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["slug"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )

  const mostdisLikedPages = dislikedPagesTable.tables[0].rows
  mds.push(`###### Disliked`)
  mds.push(
    mostdisLikedPages
      .map(e => "- " + makeAToSitePath(e[0]) + ` (${e[1]})`)
      .join("\n")
  )

  const usedExamples = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(7d)  | where iif('*' in ("Read Playground Example"), 1==1, name in ("Read Playground Example")) | where true; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["id"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )
  const examples = usedExamples.tables[0].rows
    .sort((a, b) => b[1] - a[1])
    .filter(a => a[0] !== "Other")

  mds.push(`#### Playground Examples`)
  mds.push(
    examples.map(e => makeAToPlaygroundSample(e[0]) + ` (${e[1]})`).join(" - ")
  )

  const playgroundPluginsTable = await makeQuery(`let mainTable = union customEvents
| where timestamp > ago(7d)
| where iif('*' in ("Added Registry Plugin"), 1==1, name in ("Added Registry Plugin"))
| where true;
let byTable = mainTable;
let queryTable = ()
{
    byTable
    | extend dimension = customDimensions["id"]
    | extend dimension = iif(isempty(dimension), "<undefined>", dimension)
};
let byCohortTable = queryTable
| project dimension, timestamp;
let topSegments = byCohortTable
| summarize Events = count() by dimension
| top 10 by Events
| summarize makelist(dimension);
let topEventMetrics = byCohortTable
| where dimension in (topSegments);
let otherEventUsers = byCohortTable
| where dimension !in (topSegments)
| extend dimension = "Other";
otherEventUsers
| union topEventMetrics
| summarize Events = count() by dimension
| order by dimension asc`)

  const plugins = playgroundPluginsTable.tables[0].rows
    .sort((a, b) => b[1] - a[1])
    .filter(a => a[0] !== "Other")

  mds.push(`#### Playground Plugins`)
  mds.push(
    plugins.map(e => makeAnchorAsNPMModule(e[0]) + ` (${e[1]})`).join("\n - ")
  )

  const today = new Date()
  mds.push(
    `This was last updated ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}. Created with [this script](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/scripts/makeMarkdownForAppInsights.js).`
  )

  return mds.join("\n\n")
}

// @ts-ignore
if (!module.parent) {
  makeMarkdownOfWeeklyAppInsightsInfo().then(console.log)
}

module.exports = { makeMarkdownOfWeeklyAppInsightsInfo }

// const requests = await getJSON("/metrics/requests/count", {
//   timespan: "P7D",
//   interval: "P1D",
// })
// console.log(requests)

// const liked = await getJSON("/events/customEvents", {
//   timespan: "P7D",
//   $search: "Liked Page",
//   $count: true,
// })
// console.log(liked)
