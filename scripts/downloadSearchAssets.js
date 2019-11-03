// @ts-check

const axios = require('axios').default;
const {writeFileSync} = require("fs")

const getFileAndStoreLocally = async (url, path) => {
  const packageJSON = await axios({ url })
  const contents = packageJSON.data
  writeFileSync(path, contents, "utf8")
}

const go = async () => {
  await getFileAndStoreLocally("https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js", "src/assets/javascript/docsearch.js")
  await getFileAndStoreLocally("https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css", "src/assets/stylesheets/docsearch.css")
}

go()
