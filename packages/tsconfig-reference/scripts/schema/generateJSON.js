// @ts-check
// Data-dump all the CLI options
/** Run with either:
     node ./node_modules/.bin/ts-node-transpile-only  packages/tsconfig-reference/scripts/schema/generateJSON.ts
     yarn ts-node scripts/cli/generateJSON.ts
     yarn workspace tsconfig-reference generate:json:schema
*/
console.log("TSConfig Ref: JSON schema");
import matter from "gray-matter";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import prettier from "prettier";
import ts from "typescript";
const toJSONString = (obj) => prettier.format(JSON.stringify(obj, null, "  "), { filepath: "thing.json" });
const writeJSON = (name, obj) => writeFileSync(new URL(`result/${name}`, import.meta.url), toJSONString(obj));
import schemaBase from "./vendor/base.json";
// @ts-ignore
import tsconfigOpts from "../../data/tsconfigOpts.json";
// Cut down the list
const filteredOptions = tsconfigOpts
    // .filter((o) => !denyList.includes(o.name as CompilerOptionName))
    .filter((o) => "description" in o);
const schemaCompilerOpts = schemaBase.definitions.compilerOptionsDefinition.properties.compilerOptions.properties;
const schemaWatchOpts = schemaBase.definitions.watchOptionsDefinition.properties.watchOptions.properties;
const schemaBuildOpts = schemaBase.definitions.buildOptionsDefinition.properties.buildOptions.properties;
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
    const name = option.name;
    if (okToSkip.includes(name))
        return;
    const sectionsPath = new URL(`../../copy/en/options/${name}.md`, import.meta.url);
    let section;
    if (schemaCompilerOpts[name])
        section = schemaCompilerOpts;
    if (schemaWatchOpts[name])
        section = schemaWatchOpts;
    if (schemaBuildOpts[name])
        section = schemaBuildOpts;
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
    }
    else {
        let optionFile;
        try {
            optionFile = matter.read(fileURLToPath(sectionsPath));
        }
        catch (error) {
            // prettier-ignore
            throw new Error(`\n    echo '---\\ndisplay: "${option.name}"\\noneline: "Does something" \\n---\\n${option.description.message.replace("'", "`")}\\n ' > ${sectionsPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n`);
        }
        // Set the plain version, stripping internal markdown links.
        section[name].description = optionFile.data.oneline.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1');
        // Can be removed once https://github.com/ExodusMovement/schemasafe/pull/146 is merged
        const isEnumOrConst = section[name]["enum"];
        if (isEnumOrConst)
            return;
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
for (const [properties, options] of [
    [schemaCompilerOpts, ts.optionDeclarations],
    [schemaWatchOpts, ts.optionsForWatch],
    [
        schemaBase.definitions.typeAcquisitionDefinition.properties.typeAcquisition
            .properties,
        ts.typeAcquisitionDeclarations,
    ],
]) {
    for (const [name, optionSchema] of Object.entries(properties)) {
        const option = options.find((option) => {
            var _a;
            return option.name === name &&
                ((_a = option.category) === null || _a === void 0 ? void 0 : _a.key) !== "Command_line_Options_6171";
        });
        if (!option) {
            properties[name] = undefined;
        }
        else if (option.type === "list") {
            updateItemsSchema(optionSchema
                .items, option.element.type);
        }
        else {
            updateItemsSchema(optionSchema, option.type);
        }
    }
}
// Update optionSchema or optionSchema.items, depending on whether
// option is a CommandLineOptionOfListType.
function updateItemsSchema(itemsSchema, type) {
    var _a;
    const newEnum = typeof type !== "object" ? undefined : [...type.keys()];
    // Update { enum: ... } if found in itemsSchema.anyOf, or
    // itemsSchema.enum otherwise.
    const enumSchema = (_a = itemsSchema.anyOf) === null || _a === void 0 ? void 0 : _a.find((subschema) => subschema.enum);
    if (!enumSchema) {
        updateEnum(itemsSchema, newEnum);
        return;
    }
    updateEnum(enumSchema, newEnum);
    // Ensure the new values are valid: They either exist in the enum or
    // match a pattern, and update the pattern if not.
    const patterns = itemsSchema
        .anyOf.map((subschema) => {
        const pattern = subschema.pattern;
        return pattern !== undefined && new RegExp(pattern);
    })
        .filter((pattern) => pattern);
    if (newEnum === null || newEnum === void 0 ? void 0 : newEnum.every((newValue) => enumSchema.enum.includes(newValue) ||
        patterns.some((pattern) => pattern.test(newValue))))
        return;
    itemsSchema.anyOf = itemsSchema.anyOf.filter((subschema) => !subschema.pattern);
    if (!newEnum)
        return;
    // Regular expressions are not implicitly anchored.
    const disjunction = newEnum.map((newValue) => [...newValue]
        .map((character) => character === "."
        ? String.raw `\.`
        : character.toUpperCase() === character
            ? character
            : `[${character.toUpperCase()}${character}]`)
        .join(""));
    const pattern = disjunction.length > 1 ? `(?:${disjunction.join("|")})` : disjunction[0];
    itemsSchema.anyOf.push({ pattern: `^${pattern}$` });
}
function updateEnum(schema, newEnum) {
    schema.enum = newEnum === null || newEnum === void 0 ? void 0 : newEnum.map((newValue) => {
        var _a;
        return ((_a = schema.enum) === null || _a === void 0 ? void 0 : _a.find((oldValue) => oldValue.toLowerCase() === newValue)) || newValue;
    });
}
writeJSON("schema.json", schemaBase);
