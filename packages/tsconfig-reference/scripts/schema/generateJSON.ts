// @ts-check
// Data-dump all the CLI options

/** Run with either:
     node ./node_modules/.bin/ts-node-transpile-only  packages/tsconfig-reference/scripts/schema/generateJSON.ts
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

// @ts-ignore - this isn't public
import { libs } from "typescript";

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

You're also probably going to need to make the new Markdown file for the compiler flag, run:

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

    // Set the plain version, stripping internal markdown links.
    section[name].description = optionFile.data.oneline.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1');

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
      section[name].description + `\n\nSee more: https://www.typescriptlang.org/tsconfig#${name}`;
  }
});

Object.keys(schemaCompilerOpts).forEach((flag) => {
  // There are a few ways that the enums values are shown in a JSON schema
  const viaDirectEnum = schemaCompilerOpts[flag].enum && schemaCompilerOpts[flag];
  const viaAnyOfEnum =
    schemaCompilerOpts[flag].anyOf?.find((member) => member.enum) && schemaCompilerOpts[flag].anyOf;

  const viaItemAnyOfEnum =
    schemaCompilerOpts[flag].items?.anyOf?.find((member) => member.enum) &&
    schemaCompilerOpts[flag].items?.anyOf;

  // Basically it either has enum, or {enum: []} is in the array
  const host: { enum: string[] } | { enum?: string[] }[] =
    viaDirectEnum || viaAnyOfEnum || viaItemAnyOfEnum;
  if (flag === "lib") {
    debugger;
  }
  if (host) {
    const existingList = "enum" in host ? host.enum : host.find((e) => e.enum).enum;
    const compilerInfo = tsconfigOpts.find((opt) => opt.name === flag);
    const realType = (compilerInfo.type as any) as Record<string, number>;
    const keys = flag === "lib" ? libs : Object.keys(realType);
    const newKeys = keys.filter(
      (k) => !existingList.find((f) => f.toLowerCase() === k.toLowerCase())
    );

    if ("enum" in host) {
      host.enum = existingList.concat(newKeys);
    } else {
      const i = host.findIndex((item) => "enum" in item);
      host[i] = { enum: existingList.concat(newKeys) };
    }
  }
});

writeJSON("schema.json", schemaBase);
