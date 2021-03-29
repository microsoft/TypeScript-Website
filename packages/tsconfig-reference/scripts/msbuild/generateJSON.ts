import parser = require("xml-js");
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const targetsXMLText = readFileSync(join(__dirname, "./Microsoft.TypeScript.targets"), "utf8");
const targetJSONtext = parser.xml2json(targetsXMLText, { compact: true, spaces: 4 });
const targets = JSON.parse(targetJSONtext) as import("./types").Target;

const config = targets.Project.PropertyGroup.find((f) => f.TypeScriptBuildConfigurations?.length);
if (!config) {
  throw new Error(
    `Could not find the: <PropertyGroup Condition="'$(TypeScriptBuildConfigurations)' == ''"> in the Microsoft.TypeScript.targets`
  );
}
config.TypeScriptBuildConfigurations.forEach((config) => {
  const tscCLIName =
    config._text.includes("--") && config._text.trim().slice(2).split("--")[1].split(" ")[0];
  const configName = config._attributes.Condition.split("(")[1].split(")")[0];
  console.log({ tscCLIName, configName });
});

// writeFileSync(join(__dirname, "./thing.json"), sitemapJSON);

// if you configure via a csproj via these flags are available.
