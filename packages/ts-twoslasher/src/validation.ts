import { TwoslashError } from "./"

/** To ensure that errors are matched up right */
export function validateCodeForErrors(
  relevantErrors: import("typescript").Diagnostic[],
  handbookOptions: { errors: number[] },
  extension: string,
  originalCode: string,
  vfsRoot: string
) {
  const inErrsButNotFoundInTheHeader = relevantErrors.filter(e => !handbookOptions.errors.includes(e.code))
  const errorsFound = Array.from(new Set(inErrsButNotFoundInTheHeader.map(e => e.code))).join(" ")

  if (inErrsButNotFoundInTheHeader.length) {
    const errorsToShow = new Set(relevantErrors.map(e => e.code))
    const codeToAdd = `// @errors: ${Array.from(errorsToShow).join(" ")}`

    const missing = handbookOptions.errors.length
      ? `\nThe existing annotation specified ${handbookOptions.errors.join(" ")}`
      : "\nExpected: " + codeToAdd

    // These get filled by below
    const filesToErrors: Record<string, import("typescript").Diagnostic[]> = {}
    const noFiles: import("typescript").Diagnostic[] = []

    inErrsButNotFoundInTheHeader.forEach(d => {
      const fileRef = d.file?.fileName && d.file.fileName.replace(vfsRoot, "")
      if (!fileRef) noFiles.push(d)
      else {
        const existing = filesToErrors[fileRef]
        if (existing) existing.push(d)
        else filesToErrors[fileRef] = [d]
      }
    })

    const showDiagnostics = (title: string, diags: import("typescript").Diagnostic[]) => {
      return (
        `${title}\n  ` +
        diags
          .map(e => {
            const msg = typeof e.messageText === "string" ? e.messageText : e.messageText.messageText
            return `[${e.code}] ${e.start} - ${msg}`
          })
          .join("\n  ")
      )
    }

    const innerDiags: string[] = []
    if (noFiles.length) {
      innerDiags.push(showDiagnostics("Ambient Errors", noFiles))
    }
    Object.keys(filesToErrors).forEach(filepath => {
      innerDiags.push(showDiagnostics(filepath, filesToErrors[filepath]))
    })

    const allMessages = innerDiags.join("\n\n")

    const newErr = new TwoslashError(
      `Errors were thrown in the sample, but not included in an errors tag`,
      `These errors were not marked as being expected: ${errorsFound}. ${missing}`,
      `Compiler Errors:\n\n${allMessages}`
    )

    newErr.code = `## Code\n\n'''${extension}\n${originalCode}\n'''`
    throw newErr
  }
}

/** Mainly to warn myself, I've lost a good few minutes to this before */
export function validateInput(code: string) {
  if (code.includes("// @errors ")) {
    throw new TwoslashError(
      `You have '// @errors ' (with a space)`,
      `You want '// @errors: ' (with a colon)`,
      `This is a pretty common typo`
    )
  }

  if (code.includes("// @filename ")) {
    throw new TwoslashError(
      `You have '// @filename ' (with a space)`,
      `You want '// @filename: ' (with a colon)`,
      `This is a pretty common typo`
    )
  }
}
