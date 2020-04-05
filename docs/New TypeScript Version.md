## How to update the TypeScript site for a new version

We'll use 3.9.0 as the example. Note this looks long because there's a lot of explanations, assuming everything compiles then it'll probably take about 15-30m.

### Beta

##### Playground

To add a new version for folks to be able to use

- Create a tag for [3.9.0-beta](https://github.com/orta/make-monaco-builds) in `orta/make-monaco-builds` against the current master.
- Push that tag, then check the [GitHub Actions section](https://github.com/orta/make-monaco-builds/actions) ([Here's 3.9.0's](https://github.com/orta/make-monaco-builds/runs/546571003?check_suite_focus=true))

Then it needs to be added to the dropdown, you can find it here: [`packages/playground/src/index.ts`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/playground/src/index.ts)

```ts
const allVersions = [
  '3.9.0-beta',
  ...sandbox.supportedVersions.filter(f => !notWorkingInPlayground.includes(f)),
  'Nightly',
]
```

_There is a space for this to be automated away entirely in the future, there is enough data in the site's sourcecode to derive this._

##### Site

The website uses one version of TypeScript which you can find in the root `package.json` inside the `resolutions` field. It's always a specific version, so change the version to:

```json
  "resolutions": {
    "typescript": "3.9.0-beta",
  },
```

Then run `yarn install`.

That will update all of the site to use 3.9.0 for building. Run `yarn build` to see if any of the website's code broke.

##### TSConfig Reference

Updating the version of TypeScript will force you to update the TSConfig Reference. It will fail incrementally with each missing compiler flag.

For each new flag:

- Add a markdown file for the new compiler flags. The build will crash and give you a command to run which will set that up.

- Update [tsconfigRules.ts](https://github.com/microsoft/TypeScript-website/blob/v2/packages/tsconfig-reference/scripts/tsconfigRules.ts#L16) - with things like:

  - Default values
  - Linking compiler versions
  - Add a new section to `releaseToConfigsMap` for your version

### RC

Unless something drastic has change, you shouldn't need to do anything. You could run through the playground section for the RC and update the dropdown to be the RC.

### Release

#### Playground

Make a tag for the final version in [`orta/make-monaco-builds`](https://github.com/orta/make-monaco-builds/) e.g. `git tag 3.9.3` and push it up.

Remove the link to the beta in the dropdowns in: [`packages/playground/src/index.ts`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/playground/src/index.ts) because it will be auto-generated now.

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
