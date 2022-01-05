//  yarn workspace tsconfig-reference generate:msbuild:schema
console.log("TSConfig Ref: JSON for MSBuild");
import parser from "xml-js";
import { readFileSync, writeFileSync } from "fs";
import prettier from "prettier";
const toJSONString = (obj) => prettier.format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) => writeFileSync(new URL(`../../data/${name}`, import.meta.url), toJSONString(obj));
const targetsXMLText = readFileSync(new URL("./Microsoft.TypeScript.targets", import.meta.url), "utf8");
const targetJSONtext = parser.xml2json(targetsXMLText, {
    compact: true,
    spaces: 4,
});
const targets = JSON.parse(targetJSONtext);
const config = targets.Project.PropertyGroup.find((f) => { var _a; return (_a = f.TypeScriptBuildConfigurations) === null || _a === void 0 ? void 0 : _a.length; });
if (!config) {
    throw new Error(`Could not find the: <PropertyGroup Condition="'$(TypeScriptBuildConfigurations)' == ''"> in the Microsoft.TypeScript.targets`);
}
const skip = ["TypeScriptCodePage", "TypeScriptExperimentalAsyncFunctions", "TypeScriptOutFile"];
const json = config.TypeScriptBuildConfigurations.map((config) => {
    const tscCLIName = config._text.includes("--") && config._text.trim().slice(2).split("--")[1].split(" ")[0];
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
