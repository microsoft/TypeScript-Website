export const getExampleSourceCode = async (prefix: string, lang: string, exampleID: string) => {
  try {
    const site = `${document.location.protocol}//${document.location.host}${prefix}`
    const examplesTOCHref = `${site}/js/examples/${lang}.json`
    const res = await fetch(examplesTOCHref)
    if (!res.ok) {
      console.error('Could not fetch example TOC for lang: ' + lang)
      return {}
    }

    const toc = await res.json()
    const example = toc.examples.find((e: any) => e.id === exampleID)
    if (!example) {
      // prettier-ignore
      console.error(`Could not find example with id: ${exampleID} in\n// ${document.location.protocol}//${document.location.host}${examplesTOCHref}`)
      return {}
    }

    const exampleCodePath = `${site}/js/examples/${example.lang}/${example.path.join('/')}/${example.name}`
    const codeRes = await fetch(exampleCodePath)
    let code = await codeRes.text()

    // Handle removing the compiler settings stuff
    if (code.startsWith('//// {')) {
      code = code
        .split('\n')
        .slice(1)
        .join('\n')
        .trim()
    }

    return {
      example,
      code,
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}
