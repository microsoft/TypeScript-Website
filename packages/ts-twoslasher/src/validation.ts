import ts from 'typescript'

/** To ensure that errors are matched up right */
export function validateCodeForErrors(
  relevantErrors: ts.Diagnostic[],
  handbookOptions: { errors: number[] },
  extension: string,
  originalCode: string
) {
  const inErrsButNotFoundInTheHeader = relevantErrors.filter(e => !handbookOptions.errors.includes(e.code))
  const errorsFound = inErrsButNotFoundInTheHeader.map(e => e.code).join(' ')
  
  if (inErrsButNotFoundInTheHeader.length) {
    const postfix = handbookOptions.errors.length ? ` - the annotation specified ${handbookOptions.errors}` : ''
    const afterMessage = inErrsButNotFoundInTheHeader
      .map(e => {
        const msg = typeof e.messageText === 'string' ? e.messageText : e.messageText.messageText
        return `[${e.code}] - ${msg}`
      })
      .join('\n  ')

    const codeOutput = `\n\n## Code\n\n'''${extension}\n${originalCode}\n'''`
    throw new Error(
      `Errors were thrown in the sample, but not included in an errors tag: ${errorsFound}${postfix}.\n  ${afterMessage}${codeOutput}`
    )
  }
}

/** Mainly to warn myself, I've lost a good few minutes to this before */
export function validateInput(code: string) {
  if (code.includes('// @errors ')) {
    throw new Error("You have '@errors ' - you're missing the colon after errors")
  }
  if (code.includes('// @filename ')) {
    throw new Error("You have '@filename ' - you're missing the colon after filename")
  }
}
