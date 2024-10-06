// node ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/schema/downloadSchemaBase.ts

// https://json.schemastore.org/tsconfig.json

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const getFileAndStoreLocally = async (url, path, editFunc) => {
  const editingFunc = editFunc ? editFunc : (text) => text;
  const packageJSON = await fetch(url);
  const contents = await packageJSON.text();
  writeFileSync(new URL(path, import.meta.url), editingFunc(contents), "utf8");
};

getFileAndStoreLocally(
  "https://json.schemastore.org/tsconfig.json",
  "./vendor/base.json",
  undefined
);

// /Users/ortatherox/dev/typescript/new-website/packages/tsconfig-reference/scripts/Users/ortatherox/dev/typescript/new-website/packages/tsconfig-reference/scripts/schema/vendor/base.js
// /Users/ortatherox/dev/typescript/new-website/packages/tsconfig-reference/scripts/schema/vendor/base.json
