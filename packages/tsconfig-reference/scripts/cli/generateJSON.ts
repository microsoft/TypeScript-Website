// @ts-check
// Data-dump all the CLI options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/cli/generateJSON.ts
     yarn ts-node packages/tsconfig-reference/scripts/cli/generateJSON.ts
*/

import * as ts from "typescript";

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
const writeJSON = (name, obj) =>
  writeFileSync(join(__dirname, "..", "..", "data", name), toJSONString(obj));
const writeString = (name, text) =>
  writeFileSync(join(__dirname, "..", "..", "data", name), format(text, { filepath: name }));

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

debugger;
const allOptions = [
  // @ts-ignore
  ...ts.optionDeclarations,
  // ...ts.commonOptionsWithBuild,
  // @ts-ignore
  ...ts.optionsForWatch,
].sort((l, r) => l.name.localeCompare(r.name)) as CompilerOptionJSON[];

// Cut down the list
const filteredOptions = allOptions
  // .filter((o) => !denyList.includes(o.name as CompilerOptionName))
  .filter((o) => !o.isTSConfigOnly);

filteredOptions.forEach((option) => {
  const name = option.name as CompilerOptionName;

  // Convert JS Map types to a JSONable obj
  if ("type" in option && typeof option.type === "object" && "get" in option.type) {
    // Option definitely has a map obj, need to resolve it
    const newOptions = {};
    option.type.forEach((v, k) => (newOptions[k] = v));
    // @ts-ignore
    option.type = newOptions;
  }

  if (deprecated.includes(name)) {
    option.deprecated = "Deprecated";
  }

  if (internal.includes(name)) {
    option.internal = true;
  }

  if (name in allowedValues) {
    option.allowedValues = allowedValues[name];
  }

  if (name in configToRelease) {
    option.releaseVersion = configToRelease[name];
  }

  if (name in defaultsForOptions) {
    option.defaultValue = defaultsForOptions[name];
  }

  option.hostObj = "compilerOptions";

  delete option.shortName;
  delete option.isTSConfigOnly;
  delete option.description;
  delete option.category;
});

writeJSON("cliOpts.json", {
  options: filteredOptions,
});
