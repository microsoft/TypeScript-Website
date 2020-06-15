// @ts-check

/* Run with 

  node packages/typescriptlang-org/lib/themes/themeGen.js

  These themes bases come from: https://github.com/microsoft/vscode/tree/eb781a2e0a19511458337433ef9cc5b2efb032d5/extensions/theme-defaults/themes
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

const darkTheme = {
  name: "Dark (Visual Studio)",
  tokenColors: [
    {
      settings: {
        foreground: "#D4D4D4",
        background: "#1E1E1E",
      },
    },
    {
      scope: ["meta.embedded", "source.groovy.embedded"],
      settings: {
        foreground: "#D4D4D4",
      },
    },
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
      scope: "header",
      settings: {
        foreground: "#000080",
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: "#6A9955",
      },
    },
    {
      scope: "constant.language",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: [
        "constant.numeric",
        "entity.name.operator.custom-literal.number",
        "variable.other.enummember",
        "keyword.operator.plus.exponent",
        "keyword.operator.minus.exponent",
      ],
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: "constant.regexp",
      settings: {
        foreground: "#646695",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "entity.name.tag.css",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "#9cdcfe",
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
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: "#f44747",
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
        foreground: "#569cd6",
      },
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: "#569cd6",
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
        foreground: "#b5cea8",
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "punctuation.definition.quote.begin.markdown",
      settings: {
        foreground: "#6A9955",
      },
    },
    {
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "#6796e6",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      name: "brackets of XML/HTML tags",
      scope: "punctuation.definition.tag",
      settings: {
        foreground: "#808080",
      },
    },
    {
      scope: ["meta.preprocessor", "entity.name.function.preprocessor"],
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: "meta.structure.dictionary.key.python",
      settings: {
        foreground: "#9cdcfe",
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "storage",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: ["storage.modifier", "keyword.operator.noexcept"],
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: [
        "string",
        "entity.name.operator.custom-literal.string",
        "meta.embedded.assembly",
      ],
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      scope: "string.tag",
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      scope: "string.value",
      settings: {
        foreground: "#ce9178",
      },
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: "#d16969",
      },
    },
    {
      name: "String interpolation",
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      name: "Reset JavaScript string interpolation expression",
      scope: ["meta.template.expression"],
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: [
        "support.type.vendored.property-name",
        "support.type.property-name",
        "variable.css",
        "variable.scss",
        "variable.other.less",
        "source.coffee.embedded",
      ],
      settings: {
        foreground: "#9cdcfe",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.cast",
        "keyword.operator.sizeof",
        "keyword.operator.alignof",
        "keyword.operator.typeid",
        "keyword.operator.alignas",
        "keyword.operator.instanceof",
        "keyword.operator.logical.python",
        "keyword.operator.wordlike",
      ],
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php",
      ],
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: "#9cdcfe",
      },
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      name: "coloring of the Java import and package identifiers",
      scope: [
        "storage.modifier.import.java",
        "variable.language.wildcard.java",
        "storage.modifier.package.java",
      ],
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      name: "this.self",
      scope: "variable.language",
      settings: {
        foreground: "#569cd6",
      },
    },
  ],
}
const { writeFileSync } = require("fs")
const { join } = require("path")
const { format } = require("prettier")

const betaLightPath = join(__dirname, "typescript-beta-light.json")
const betaDarkPath = join(__dirname, "typescript-beta-dark.json")

// prettier-ignore
const lightJsonString = format(JSON.stringify(lightTheme), { filepath: betaLightPath })
writeFileSync(join(__dirname, "typescript-beta-light.json"), lightJsonString)
console.log("Updated ", betaLightPath)

// prettier-ignore
const darkJsonString = format(JSON.stringify(darkTheme), { filepath: betaDarkPath })
writeFileSync(join(__dirname, "typescript-beta-dark.json"), darkJsonString)
console.log("Updated ", betaDarkPath)
