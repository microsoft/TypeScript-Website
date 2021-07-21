import { withPrefix } from "gatsby"

export const getPlaygroundUrls = () => {
  // This will get switched out in CI by:
  // scripts/cacheBustPlayground.mjs

  // This should always be a single slash string in the codebase: "/"
  const commitPrefix = "/06a0e64/"

  return {
    sandboxRoot: withPrefix(`/js${commitPrefix}sandbox`),
    playgroundRoot: withPrefix(`/js${commitPrefix}playground`),
  }
}
