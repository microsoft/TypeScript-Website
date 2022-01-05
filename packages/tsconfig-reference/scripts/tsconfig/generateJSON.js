// @ts-check
// Data-dump all the TSConfig options
/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/tsconfig/generateJSON.ts
     yarn ts-node packages/tsconfig-reference/scripts/tsconfig/generateJSON.ts
*/
console.log("TSConfig Ref: JSON for TSConfig");
import ts from "typescript";
import { writeFileSync } from "fs";
import prettier from "prettier";
import { denyList, relatedTo, deprecated, internal, defaultsForOptions, recommended, allowedValues, configToRelease, additionalOptionDescriptors, } from "../tsconfigRules.js";
const toJSONString = (obj) => prettier.format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) => writeFileSync(new URL(`../../data/${name}`, import.meta.url), toJSONString(obj));
const writeString = (name, text) => writeFileSync(new URL(`../../data/${name}`, import.meta.url), prettier.format(text, { filepath: name }));
// These are all
const options = [
    // @ts-ignore
    ...ts.optionDeclarations,
    // @ts-ignore
    ...ts.optionsForWatch,
    // @ts-ignore
    ...ts.buildOpts,
    // @ts-ignore
    ...ts.typeAcquisitionDeclarations,
].filter((item, pos, arr) => arr.indexOf(item) == pos);
const categories = new Set();
// Cut down the list
const filteredOptions = options
    .filter((o) => !denyList.includes(o.name))
    .filter((o) => !o.isCommandLineOnly);
// The import from TS isn't 'clean'
const buildOpts = ["build", "verbose", "dry", "clean", "force"];
// @ts-ignore
const watchOpts = [...ts.optionsForWatch.map((opt) => opt.name), "watch"];
// We don't get structured data for all compiler flags (especially ones which aren't in 'compilerOptions')
// so, create these manually.
const topLevelTSConfigOptions = [
    {
        name: "files",
        type: "list",
        categoryCode: 0,
        // @ts-ignore
        description: {
            message: "Print names of files part of the compilation.",
        },
        defaultValue: "false",
        hostObj: "top_level",
    },
    {
        name: "include",
        type: "list",
        categoryCode: 0,
        // @ts-ignore
        description: {
            message: "Print names of files part of the compilation.",
        },
        defaultValue: "false",
        hostObj: "top_level",
    },
    {
        name: "exclude",
        type: "list",
        categoryCode: 0,
        // @ts-ignore
        description: {
            message: "Print names of files part of the compilation.",
        },
        defaultValue: "false",
        hostObj: "top_level",
    },
    {
        name: "extends",
        type: "string",
        categoryCode: 0,
        // @ts-ignore
        description: {
            message: "Print names of files part of the compilation.",
        },
        defaultValue: "false",
        hostObj: "top_level",
    },
    {
        name: "references",
        type: "string",
        categoryCode: 0,
        // @ts-ignore
        description: {
            message: "Print names of files part of the compilation.",
        },
        defaultValue: "false",
        hostObj: "top_level",
    },
];
const allOptions = [...topLevelTSConfigOptions, ...filteredOptions].sort((l, r) => l.name.localeCompare(r.name));
allOptions.forEach((option) => {
    const name = option.name;
    // Convert JS Map types to a JSONable obj
    if ("type" in option && typeof option.type === "object" && "get" in option.type) {
        // Option definitely has a map obj, need to resolve it
        const newOptions = {};
        option.type.forEach((v, k) => (newOptions[k] = v));
        // @ts-ignore
        option.type = newOptions;
    }
    // Convert categories to be something which can be looked up
    if ("category" in option) {
        categories.add(option.category);
        option.categoryCode = option.category.code;
        option.category = undefined;
    }
    else if (option.name in additionalOptionDescriptors) {
        // Set category code manually because some options have no category
        option.categoryCode = additionalOptionDescriptors[option.name].categoryCode;
    }
    // If it's got related fields, set them
    const relatedMetadata = relatedTo.find((a) => a[0] == name);
    if (relatedMetadata) {
        option.related = relatedMetadata[1];
    }
    if (deprecated.includes(name)) {
        option.deprecated = "Deprecated";
    }
    if (internal.includes(name)) {
        option.internal = true;
    }
    if (recommended.includes(name)) {
        option.recommended = true;
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
    if (buildOpts.includes(name))
        option.hostObj = "build";
    else if (watchOpts.includes(name))
        option.hostObj = "watchOptions";
    else
        option.hostObj = "compilerOptions";
    // Remove irrelevant properties
    delete option.shortName;
    delete option.showInSimplifiedHelpView;
});
writeJSON("tsconfigOpts.json", allOptions);
// Improve the typing for the rules
writeString("_types.ts", `// __auto-generated__ \n\n export type CompilerOptionName = '${options
    .map((o) => o.name)
    .join("' | '")}'`);
const categoryMap = {};
categories.forEach((c) => (categoryMap[c.code] = c));
// Add custom categories, for custom compiler flags
categoryMap["0"] = {
    code: 0,
    category: 3,
    key: "Project_Files_0",
    message: "Project File Management",
};
categoryMap["999"] = {
    code: 999,
    category: 4,
    key: "Watch_Options_999",
    message: "Watch Options",
};
writeJSON("tsconfigCategories.json", categoryMap);
// @ts-ignore - Print the defaults for a TS Config file
const defaults = ts.defaultInitCompilerOptions;
writeJSON("tsconfigDefaults.json", defaults);
