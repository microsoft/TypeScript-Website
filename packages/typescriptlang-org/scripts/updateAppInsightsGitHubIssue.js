// @ts-check

// Uses the App Insights API to grab useful analytics

// See: https://dev.applicationinsights.io/reference/get-events
//      https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/57bfeeed-c34a-4ffd-a06b-ccff27ac91b8/resourceGroups/typescriptlang-org/providers/microsoft.insights/components/TypeScriptLang-Prod-Ai/events
//

const {
    makeMarkdownOfWeeklyAppInsightsInfo,
  } = require("./makeMarkdownForAppInsights")
  const Octokit = require("@octokit/rest")
  
  // Get this from OneNote
  if (!process.env.GITHUB_TOKEN)
    throw new Error("No GitHub Token at process.env.GITHUB_TOKEN")
  
  const go = async () => {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: "TS AppInsights Issue Updater",
    })
  
    const md = await makeMarkdownOfWeeklyAppInsightsInfo()
  
    await octokit.issues.update({
      owner: "Microsoft",
      repo: "TypeScript-Website",
      issue_number: 1014,
      body: md,
    })
  }
  
  go()