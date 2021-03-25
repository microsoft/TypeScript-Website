// @ts-check
// Data-dump all the CLI options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/cli/generateJSON.ts
     yarn ts-node scripts/cli/generateJSON.ts
*/
console.log("Generating JSON schema");

import * as ts from "typescript";
import { read as readMarkdownFile } from "gray-matter";
import { CommandLineOptionBase } from "../types";
import { writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";
import {
  deprecated,
  internal,
  defaultsForOptions,
  allowedValues,
  configToRelease,
} from "../tsconfigRules";
import { CompilerOptionName } from "../../data/_types";

const toJSONString = (obj) => format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) => writeFileSync(join(__dirname, "result", name), toJSONString(obj));

export interface CompilerOptionJSON extends CommandLineOptionBase {
  releaseVersion?: string;
  allowedValues?: string[];
  categoryCode?: number;
  related?: string[];
  deprecated?: string;
  internal?: true;
  recommended?: true;
  defaultValue?: string;
  hostObj: string;
}

const schemaBase = require("./vendor/base.json") as typeof import("./vendor/base.json");
const tsconfigOpts = require(join(__dirname, "../../data/tsconfigOpts.json"))
  .options as CompilerOptionJSON[];

// Cut down the list
const filteredOptions = tsconfigOpts
  // .filter((o) => !denyList.includes(o.name as CompilerOptionName))
  .filter((o) => "description" in o);

const schemaCompilerOpts =
  schemaBase.definitions.compilerOptionsDefinition.properties.compilerOptions.properties;

const okToSkip = [
  "exclude",
  "explainFiles",
  "extends",
  "files",
  "include",
  "out",
  "references",
  "typeAcquisition",
];

filteredOptions.forEach((option) => {
  const name = option.name as CompilerOptionName;

  if (!schemaCompilerOpts[name]) {
    if (okToSkip.includes(name)) return;

    // throw new Error(`Could not find ${name} in the schema base`);
  } else {
    const sectionsPath = join(__dirname, `../../copy/en/options/${name}.md`);
    const optionFile = readMarkdownFile(sectionsPath);

    // Set the plain version
    schemaCompilerOpts[name].description = optionFile.data.oneline;

    // See the vscode extensions here:
    // https://github.com/microsoft/vscode/blob/197f453aa9560872370e4b8e4b3b2f9a93c4ad68/src/vs/base/common/jsonSchema.ts#L56
    if (deprecated.includes(name)) schemaCompilerOpts[name].deprecationMessage = "Deprecated";

    // Set the vscode extension
    schemaCompilerOpts[name].markdownDescription =
      optionFile.data.oneline + `\n\nSee more: https://www.typescriptlang.org/tsconfig#${name}`;
  }
});

writeJSON("schema.json", schemaBase);
