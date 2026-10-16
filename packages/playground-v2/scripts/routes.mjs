export const playgroundPath = "/play/"
export const compatibilityPaths = ["play/v2", "play/7", "v2"]
export const compatibilityScript = `location.replace(${JSON.stringify(playgroundPath)} + location.search + location.hash)`

export const compatibilityHtml = `<!doctype html>
<meta charset="utf-8">
<title>TypeScript Playground v2</title>
<script>
  ${compatibilityScript}
</script>
<noscript><a href="${playgroundPath}">Continue to TypeScript Playground v2</a></noscript>
`
