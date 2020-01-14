// @ts-check

/* Run with 

  node packages/typescriptlang-org/lib/themes/themeGen.js

*/

// https://color.a11y.com/ContrastPair/?bgcolor=ffffff

const colors = {
  black: "#000000",
  white: "#FFFFFF",
  identifier: "#1a1a1a",
  veryBrightBlue: "#0000FF",
  veryDarkBlue: "#000080",
  mutedGreenAA: "#09835A",
  mutedBlueAAA: "#0451A5",
  darkGreenAA: "#008000",
  darkGreenAAA: "#036705",
  lightBurgendyAAA: "#A31515",
  burgendyAAA: "#811f3f",
  darkBurgendyAAA: "#800000",
  brightRedAAA: "#AF0B08",
}

const lightTheme = {
  name: "Light Visual Studio",
  settings: [
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold",
      },
    },
    {
      scope: [
        "meta.var-single-variable.expr.ts",
        "variable",
        "meta.definition.variable.ts",
        "meta.function-call.ts",
      ],
      settings: {
        foreground: colors.identifier,
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: colors.veryDarkBlue,
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: colors.veryDarkBlue,
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: colors.darkGreenAA,
      },
    },

    {
      scope: "constant.language",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "constant.numeric",
      settings: {
        foreground: colors.mutedGreenAA,
      },
    },
    {
      scope: "constant.regexp",
      settings: {
        foreground: colors.burgendyAAA,
      },
    },
    {
      scope: [
        "constant.other.color.rgb-value.css",
        "constant.numeric.color.rgb-value.scss",
        "constant.other.rgb-value.css",
      ],
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      name: "css tags in selectors, xml tags",
      scope: "entity.name.tag",
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "entity.name.selector",
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "#DC0000",
      },
    },
    {
      scope: [
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.class.mixin.css",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.parent-selector.css",
        "entity.other.attribute-name.pseudo-class.css",
        "entity.other.attribute-name.pseudo-element.css",

        "source.css.less entity.other.attribute-name.id",

        "entity.other.attribute-name.attribute.scss",
        "entity.other.attribute-name.scss",
      ],
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: colors.brightRedAAA,
      },
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: colors.veryDarkBlue,
      },
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: colors.mutedGreenAA,
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: colors.lightBurgendyAAA,
      },
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      scope: [
        "beginning.punctuation.definition.quote.markdown",
        "beginning.punctuation.definition.list.markdown",
      ],
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "meta.selector",
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      name: "brackets of XML/HTML tags",
      scope: "punctuation.definition.tag",
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      scope: "meta.preprocessor",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: colors.lightBurgendyAAA,
      },
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: colors.mutedGreenAA,
      },
    },
    {
      scope: "meta.structure.dictionary.key.python",
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      scope: "storage",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "storage.modifier",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "string",
      settings: {
        foreground: colors.lightBurgendyAAA,
      },
    },
    {
      scope: [
        "string.comment.buffered.block.jade",
        "string.quoted.jade",
        "string.interpolated.jade",

        "string.unquoted.plain.in.yaml",
        "string.unquoted.plain.out.yaml",
        "string.unquoted.block.yaml",
        "string.quoted.single.yaml",

        "string.quoted.double.xml",
        "string.quoted.single.xml",
        "string.unquoted.cdata.xml",

        "string.quoted.double.html",
        "string.quoted.single.html",
        "string.unquoted.html",

        "string.quoted.single.handlebars",
        "string.quoted.double.handlebars",
      ],
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: colors.burgendyAAA,
      },
    },
    {
      name: "JavaScript string interpolation ${}",
      scope: [
        "punctuation.definition.template-expression.begin.ts",
        "punctuation.definition.template-expression.end.ts",
      ],
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: [
        "support.property-value",
        "meta.property-value.css support",
        "meta.property-value.scss support",
      ],
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      scope: [
        "support.type.property-name.css",
        "support.type.property-name.variable.css",
        "support.type.property-name.media.css",
        "support.type.property-name.less",
        "support.type.property-name.scss",
      ],
      settings: {
        foreground: colors.brightRedAAA,
      },
    },
    {
      scope: "support.type.property-name",
      settings: {
        foreground: colors.mutedBlueAAA,
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: colors.black,
      },
    },
    {
      scope: ["keyword.operator.new", "keyword.operator.expression"],
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: colors.mutedGreenAA,
      },
    },
    {
      scope: [
        "punctuation.section.embedded.metatag.begin.php",
        "punctuation.section.embedded.metatag.end.php",
      ],
      settings: {
        foreground: colors.darkBurgendyAAA,
      },
    },
    {
      name: "this.self",
      scope: "variable.language",
      settings: {
        foreground: colors.veryBrightBlue,
      },
    },
  ],
}

const { writeFileSync } = require("fs")
const { join } = require("path")
const { format } = require("prettier")

const betaLightPath = join(__dirname, "typescript-beta-light.json")

// prettier-ignore
const jsonString = format(JSON.stringify(lightTheme), { filepath: betaLightPath, })
writeFileSync("typescript-beta-light.json", jsonString)

console.log("Updated ", betaLightPath)
