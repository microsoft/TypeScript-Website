/** @jsxImportSource hastscript */
// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/

/**
 * This sets up:
 *
 *   - language (en, ja, zh, pt, etc)
 *     - Sections
 *       - Top Level Fields
 *       - Compiler Options
 *       - Watch Options
 *
 */

console.log("TSConfig Ref: MD for TSConfig");

import {
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from "fs";
import { join } from "path";
import * as assert from "assert";
import { toHtml } from "hast-util-to-html";
import jsYaml from "js-yaml";
import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { toHast } from "mdast-util-to-hast";
import { toMarkdown } from "mdast-util-to-markdown";
import { frontmatter } from "micromark-extension-frontmatter";
import ts from "typescript";
import { CompilerOptionJSON } from "./generateJSON.js";

import {
  typeAcquisitionCompilerOptNames,
  buildOptionCompilerOptNames,
  watchOptionCompilerOptNames,
  rootOptNames,
  parseMarkdown,
  toMdast,
} from "../tsconfigRules.js";

// @ts-ignore
import options from "../../data/tsconfigOpts.json";
// @ts-ignore
import categories from "../../data/tsconfigCategories.json";
import type { JSX } from "hastscript/jsx-runtime";

const orderedCategories = [
  "Project_Files_0",
  "Type_Checking_6248",
  "Modules_6244",
  "Emit_6246",
  "JavaScript_Support_6247",
  "Editor_Support_6249",
  "Interop_Constraints_6252",
  "Backwards_Compatibility_6253",
  "Language_and_Environment_6254",
  "Compiler_Diagnostics_6251",
  "Projects_6255",
  "Output_Formatting_6256",
  "Completeness_6257",
  "Command_line_Options_6171",
  "Watch_and_Build_Modes_6250",
  "Watch_Options_999",
];

// Makes sure all categories are accounted for in ^
const got = Object.keys(categories).sort();
const expected = orderedCategories.map((c) => c.split("_").pop()).sort();
assert.deepEqual(got, expected, `Expected to find everything in ${orderedCategories}`);

// Extract out everything which doesn't live in compilerOptions
const notCompilerOptions = ["Project_Files_0", "Watch_Options_999"];
const categoriesForCompilerOpts = orderedCategories.filter((c) => !notCompilerOptions.includes(c));

const compilerOptions = options.filter(
  (o) =>
    !typeAcquisitionCompilerOptNames.includes(o.name) &&
    !watchOptionCompilerOptNames.includes(o.name) &&
    !buildOptionCompilerOptNames.includes(o.name) &&
    !rootOptNames.includes(o.name)
);

// The TSConfig Reference is a collection of sections which have options or
// a collection of categories which have options
const sections = [
  { name: "Top Level", options: rootOptNames },
  {
    name: "compilerOptions",
    categories: categoriesForCompilerOpts,
  },
  { name: "watchOptions", options: watchOptionCompilerOptNames, idPrefix: "watch" },
  { name: "typeAcquisition", options: typeAcquisitionCompilerOptNames, idPrefix: "type" },
];

const languages = readdirSync(new URL("../../copy", import.meta.url)).filter(
  (f) => !f.startsWith(".")
);

languages.forEach((lang) => {
  const locale = new URL(`../../copy/${lang}/`, import.meta.url);
  const fallbackLocale = new URL("../../copy/en/", import.meta.url);

  const getPathInLocale = (
    path: string,
    optionalExampleContent?: string,
    failable = false
  ) => {
    if (existsSync(new URL(path, locale))) return new URL(path, locale);
    if (existsSync(new URL(path, fallbackLocale)))
      return new URL(path, fallbackLocale);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    if (!failable)
      // prettier-ignore
      throw new Error("Could not find a path for " + path + " in " + localeDesc + " " + optionalExampleContent || "");
  };

  // Make a JSON dump of the category anchors someone wrapping the markdown
  const allCategories = [] as {
    display: string;
    anchor: string;
    options: { name: string; anchor: string }[];
  }[];

  const optionsSummary = [] as {
    display: string;
    oneliner: string;
    id: string;
    categoryID: string;
    categoryDisplay: string;
  }[];

  const tree = (
    <>
      {...sections.map((section) => {
        const children: JSX.Element[] = [];
        const sectionCategories = section.categories || [section.name];
        sectionCategories.forEach((categoryID) => {
          // We need this to look up the category ID
          const category = Object.values(
            categories as { [code: string]: ts.DiagnosticMessage }
          ).find((c: any) => c.key === categoryID);
          let categoryName = categoryID;

          if (category) {
            const categoryPath = getPathInLocale(
              join("categories", categoryID + ".md")
            );
            const doc = readFileSync(categoryPath);
            const tree = fromMarkdown(doc, {
              extensions: [frontmatter()],
              mdastExtensions: [frontmatterFromMarkdown()],
            });
            const yaml = tree.children.find(
              (yaml): yaml is typeof yaml & { type: "yaml" } =>
                yaml.type === "yaml"
            );
            const data = jsYaml.load(yaml!.value);

            assert.ok(
              data.display,
              "No display data for category: " + categoryID
            ); // Must have a display title in the front-matter
            categoryName = data.display;

            // Let the title change its display but keep the same ID
            const title = (
              <h2 id={categoryID}>
                <a
                  href={`#${categoryID}`}
                  name={categoryID}
                  aria-label={`Link to the section ${categoryName}`}
                  aria-labelledby={categoryID}
                >
                  #
                </a>
                {categoryName}
              </h2>
            );

            children.push(
              <div class="category">
                {title}
                {tree as never}
              </div>
            );
          }

          // Pull out their options for the section
          const optionsForCategory = section.options
            ? section.options
                .map((opt) => {
                  const richOpt = options.find((o) => o.name === opt);
                  // if (!richOpt) throw new Error(`Could not find an option for ${opt} in ${section.name}`);
                  return richOpt;
                })
                .filter(Boolean)
            : compilerOptions.filter((o) => o.categoryCode === category.code);

          // prettier-ignore
          assert.ok(optionsForCategory, "Could not find options for " + categoryID + " in " + JSON.stringify(categories));

          const localisedOptions = [] as { name: string; anchor: string }[];

          optionsForCategory.forEach((option) => {
            const optionName = option.name;
            const optionUID = section.idPrefix
              ? `${section.idPrefix}-${option.name}`
              : option.name;

            const mdPath = join("options", optionName + ".md");
            const scopedMDPath = join(
              "options",
              section.name,
              optionName + ".md"
            );

            const fullPath = new URL(
              `../../copy/${lang}/${mdPath}`,
              import.meta.url
            );
            const exampleOptionContent = `\n\n\n Run:\n    echo '---\\ndisplay: "${optionName}"\\noneline: "Does something"\\n---\\n${option.description?.message}\\n' > ${fullPath}\n\nThen add some docs and run: \n>  yarn workspace tsconfig-reference build\n\n`;

            const optionPath = getPathInLocale(
              mdPath,
              exampleOptionContent,
              true
            );
            const scopedOptionPath = getPathInLocale(
              scopedMDPath,
              exampleOptionContent,
              true
            );

            const doc = readFileSync(scopedOptionPath || optionPath);
            const tree = fromMarkdown(doc, {
              extensions: [frontmatter()],
              mdastExtensions: [frontmatterFromMarkdown()],
            });
            const yaml = tree.children.find(
              (yaml): yaml is typeof yaml & { type: "yaml" } =>
                yaml.type === "yaml"
            );
            const data = jsYaml.load(yaml!.value);

            // Must have a display title in the front-matter
            // prettier-ignore
            assert.ok(data.display, "Could not find a 'display' for option: " + optionName + " in " + lang);
            // prettier-ignore
            assert.ok(data.oneline, "Could not find a 'oneline' for option: " + optionName + " in " + lang);

            optionsSummary.push({
              id: optionName,
              display: data.display,
              oneliner: toHtml(toHast(fromMarkdown(data.oneline))),
              categoryID: categoryID,
              categoryDisplay: categoryName,
            });

            // Let the title change its display but keep the same ID
            const titleLink = (
              <a
                aria-label={`Link to the compiler option: ${optionName}`}
                id={optionUID}
                href={`#${optionUID}`}
                name={optionUID}
                aria-labelledby={`${optionUID}-config`}
              >
                #
              </a>
            );
            const title = (
              <h3 id={`${optionUID}-config`}>
                {titleLink} {data.display} - <code>{optionName}</code>
              </h3>
            );

            // Make a markdown table of the important metadata
            const mdTableRows = [] as [string, (string | string[])?][];

            if (option.deprecated) mdTableRows.push(["Deprecated"]);

            if (option.recommended) mdTableRows.push(["Recommended"]);

            if (option.internal) {
              mdTableRows.push(["Internal"]);
            }

            if (option.defaultValue) {
              mdTableRows.push(["Default", option.defaultValue]);
            }

            if (option.allowedValues) {
              mdTableRows.push(["Allowed", option.allowedValues]);
            }

            if (option.related) {
              const optionValue = option.related.map(
                (r) =>
                  `<a href='#${r}' aria-label="Jump to compiler option info for ${r}" ><code>${r}</code></a>`
              );
              mdTableRows.push(["Related", optionValue]);
            }

            if (option.releaseVersion) {
              const underscores = option.releaseVersion.replace(".", "-");
              const link = `/docs/handbook/release-notes/typescript-${underscores}.html`;
              mdTableRows.push([
                "Released",
                `<a aria-label="Release notes for TypeScript ${option.releaseVersion}" href="${link}">${option.releaseVersion}</a>`,
              ]);
            }

            const table = (
              <ul class="compiler-option-md">
                {...mdTableRows.map(([name, value]) =>
                  value === undefined ? (
                    <li>
                      <span>{name}.</span>
                    </li>
                  ) : (
                    <li>
                      <span>{name}:</span>
                      {parseMarkdown(value)}
                    </li>
                  )
                )}
              </ul>
            );

            children.push(
              <section class="compiler-option">
                {title}

                {/* Make a flexbox container for the table and content */}
                <div class="compiler-content">
                  <div class="markdown">{tree as never}</div>

                  {scopedOptionPath ? undefined : table}
                </div>
              </section>
            );

            localisedOptions.push({
              anchor: optionName,
              name: data.display,
            });
          });

          allCategories.push({
            display: categoryName,
            anchor: categoryID,
            options: localisedOptions,
          });
        });

        // Intro to the section
        const sectionsPath = getPathInLocale(
          join("sections", section.name + ".md")
        );
        const doc = readFileSync(sectionsPath);
        const tree = fromMarkdown(doc);

        // Heh, the section uses an article and the categories use a section
        return (
          <div class="tsconfig raised main-content-block markdown">
            <article id={section.name}>
              {tree as never}

              {
                // Show a sticky sub-nav for the categories
                sectionCategories.length === 1 ? undefined : (
                  <nav id="sticky">
                    <ul>
                      {...sectionCategories.map((categoryID) => {
                        const categoryPath = getPathInLocale(
                          join("categories", categoryID + ".md")
                        );
                        const doc = readFileSync(categoryPath);
                        const tree = fromMarkdown(doc, {
                          extensions: [frontmatter()],
                          mdastExtensions: [frontmatterFromMarkdown()],
                        });
                        const yaml = tree.children.find(
                          (yaml): yaml is typeof yaml & { type: "yaml" } =>
                            yaml.type === "yaml"
                        );
                        const data = jsYaml.load(yaml!.value);

                        return (
                          <li>
                            <a href={`#${categoryID}`}>{data.display}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                )
              }

              <div>{...children}</div>
            </article>
          </div>
        );
      })}
    </>
  );

  // Write the Markdown and JSON
  tree.children = tree.children.flatMap((child) => toMdast(child) as never);
  const markdown = toMarkdown(tree as never, { handlers: { yaml: () => "" } });
  const mdPath = new URL(`../../output/${lang}.md`, import.meta.url);
  writeFileSync(mdPath, markdown);

  writeFileSync(
    new URL(`../../output/${lang}.json`, import.meta.url),
    JSON.stringify({ categories: allCategories })
  );

  // This is used by the playground
  writeFileSync(
    new URL(`../../output/${lang}-summary.json`, import.meta.url),
    JSON.stringify({ options: optionsSummary })
  );

  const jsonDir = new URL(
    "../../../typescriptlang-org/static/js/json/",
    import.meta.url
  );
  if (!existsSync(jsonDir)) mkdirSync(jsonDir);

  // This is used by the tsconfig popups
  writeFileSync(
    new URL(`${lang}-tsconfig-popup.json`, jsonDir),
    JSON.stringify(
      Object.fromEntries(optionsSummary.map((data) => [data.id, data.oneliner]))
    )
  );
});

writeFileSync(
  new URL("../../output/languages.json", import.meta.url),
  JSON.stringify({ languages })
);

console.log(`Wrote TSConfig files for: ${languages.join(", ")}}`);
