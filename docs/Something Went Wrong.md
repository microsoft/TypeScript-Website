### Where to look if something goes wrong

The site is a static site, but today it's still being hosted on a server we own.

The last time [there was an outage](https://github.com/microsoft/TypeScript-Website/issues/385) it was because a deploy wasn't atomically updated. Let's look at how you could debug that.

### Access You Need

- You need to have access to the ["TypeScript - Public Facing Services"](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/asset/Microsoft_Azure_Billing/Subscription/subscriptions/57bfeeed-c34a-4ffd-a06b-ccff27ac91b8) subscription in Azure

### Places to read logs

We're currently running on App Service, the places where you can find info:

- Look at the [deploy logs](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/99160d5b-9289-4b66-8074-ed268e739e8e/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/TypeScript-1ebb3390-2634-4956-a955-eab987b7bb25/vstscd).

- We have 7 day retention of [server logs](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/99160d5b-9289-4b66-8074-ed268e739e8e/resourceGroups/Default-Web-WestUS/providers/Microsoft.Web/sites/TypeScript-1ebb3390-2634-4956-a955-eab987b7bb25/logStream). Generally speaking, they probably aren't useful and would probably get hammered to the 35MB per day pretty quickly anyway.

### Deployment

The build to deploy train normally looks like this:

- `v2` branch gets pushed:
- A deploy is made to azure blob storage via [`.github/workflows/v2-merged-staging.yml`](https://github.com/microsoft/TypeScript-website/blob/v2/.github/workflows/v2-merged-staging.yml)
- Every Monday, a deploy is made from v2 to the production app via [`.github/workflows/deploy-prod.yml`](https://github.com/microsoft/TypeScript-website/blob/v2/.github/workflows/deploy-prod.yml)

You can deploy `v2` to production anytime via the ["Run workflow" button here](https://github.com/microsoft/TypeScript-Website/actions?query=workflow%3A%22Monday+Website+Push+To+Production%22), so if you have an emergency commit - it goes to `v2` then you can run the action.

App Service apps are configured by [`Web.config`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/static/Web.config). [Here's a reference on the format](https://hangouts.google.com/call/H553wrJ9d97l2LMpNh9hAEEE). I've seen files (`*.json` & `*.manifest`) be 404s on the site because they were not in the config.

Check the build logs, they are always in [GitHub Actions](https://github.com/microsoft/TypeScript-Website/actions)
