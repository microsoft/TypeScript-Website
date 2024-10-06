// @ts-check
// Data-dump all the CLI options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/cli/generateJSON.ts
     pnpm ts-node scripts/cli/generateJSON.ts
*/
console.log("TSConfig Ref: JSON for CLI Opts");

import ts from "typescript";

import { CommandLineOptionBase } from "../types";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import prettier from "prettier";
import {
  deprecated,
  internal,
  defaultsForOptions,
  allowedValues,
  configToRelease,
} from "../tsconfigRules.js";
import { CompilerOptionName } from "../../data/_types";

const toJSONString = (obj) =>
  prettier.format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) =>
  writeFileSync(new URL(`../../data/${name}`, import.meta.url), toJSONString(obj));
const writeString = (name, text) =>
  writeFileSync(
    new URL(`../../data/${name}`, import.meta.url),
    prettier.format(text, { filepath: name })
  );

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

const tsconfigOpts = JSON.parse(readFileSync(join("data", "tsconfigOpts.json"), "utf8"));

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
  }

  if (name in configToRelease) {
    option.releaseVersion = configToRelease[name];
  }

  if (name in defaultsForOptions) {
    const defaultValue = defaultsForOptions[name];
    option.defaultValue = Array.isArray(defaultValue) ? defaultValue.join(" ") : defaultValue;
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
