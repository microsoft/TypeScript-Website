//  yarn workspace tsconfig-reference generate:msbuild:schema

console.log("TSConfig Ref: JSON for MSBuild");

import parser = require("xml-js");
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";

const toJSONString = (obj) => format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) =>
  writeFileSync(join(__dirname, "..", "..", "data", name), toJSONString(obj));

const targetsXMLText = readFileSync(join(__dirname, "./Microsoft.TypeScript.targets"), "utf8");
const targetJSONtext = parser.xml2json(targetsXMLText, { compact: true, spaces: 4 });
const targets = JSON.parse(targetJSONtext) as import("./types").Target;

const config = targets.Project.PropertyGroup.find((f) => f.TypeScriptBuildConfigurations?.length);
if (!config) {
  throw new Error(
    `Could not find the: <PropertyGroup Condition="'$(TypeScriptBuildConfigurations)' == ''"> in the Microsoft.TypeScript.targets`
  );
}

const skip = ["TypeScriptCodePage", "TypeScriptExperimentalAsyncFunctions", "TypeScriptOutFile"];

const json = config.TypeScriptBuildConfigurations.map((config) => {
  const tscCLIName =
    config._text.includes("--") && config._text.trim().slice(2).split("--")[1].split(" ")[0];
  const configName = config._attributes.Condition.split("(")[1].split(")")[0];

  return {
    tscCLIName,
    configName,
  };
  // Strip additional flags, because it is documented separately
})
  .filter((d) => d.tscCLIName)
  .filter((d) => !skip.includes(d.configName));

writeJSON("msbuild-flags.json", { flags: json });
