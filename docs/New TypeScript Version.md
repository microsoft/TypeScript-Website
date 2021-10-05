## How to update the TypeScript site for a new version

We'll use 3.9.0 as the example. Note this looks long because there's a lot of explanations, assuming everything compiles then it'll probably take about 15-30m.

### Beta

##### Site

The website uses one version of TypeScript which you can find in the root `package.json` inside the `resolutions` field. It's always a specific version, so change the version to:

```json
  "resolutions": {
    "typescript": "3.9.0-beta",
  },
```

Then run `yarn install`.

That will update all of the site to use 3.9.0 for building. Run `yarn build` to see if any of the website's code broke.

You might see issues with yarn patching TypeScript, if so, try run: `yarn set version latest` first to update to the latest yarn.

##### New Handbook Docs

You might have a new reference doc to add, they live in [`packages/documentation/copy`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/documentation/copy). You can ignore languages other than `en`. The folder structure is only for your reference and has no bearing on the site navigation. Each markdown document needs a header like:

```md
---
title: Basic Types
layout: docs
permalink: /docs/handbook/basic-types.html
oneline: "Step one in learning TypeScript: The basic types."
---
```

Or the site will fail the build. Once that file is ready, add it to the sidebar via the file [`packages/documentation/scripts/generateDocsNavigationPerLanguage.js`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/documentation/scripts/generateDocsNavigationPerLanguage.js).

### JSON Schema Updates

The source of truth for the JSON Schema is https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/tsconfig.json

To download a copy of that into our repo to handle new PRs sent to it in-between TS releases, run: `node ./node_modules/.bin/ts-node packages/tsconfig-reference/scripts/schema/downloadSchemaBase.ts`

##### TSConfig Reference

Updating the version of TypeScript will force you to update the TSConfig Reference and JSON Schema. It will fail incrementally with each missing compiler flag.

For each new flag:

- Add a markdown file for the new compiler flags. The build will crash and give you a command to run which will set that up.

- Add the flag to the JSON [schema base file](https://github.com/microsoft/TypeScript-website/blob/v2/packages/tsconfig-reference/scripts/schema/result/schema.json). You can leave descriptions blank in there as it will be added by the site.

- Update [tsconfigRules.ts](https://github.com/microsoft/TypeScript-website/blob/v2/packages/tsconfig-reference/scripts/tsconfigRules.ts#L16) - with things like:

  - Default values
  - Linking compiler versions
  - Add a new section to `releaseToConfigsMap` for your version

#### Playground

The tag should be automatically generated on a [daily basis](https://github.com/microsoft/TypeScript-Make-Monaco-Builds/actions/workflows/nightly_check_prod_deploys.yml) - so you shouldn't have to do anything

##### Tests

Run `yarn test`.

Tests can fail between TS builds, for example snapshot tests in packages which have compiler errors or LSP responses in them.
Run `yarn build; yarn update-test-snapshots` to try auto-update all snapshots, otherwise use `yarn workspace [package_name] test -u` for 1 package.

### RC

Unless something drastic has change, you shouldn't need to do anything. You could run through the playground section for the RC and update the dropdown to be the RC.

### Release

#### Release Notes

Grab the markdown from the [blog posts repo](https://github.com/microsoft/TypeScript-blog-posts), create a file like: `packages/documentation/copy/en/release-notes/TypeScript 3.9.md`

Grab the header info from a previous release notes, and add it to your new version:

```md
---
title: TypeScript 3.9
layout: docs
permalink: /docs/handbook/release-notes/typescript-3-9.html
oneline: TypeScript 3.9 Release Notes
---
```

You can add twoslash to the code samples if you want.

When you're happy with that, then edit [`packages/documentation/copy/en/release-notes/Overview.md](https://github.com/microsoft/TypeScript-website/blob/v2/packages/documentation/copy/en/release-notes/Overview.md) to include the changes you just added, and simplify descriptions.

##### Index

The homepage keeps track of upcoming dates via this file: [`packages/typescriptlang-org/src/lib/release-plan.json`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/lib/release-plan.json)

```json
{
  "_format": "mm/dd/yyyy - these get put into new Date()",
  "upcoming_version": "3.9",
  "iteration_plan_url": "https://github.com/microsoft/TypeScript/issues/37198",
  "last_release_date": "02/20/2020",
  "upcoming_beta_date": "03/20/2020",
  "upcoming_rc_date": "04/24/2020",
  "upcoming_release_date": "05/12/2020"
}
```

You might not have these dates yet, at the current release (it took about a week last time to get the dates) - leaving
this is fine and the site will accommodate the dates not being ready yet.

##### Update Schema Store

Using the GitHub CLI, from the root of the repo

```
# Clone a copy and move in new file
gh repo clone https://github.com/SchemaStore/schemastore.git /tmp/schemastore
cp packages/tsconfig-reference/scripts/schema/result/schema.json /tmp/schemastore/src/schemas/json/tsconfig.json

# Go in and set up the changes
cd /tmp/schemastore
gh repo fork
git add .
git commit -m "Update tsconfig.json schema"

# Validate it didn't break
cd src
npm ci
npm run build

# Shippit
gh pr create --web
```
