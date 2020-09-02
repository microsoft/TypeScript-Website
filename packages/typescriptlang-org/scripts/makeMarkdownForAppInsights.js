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

const makeMarkdownOfWeeklyAppInsightsInfo = async () => {
  const mds = []
  // You'll be looking at this stuff and think? Err how do I make these complex queries.
  //
  // It's actually pretty trivial, you do it all in the portal, then there is a button to get it:
  // "Run last query in logs view" (it's like 9 dots, then a speech bubble above the bar graph)
  // Which gives you the exact query for the data you see.

  // Start here:

  // https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2F57bfeeed-c34a-4ffd-a06b-ccff27ac91b8%2FresourceGroups%2Ftypescriptlang-org%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2FTypeScriptLang-Prod-Ai/source/AIExtension.UsageWorkbookViewerBlade/timespan/PT24H/query/let%20mainTable%20%3D%20union%20pageViews%2CcustomEvents%20%20%7C%20where%20timestamp%20%3E%20ago(1d)%20%20%7C%20where%20iif('*'%20in%20(%22Liked%20Page%22)%2C%201%3D%3D1%2C%20name%20in%20(%22Liked%20Page%22))%20%7C%20where%20customDimensions%5B%22slug%22%5D%20startswith%20%22%2F%22%20%3B%20let%20byTable%20%3D%20mainTable%3B%20let%20queryTable%20%3D%20()%20%7BbyTable%20%7C%20extend%20dimension%20%3D%20customDimensions%5B%22slug%22%5D%20%7C%20extend%20dimension%20%3D%20iif(isempty(dimension)%2C%20%22%3Cundefined%3E%22%2C%20dimension)%7D%3B%20let%20byCohortTable%20%3D%20queryTable%20%20%7C%20project%20dimension%2C%20timestamp%3B%20%20let%20topSegments%20%3D%20byCohortTable%20%20%7C%20summarize%20Events%20%3D%20count()%20by%20dimension%20%20%7C%20top%2010%20by%20Events%20%20%20%7C%20summarize%20makelist(dimension)%3B%20%20let%20topEventMetrics%20%3D%20byCohortTable%20%20%7C%20where%20dimension%20in%20(topSegments)%3B%20%20let%20otherEventUsers%20%3D%20byCohortTable%20%20%7C%20where%20dimension%20!in%20(topSegments)%20%20%20%7C%20extend%20dimension%20%3D%20%22Other%22%3B%20%20otherEventUsers%20%20%7C%20union%20topEventMetrics%20%20%7C%20summarize%20Events%20%3D%20count()%20by%20dimension%20%20%20%7C%20order%20by%20dimension%20asc/prettify/1
  const likedPages = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(1d)  | where iif('*' in ("Liked Page"), 1==1, name in ("Liked Page")) | where customDimensions["slug"] startswith "/" ; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["slug"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )

  const mostLikedPages = likedPages.tables[0].rows
  mds.push(`#### Most liked/disliked pages`)
  mds.push(`###### Liked`)
  mds.push(
    mostLikedPages
      .map(e => "- " + makeAToSitePath(e[0]) + `(${e[1]})`)
      .join("\n")
  )

  const dislikedPagesTable = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(1d)  | where iif('*' in ("Disliked Page"), 1==1, name in ("Liked Page")) | where customDimensions["slug"] startswith "/" ; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["slug"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )

  const mostdisLikedPages = dislikedPagesTable.tables[0].rows
  mds.push(`###### Disliked`)
  mds.push(
    mostdisLikedPages
      .map(e => "- " + makeAToSitePath(e[0]) + `(${e[1]})`)
      .join("\n")
  )

  const usedExamples = await makeQuery(
    `let mainTable = union pageViews,customEvents  | where timestamp > ago(7d)  | where iif('*' in ("Read Playground Example"), 1==1, name in ("Read Playground Example")) | where true; let byTable = mainTable; let queryTable = () {byTable | extend dimension = customDimensions["id"] | extend dimension = iif(isempty(dimension), "<undefined>", dimension)}; let byCohortTable = queryTable  | project dimension, timestamp;  let topSegments = byCohortTable  | summarize Events = count() by dimension  | top 10 by Events   | summarize makelist(dimension);  let topEventMetrics = byCohortTable  | where dimension in (topSegments);  let otherEventUsers = byCohortTable  | where dimension !in (topSegments)   | extend dimension = "Other";  otherEventUsers  | union topEventMetrics  | summarize Events = count() by dimension   | order by dimension asc`
  )
  const examples = usedExamples.tables[0].rows.sort((a, b) => b[1] - a[1])
  mds.push(`#### Playground Examples`)
  mds.push(
    examples.map(e => makeAToPlaygroundSample(e[0]) + `(${e[1]})`).join(", ")
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
