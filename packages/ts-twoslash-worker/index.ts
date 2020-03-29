// import { createDefaultMapFromCDN } from "../typescript-vfs/src";
// import { twoslasher } from "../ts-twoslasher/src";
// import { renderToHTML } from "../gatsby-remark-shiki/src/renderer";

import { createDefaultMapFromCDN } from "typescript-vfs";
import { twoslasher } from "ts-twoslasher";
import { renderToHTML } from "gatsby-remark-shiki/dist/renderer";

const message = postMessage as any;

self.onmessage = function(e) {
  console.log("Message received from main script", e);
  var workerResult = "Result: " + e.data[0] * e.data[1];
  console.log("Posting message back to main script");
  // @ts-ignore
  message(workerResult);
};

// @ts-ignore
self.tty = null;
// @ts-ignore
self.os = null;
debugger;
importScripts("./vs.loader.js");

// @ts-ignore
const re = self.require as any;

re.config({
  paths: {
    vs: "https://typescript.azureedge.net/cdn/3.7.3/monaco/min/vs"
  },
  ignoreDuplicateModules: ["vs/language/typescript/tsWorker"]
});

re(["vs/language/typescript/tsWorker"], async () => {
  message("1");
  // This triggers making "ts" available in the global scope
  re(["vs/language/typescript/lib/typescriptServices"], async ts => {
    message("2");
    debugger;
    const mapWithLibFiles = await createDefaultMapFromCDN(
      { target: ts.ScriptTarget.ES2016 },
      "3.7.3",
      true,
      ts
    );
    // const mapWithLibFiles = new Map();
    message("3");

    // prettier-ignore
    const newResults = twoslasher("// hello", "tsx", ts, undefined, mapWithLibFiles)
    const codeAsFakeShikiTokens = newResults.code
      .split("\n")
      .map(line => [{ content: line }]);

    const html = renderToHTML(codeAsFakeShikiTokens, {}, newResults);
    message(html);
  });
});
