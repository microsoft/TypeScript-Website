// @ts-check
/* Creates a message of TypeScript website analytics into the TypeScript Team web channel
 *
 * run with:
    APP_INSIGHTS_ID="X" APP_INSIGHTS_API_KEY="Y" node packages/typescriptlang-org/scripts/pingTeamsWithAppInsightData.js

   if process.env.STATS_WEBHOOK_INCOMING_URL is set, then the message will go into teams
  */

const nodeFetch = require("node-fetch").default
const querystring = require("querystring")

const go = async () => {
  const dl = await getDetailsForDownloadIntention()

  // Sessions
  const all = await getCountForSessions()
  const index = await getCountForSessions("Typed JavaScript")
  const playground = await getCountForSessions("Playground")
  const handbook = await getCountForSessions("Handbook")

  const JSinTSPages = [
    "TypeScript: Documentation - JSDoc Reference",
    "TypeScript: Documentation - Migrating from JavaScript",
    "TypeScript: Documentation - Type Checking JavaScript Files",
    "TypeScript: Documentation - Creating .d.ts Files from .js files",
  ]
  const jsInTS = await getCountForQuery(getSessionsInList(JSinTSPages))

  // Users
  const allUsers = await getCountForQuery(getUsersAllPrefixed())

  // https://adaptivecards.io/designer

  const headline = {
    type: "FactSet",
    facts: [
      {
        title: "Sessions",
        value: comma(all),
      },
      {
        title: "Unique Users",
        value: comma(allUsers),
      },
      {
        title: "Homepage Sessions",
        value: comma(index),
      },
    ],
  }

  const homepageSection = makeColumn("Download", {
    All: comma(dl),
  })

  const playgroundSection = makeColumn("Playground Usage", {
    All: comma(playground),
  })

  const handbookSection = makeColumn("Handbook", {
    All: comma(handbook),
  })

  const jsInTSSection = makeColumn("JS in TS", {
    All: comma(jsInTS),
  })

  const card = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.2",
    minHeight: "100px",
    body: [
      headline,
      {
        type: "ColumnSet",
        columns: [
          homepageSection,
          playgroundSection,
          handbookSection,
          jsInTSSection,
        ],
      },
    ],
  }

  if (!process.env.STATS_WEBHOOK_INCOMING_URL) {
    console.log(JSON.stringify(card, null, "  "))
  } else {
    // https://learn.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using#send-adaptive-cards-using-an-incoming-webhook

    const outer = {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          contentUrl: null,
          content: card,
        },
      ],
    }

    const r = await nodeFetch(process.env.STATS_WEBHOOK_INCOMING_URL, {
      method: "post",
      body: JSON.stringify(outer),
      headers: { "Content-Type": "application/json" },
    })
    console.log(r)
  }
}

go()

const makeColumn = (title, data) => {
  const facts = Object.entries(data).map(e => ({ title: e[0], value: e[1] }))
  return {
    type: "Column",
    width: "stretch",
    items: [
      {
        type: "TextBlock",
        text: title,
        wrap: true,
        size: "Medium",
        weight: "Bolder",
        color: "Accent",
      },
      {
        type: "FactSet",
        facts,
      },
    ],
  }
}

// https://adaptivecards.io/designer

async function getJSON(query, params) {
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

async function makeQuery(query) {
  return getJSON("/query", { query })
}

async function getCountForSessions(substr) {
  return getCountForQuery(getSessionsAllPrefixed(substr))
}

async function getCountForQuery(query) {
  const playgroundStats = await makeQuery(query)
  // Hah, yep
  const result = JSON.parse(playgroundStats.tables[0].rows[0][0])[0]
  return result
}

function getSessionsAllPrefixed(prefix) {
  const query = prefix ? `| where name contains "${prefix}"` : ""
  return `
  let mainTable = pageViews
    | where timestamp > ago(7d)
     ${query}
    | where true; let resultTable = mainTable; resultTable
    | make-series Sessions = dcount(session_Id) default = 0 on timestamp from ago(7d) to now() step iff(true, 7d, 7d)
`
}

function getUsersAllPrefixed(prefix) {
  const query = prefix ? `| where name contains "${prefix}"` : ""
  return `
  let mainTable = pageViews
    | where timestamp > ago(7d)
     ${query}
    | where true; let resultTable = mainTable; resultTable
    | make-series Sessions = dcount(user_Id) default = 0 on timestamp from ago(7d) to now() step iff(true, 7d, 7d)
`
}

function getSessionsInList(arr) {
  // prettier-ignore
  const query = `| where iif('*' in ("${arr.join('", "')}") , 1 == 1, name in ("${arr.join('", "')}"))`

  return `
  let mainTable = pageViews
    | where timestamp > ago(7d)
     ${query}
    | where true; let resultTable = mainTable; resultTable
    | make-series Sessions = dcount(session_Id) default = 0 on timestamp from ago(7d) to now() step iff(true, 7d, 7d)
`
}

async function getDetailsForDownloadIntention() {
  const query = `let mainTable = union pageViews, customEvents
      | where timestamp > ago(7d)
      | where iif('*' in ("Copied npm instructions on Index", "TypeScript: How to set up TypeScript"), 1 == 1, name in ("Copied npm instructions on Index", "TypeScript: How to set up TypeScript"))
      | where true; let resultTable = mainTable; resultTable
      | make-series Sessions = dcount(session_Id) default = 0 on timestamp from ago(7d) to now() step iff(true, 7d, 7d)`

  const response = await makeQuery(query)
  return JSON.parse(response.tables[0].rows[0][0])[0]
}

function comma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
