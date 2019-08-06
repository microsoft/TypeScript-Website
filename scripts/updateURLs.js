// @ts-enable

/**
 * A script to automatically update the Visual Studio links
 * based on the latest *stable* version of TypeScript shipped
 * to npm.
 */


const axios = require('axios');
const {writeFileSync} = require("fs")

const getLatestNPMPackage = async (name) => {
  const packageJSON = await axios({
    url: `https://registry.npmjs.org/${name}`
  })
  
  return packageJSON.data
}
const getLatestVSExtensions = async () => {
  var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json;api-version=5.2-preview.1;excludeUrls=true',
      'Host': 'marketplace.visualstudio.com',
      'Origin': 'https://marketplace.visualstudio.com',
      'Referer': 'https://marketplace.visualstudio.com/search?term=typescript&target=VS&category=All%20categories&vsVersion=vs2019&sortBy=Relevance',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
      'Content-Length': '1082',
      'Connection': 'keep-alive',
      'X-TFS-Session': 'e16c1b5b-850f-42ee-ab7c-519c79f6e356',
      'X-Requested-With': 'XMLHttpRequest',
      'X-VSS-ReauthenticationAction': 'Suppress',
  };
  
  const query = (name) =>
  `{"assetTypes":["Microsoft.VisualStudio.Services.Icons.Default","Microsoft.VisualStudio.Services.Icons.Branding","Microsoft.VisualStudio.Services.Icons.Small"],"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Ide"},{"filterType":10,"value":"${name}"},{"filterType":12,"value":"37888"}],"direction":2,"pageSize":54,"pageNumber":1,"sortBy":0,"sortOrder":0,"pagingToken":null}],"flags":870}`
  

  const extensionSearchResults = await axios({
    url: 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
    method: 'POST',
    headers: headers,
    data: query("typescript")
  })
  
  if (!extensionSearchResults.data || !extensionSearchResults.data.results) {
    throw new Error("Got a bad response from VS marketplace")
  }

  const extensions = extensionSearchResults.data.results[0].extensions
  const officialExtensions = extensions.filter(e => e.publisher.publisherId === "4f0355d2-4a53-4ab1-a8ea-507f4a333a6f")
  return officialExtensions
}

const go = async () => {
  // curl https://registry.npmjs.org/typescript | jq
  console.log("Grabbing the TypeScript package from NPM, this takes about 10-15s")
  const tsPackage = await getLatestNPMPackage("typescript")
  const latest = tsPackage["dist-tags"].latest

  console.log(`Grabbing the VS TypeScript extension for ${latest} from the marketplace`)
  const extensions = await getLatestVSExtensions()
  const currentExtension = extensions.find(e => e.versions[0].version === latest)
  
  const currentURLs = require("../src/_data/urls")
  
  if (currentExtension) {
    const extensionURL = `https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.${currentExtension.extensionName}`
     currentURLs.vs2017_download  = extensionURL
     currentURLs.vs2019_download  = extensionURL
  }

  writeFileSync("src/_data/urls.json", JSON.stringify(currentURLs, null, "  "))
  console.log(`Updated src/_data/urls.json`)
}

go()
