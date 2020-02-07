/** Takes JS and turns it into markdown */
export const invertCodeToHTML = (code: string) => {
  const newlines = [] as string[]

  enum State {
    InComment,
    InCode,
  }

  let state = State.InComment

  const oldLines = code.split("\n")
  oldLines.forEach((line, index) => {
    // Skip first line
    if (line.startsWith("////")) return

    const isComment = line.startsWith("//")
    const isEmpty = line.trim() === ""
    const nextLineIsComment =
      oldLines[index + 1] && oldLines[index + 1].startsWith("//")

    if (isComment && state === State.InComment) {
      newlines.push(line.slice(2))
      return
    }

    if (isEmpty && state === State.InComment) {
      newlines.push("")
      return
    }

    if (!isComment && state === State.InComment) {
      // Start of code
      state = State.InCode
      newlines.push("<code><pre>")
      newlines.push(line)
      return
    }

    if (isComment && state === State.InCode) {
      if (nextLineIsComment) {
        newlines.push("</pre></code>")

        state = State.InComment
      }
      newlines.push(line)
      return
    }

    newlines.push(line)
  })
  return newlines.join("\n")
}
