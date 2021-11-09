/** @jsxImportSource hastscript */
// @ts-check
// Data-dump all the TSConfig options

/** Run with:
     node --inspect-brk ./node_modules/.bin/ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts
     yarn ts-node --project packages/tsconfig-reference/tsconfig.json packages/tsconfig-reference/scripts/generateMarkdown.ts 
*/
console.log("TSConfig Ref: MD for CLI Opts");

import { writeFileSync, readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import jsYaml from "js-yaml";
import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { toMarkdown } from "mdast-util-to-markdown";
import { frontmatter } from "micromark-extension-frontmatter";
import { CompilerOptionJSON } from "./generateJSON.js";
import { parseMarkdown, toMdast } from "../tsconfigRules.js";

// @ts-ignore
import cliOpts from "../../data/cliOpts.json";
import type { JSX } from "hastscript/jsx-runtime";

const knownTypes: Record<string, string> = {};

const languages = readdirSync(new URL("../../copy", import.meta.url)).filter(
  (f) => !f.startsWith(".")
);

languages.forEach((lang) => {
  const locale = new URL(`../../copy/${lang}/`, import.meta.url);
  const fallbackLocale = new URL("../../copy/en/", import.meta.url);

  const getPathInLocale = (path: string, optionalExampleContent?: string) => {
    if (existsSync(new URL(path, locale))) return new URL(path, locale);
    if (existsSync(new URL(path, fallbackLocale)))
      return new URL(path, fallbackLocale);
    const en = new URL(path, fallbackLocale);

    const localeDesc = lang === "en" ? lang : `either ${lang} or English`;
    // prettier-ignore
    throw new Error(
      "Could not find a path for " + path + " in " + localeDesc + (optionalExampleContent || "") + `\n\nLooked at ${en}}`
    );
  };

  function renderTable(
    title: string,
    options: typeof cliOpts[keyof typeof cliOpts],
    opts?: { noDefaults: true }
  ) {
    const children: JSX.Element[] = [];
    options.forEach((option, index) => {
      // Heh, the section uses an article and the categories use a section

      // CLI description
      let description = option.description?.message;
      try {
        const sectionsPath = getPathInLocale(
          join("options", option.name + ".md")
        );
        const doc = readFileSync(sectionsPath);
        const tree = fromMarkdown(doc, {
          extensions: [frontmatter()],
          mdastExtensions: [frontmatterFromMarkdown()],
        });
        const yaml = tree.children.find(
          (yaml): yaml is typeof yaml & { type: "yaml" } => yaml.type === "yaml"
        );
        const data = jsYaml.load(yaml!.value);
        description = data.oneline;
      } catch (error) {
        try {
          const sectionsPath = getPathInLocale(
            join("cli", option.name + ".md")
          );
          const doc = readFileSync(sectionsPath);
          const tree = fromMarkdown(doc, {
            extensions: [frontmatter()],
            mdastExtensions: [frontmatterFromMarkdown()],
          });
          const yaml = tree.children.find(
            (yaml): yaml is typeof yaml & { type: "yaml" } =>
              yaml.type === "yaml"
          );
          const data = jsYaml.load(yaml!.value);
          description = data.oneline;
        } catch (error) {}
      }

      const oddEvenClass = index % 2 === 0 ? "odd" : "even";

      const name = option.isTSConfigOnly ? (
        <a href={`/tsconfig/#{option.name}`}>--{option.name}</a>
      ) : (
        "--" + option.name
      );

      let optType: string;
      if (typeof option.type === "string") {
        optType = `\`${option.type}\``;
      } else if (option.allowedValues) {
        if ("ListFormat" in Intl) {
          // @ts-ignore
          const or = new Intl.ListFormat(lang, { type: "disjunction" });
          optType = or.format(
            option.allowedValues.map((v) =>
              v.replace(/^[-.0-9_a-z]+$/i, "`$&`")
            )
          );
        } else {
          optType = option.allowedValues
            .map((v) => v.replace(/^[-.0-9_a-z]+$/i, "`$&`"))
            .join(", ");
        }
      } else {
        optType = "";
      }
      children.push(
        <tr class={oddEvenClass} name={option.name}>
          <td>
            <code>{name}</code>
          </td>
          <td>{parseMarkdown(optType)}</td>
          {opts?.noDefaults ? undefined : (
            <td>{option.defaultValue && parseMarkdown(option.defaultValue)}</td>
          )}
        </tr>
      );

      // Add a new row under the current one for the description, this uses the 'odd' / 'even' classes
      // to fake looking like a single row
      children.push(
        <tr class={`option-description ${oddEvenClass}`}>
          <td colspan="3">{fromMarkdown(description) as never}</td>
        </tr>
      );
    });
    return (
      <>
        <h3>{title}</h3>

        <table class="cli-option" width="100%">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Type</th>
              {opts?.noDefaults ? undefined : <th>Default</th>}
            </tr>
          </thead>
          <tbody>{...children}</tbody>
        </table>
      </>
    );
  }

  const tree = (
    <>
      {renderTable("CLI Commands", cliOpts.cli, { noDefaults: true })}
      {renderTable("Build Options", cliOpts.build, { noDefaults: true })}
      {renderTable("Watch Options", cliOpts.watch, { noDefaults: true })}
      {renderTable("Compiler Flags", cliOpts.options)}
    </>
  );

  // Write the Markdown and JSON
  tree.children = tree.children.flatMap((child) => toMdast(child) as never);
  const markdown = toMarkdown(tree as never);
  const mdPath = new URL(`../../output/${lang}-cli.md`, import.meta.url);
  writeFileSync(mdPath, markdown);
});

languages.forEach((lang) => {
  const mdCLI = new URL(`../../output/${lang}-cli.md`, import.meta.url);
  // prettier-ignore
  const compOptsPath = new URL(`../../../documentation/copy/${lang}/project-config/Compiler Options.md`, import.meta.url);

  if (existsSync(compOptsPath)) {
    const md = readFileSync(compOptsPath, "utf8");
    const newTable = readFileSync(mdCLI, "utf8");
    const start = "<!-- Start of replacement  -->";
    const end = "<!-- End of replacement  -->";
    const newMD = md.split(start)[0] + start + newTable + end + md.split(end)[1];
    writeFileSync(compOptsPath, newMD);
  }
});
