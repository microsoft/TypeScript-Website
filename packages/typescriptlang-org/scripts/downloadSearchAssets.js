// @ts-check

// Ensure Algolia info is up to date

const nodeFetch = require("node-fetch").default
const { writeFileSync } = require("fs")
const { join } = require("path")

const getFileAndStoreLocally = async (url, path, editFunc) => {
  const editingFunc = editFunc ? editFunc : text => text
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.text()
  writeFileSync(join(__dirname, "..", path), editingFunc(contents), "utf8")
}

const go = async () => {
  await getFileAndStoreLocally(
    "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js",
    "static/js/docsearch.js",
    js => {
      const fixAriaByDroppingCustomText = js.replace(
        'aria-label="Link to the result"',
        ""
      )

      const fixTabbing = fixAriaByDroppingCustomText.replace(
        'context.selectionMethod==="click"',
        'context.selectionMethod === "click" || context.selectionMethod === "tabKey"'
      )

      const echoResultsToScreenReaders = fixTabbing.replace(
        'this.trigger("cursorMoved",updateInput)',
        'this.trigger("cursorMoved", updateInput); $el.parent().children().forEach(s => s.setAttribute("role", undefined)); console.log($el); ; $el.find(".algolia-docsearch-suggestion--wrapper").attr("role", "alert");'
      )
      return echoResultsToScreenReaders
    }
  )
  // Remove the mapping reference
  await getFileAndStoreLocally(
    "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css",
    "static/css/docsearch.css",
    css => {
      return css.replace("/*# sourceMappingURL=docsearch.min.css.map */", "")
    }
  )
}

go()
