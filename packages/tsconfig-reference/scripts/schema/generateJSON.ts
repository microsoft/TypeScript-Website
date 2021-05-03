// @ts-check
// Data-dump all the CLI options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/schema/generateJSON.ts
     yarn ts-node scripts/cli/generateJSON.ts
     yarn workspace tsconfig-reference generate:json:schema
*/
console.log("TSConfig Ref: JSON schema");

import { read as readMarkdownFile } from "gray-matter";
import { CommandLineOptionBase } from "../types";
import { writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";
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
const schemaWatchOpts =
  schemaBase.definitions.watchOptionsDefinition.properties.watchOptions.properties;
const schemaBuildOpts =
  schemaBase.definitions.buildOptionsDefinition.properties.buildOptions.properties;

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
  if (okToSkip.includes(name)) return;
  const sectionsPath = join(__dirname, `../../copy/en/options/${name}.md`);

  let section;
  if (schemaCompilerOpts[name]) section = schemaCompilerOpts;
  if (schemaWatchOpts[name]) section = schemaWatchOpts;
  if (schemaBuildOpts[name]) section = schemaBuildOpts;

  if (!section) {
    const title = `Issue creating JSON Schema for tsconfig`;
    const headline = `Could not find '${name}' in schemaBase.definitions - it needs to either be in compilerOptions / watchOptions / buildOptions`;
    const msg = `You need to add it to the file: packages/tsconfig-reference/scripts/schema/vendor/base.json - something like:

            "${name}": {
              "description": "${option.description.message}",
              "type": "boolean",
              "default": false
            },

You're also going to need to make the new Markdown file for the compiler flag, run:

\n    echo '---\\ndisplay: "${option.name}"\\noneline: "Does something"\\n---\\n${option.description.message}\\n ' > ${sectionsPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n
    `;

    throw new Error([title, headline, msg, ""].join("\n\n"));
  } else {
    let optionFile;

    try {
      optionFile = readMarkdownFile(sectionsPath);
    } catch (error) {
      // prettier-ignore
      throw new Error(
        `\n    echo '---\\ndisplay: "${option.name}"\\noneline: "Does something" \\n---\\n${option.description.message.replace("'", "`")}\\n ' > ${sectionsPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n`
      );
    }

    // Set the plain version
    section[name].description = optionFile.data.oneline;

    // Can be removed once https://github.com/ExodusMovement/schemasafe/pull/146 is merged
    const isEnumOrConst = section[name]["enum"];
    if (isEnumOrConst) return;

    // See the vscode extensions here:
    // https://github.com/microsoft/vscode/blob/197f453aa9560872370e4b8e4b3b2f9a93c4ad68/src/vs/base/common/jsonSchema.ts#L56

    // This doesn't pass the schema validation checks yet
    // if (deprecated.includes(name)) schemaCompilerOpts[name].deprecationMessage = "Deprecated";

    // Set a markdown version which is prioritised in vscode, giving people
    // the chance to click on the links.
    section[name].markdownDescription =
      optionFile.data.oneline + `\n\nSee more: https://www.typescriptlang.org/tsconfig#${name}`;
  }
});

writeJSON("schema.json", schemaBase);
