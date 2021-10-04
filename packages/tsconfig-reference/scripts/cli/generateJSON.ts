// @ts-check
// Data-dump all the CLI options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/cli/generateJSON.ts
     yarn ts-node scripts/cli/generateJSON.ts
*/
console.log("TSConfig Ref: JSON for CLI Opts");

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

const tsconfigOpts = require(join(__dirname, "../../data/tsconfigOpts.json"))
  .options as CompilerOptionJSON[];

const notCompilerFlags = [
  // @ts-ignore
  ...ts.optionsForWatch,
  // @ts-ignore
  ...ts.buildOpts,
];

// @ts-ignore
const allFlags = ts.optionDeclarations.concat(notCompilerFlags) as CompilerOptionJSON[];
const allOptions = Array.from(new Set(allFlags)).sort((l, r) => l.name.localeCompare(r.name));

// The import from TS isn't 'clean'      
const buildOpts = ["build", "verbose", "dry", "clean", "force"];
// @ts-ignore
const watchOpts = [...ts.optionsForWatch.map((opt) => opt.name), "watch"];

// Cut down the list
const filteredOptions = allOptions
  // .filter((o) => !denyList.includes(o.name as CompilerOptionName))
  .filter((o) => "description" in o);

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
  } else if (typeof option.type === "object") {
    // Group and format synonyms: `es6`/`es2015`
    const byValue: { [value: number]: string[] } = {};
    for (const [name, value] of Object.entries(option.type)) {
      (byValue[value] ||= []).push(name);
    }
    option.allowedValues = Object.values(byValue).map((synonyms) =>
      synonyms.length > 1
        ? synonyms.map((name) => `\`${name}\``).join("/")
        : synonyms[0]
    );
  }

  if (name in configToRelease) {
    option.releaseVersion = configToRelease[name];
  }

  if (name in defaultsForOptions) {
    option.defaultValue = defaultsForOptions[name];
  }

  delete option.shortName;
  delete option.category;

  const inTSConfigOpts = !!tsconfigOpts.find((opt) => opt.name === option.name);

  // @ts-ignore
  const inWatchOrTypeAcquisition = !!ts.optionsForWatch
    // @ts-ignore
    .concat(ts.typeAcquisitionDeclarations)
    .find((opt) => opt.name === option.name);

  option.isTSConfigOnly = inTSConfigOpts || inWatchOrTypeAcquisition;
});

const strippedOpts = filteredOptions.filter(
  (opt) => !buildOpts.includes(opt.name) && !watchOpts.includes(opt.name)
);

writeJSON("cliOpts.json", {
  cli: strippedOpts.filter((opt) => !opt.isTSConfigOnly),
  build: filteredOptions.filter((opt) => buildOpts.includes(opt.name)),
  watch: filteredOptions.filter((opt) => watchOpts.includes(opt.name)),
  options: strippedOpts.filter((opt) => opt.isTSConfigOnly),
});
