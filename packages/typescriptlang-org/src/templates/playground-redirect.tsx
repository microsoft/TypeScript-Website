import React, { useEffect } from "react"
import { withPrefix } from "gatsby"

type Props = {
  pageContext: { toPath: string }
}

export default function PlaygroundRedirect({ pageContext }: Props) {
  const destination = withPrefix(pageContext.toPath)
  useEffect(() => {
    location.replace(destination + location.search + location.hash)
  }, [destination])

  return (
    <main>
      <a href={destination}>Continue to the TypeScript Playground</a>
    </main>
  )
}
