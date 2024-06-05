## Getting this Repo Set Up Troubleshooting

#### Module `x` is not built

Sometimes, and it's not been tracked down exactly, some dependencies of the site aren't built even though it says they are. In those cases, re-run `pnpm bootstrap` and `pnpm build` to re-build all the internal site deps.

#### Windows + Watchman

The Windows support for watchman is a bit meh. It's not likely to get better, given how well WSL works now. So, you _could_ use WSL to work around that.

Though, for _a lot_ of changes to the site: Watchman is optional. All the watchman script does is run `pnpm run --filter=[xxyy] build` when you save in a package which is not `typescriptlang-org` (the gatsby website).

To run the site without watchman, use `pnpm run --filter=typescriptlang-org start`.
