## Getting this Repo Set Up Troubleshooting

#### Module `x` is not built

Sometimes, and it's not been tracked down exactly, some dependencies of the site aren't built even though it says they are. In those cases, re-run `pnpm bootstrap` and `pnpm build` to re-build all the internal site deps.

For the website itself, `pnpm build` generates its required content and dependencies before building Astro.

#### Local website development

Run `pnpm start` from the repository root. Astro serves the site on port `4321` and reloads site source changes automatically.
