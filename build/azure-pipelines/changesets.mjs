// Opens or updates the "Version Packages" PR while changesets are pending.
// Once that PR is merged, tags the new versions and creates GitHub releases.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const pipelinePath = "build/azure-pipelines/changesets.yml";
const maxBodyLength = 60000;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

const repository = requiredEnv("GITHUB_REPOSITORY");
const token = requiredEnv("GH_TOKEN");
const botName = "typescript-automation[bot]";
const botEmail = "290192711+typescript-automation[bot]@users.noreply.github.com";
const env = {
  ...process.env,
  GITHUB_TOKEN: token,
  GIT_AUTHOR_NAME: botName,
  GIT_AUTHOR_EMAIL: botEmail,
  GIT_COMMITTER_NAME: botName,
  GIT_COMMITTER_EMAIL: botEmail,
};

function run(command, args, input, extraEnv) {
  console.log(`> ${command} ${args.join(" ")}`);
  return execFileSync(command, args, { env: { ...env, ...extraEnv }, input, encoding: "utf8", stdio: ["pipe", "pipe", "inherit"], maxBuffer: 64 * 1024 * 1024 });
}

function changesetOutput(args) {
  const outputPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "changesets-")), "output");
  process.stdout.write(run("pnpm", ["changeset", ...args], undefined, { CHANGESETS_OUTPUT: outputPath }));
  return fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
}

function githubApi(apiPath, method = "GET", body) {
  const args = ["api", "--method", method, `repos/${repository}/${apiPath}`];
  if (body) args.push("--input", "-");
  return JSON.parse(run("gh", args, body && JSON.stringify(body)));
}

const basicAuth = Buffer.from(`x-access-token:${token}`).toString("base64");
console.log(`##vso[task.setsecret]${basicAuth}`);
function push(args) {
  run("git", ["push", `https://github.com/${repository}.git`, ...args], undefined, {
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${basicAuth}`,
  });
}

// Returns the CHANGELOG.md section for a version, the same section
// changesets/action uses for version PR bodies and release notes.
function getChangelogEntry(packageDir, version) {
  const changelogPath = path.join(packageDir, "CHANGELOG.md");
  if (!fs.existsSync(changelogPath)) return "";

  let fence;
  let depth;
  const content = [];
  for (const line of fs.readFileSync(changelogPath, "utf8").split(/\r?\n/)) {
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = undefined;
    }
    else if (fenceMatch) {
      fence = fenceMatch[1];
    }
    else {
      const heading = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/.exec(line);
      if (heading) {
        if (depth === undefined) {
          if ((heading[2] ?? "").trim() === version) depth = heading[1].length;
          continue;
        }
        if (heading[1].length <= depth) break;
      }
    }
    if (depth !== undefined) content.push(line);
  }
  return content.join("\n").trim();
}

function getPackageDirs() {
  const packages = JSON.parse(run("pnpm", ["list", "--recursive", "--depth", "-1", "--json"]));
  return new Map(packages.map(pkg => [pkg.name, pkg.path]));
}

function tagReleases() {
  const tags = changesetOutput(["git-tag"]).split("\n").filter(Boolean).map(line => JSON.parse(line));
  if (tags.length === 0) return;

  push(tags.map(({ tag }) => `refs/tags/${tag}`));
  const packageDirs = getPackageDirs();
  for (const { tag, packageName } of tags) {
    const version = tag.slice(packageName.length + 1);
    const release = githubApi("releases", "POST", {
      tag_name: tag,
      name: tag,
      body: getChangelogEntry(packageDirs.get(packageName), version),
      prerelease: version.includes("-"),
    });
    console.log(`Created ${release.html_url}`);
  }
}

function createBody(baseBranch, releases, preState, includeEntries) {
  const lines = [
    `This PR was opened by the Changesets pipeline (\`${pipelinePath}\`). When you're ready to do a release, you can merge this and the packages will be published to npm automatically. If you're not ready to do a release yet, that's fine, whenever you add more changesets to ${baseBranch}, this PR will be updated.`,
    "",
  ];
  if (preState?.mode === "pre") {
    lines.push(
      `> [!IMPORTANT]`,
      `> \`${baseBranch}\` is in **pre mode**, so this branch contains prereleases. To exit pre mode, run \`changeset pre exit\` on \`${baseBranch}\`.`,
      "",
    );
  }
  lines.push("# Releases", "");
  if (!includeEntries) {
    lines.push("> The changelog information of each package has been omitted from this message, as the content exceeds the size limit.", "");
  }
  for (const { name, newVersion, entry } of releases) {
    lines.push(`## ${name}@${newVersion}`, "");
    if (includeEntries && entry) lines.push(entry, "");
  }
  return lines.join("\n");
}

function versionPackages(baseBranch, plan) {
  const versionBranch = `changeset-release/${baseBranch}`;
  const title = plan.preState?.mode === "pre" ? `Version Packages (${plan.preState.tag})` : "Version Packages";

  run("git", ["switch", "--force-create", versionBranch]);
  process.stdout.write(run("pnpm", ["changeset", "version"]));
  run("git", ["add", "--all"]);
  run("git", ["-c", "core.hooksPath=/dev/null", "commit", "--message", title]);
  push(["--force", `HEAD:refs/heads/${versionBranch}`]);

  const bumpOrder = ["major", "minor", "patch"];
  const packageDirs = getPackageDirs();
  const releases = plan.releases
    .filter(release => release.type !== "none")
    .sort((a, b) => bumpOrder.indexOf(a.type) - bumpOrder.indexOf(b.type))
    .map(release => ({ ...release, entry: getChangelogEntry(packageDirs.get(release.name), release.newVersion) }));

  let body = createBody(baseBranch, releases, plan.preState, true);
  if (body.length > maxBodyLength) body = createBody(baseBranch, releases, plan.preState, false);

  const [owner] = repository.split("/");
  const query = new URLSearchParams({ state: "open", base: baseBranch, head: `${owner}:${versionBranch}` });
  const [existing] = githubApi(`pulls?${query}`);
  const pr = existing
    ? githubApi(`pulls/${existing.number}`, "PATCH", { title, body })
    : githubApi("pulls", "POST", { base: baseBranch, head: versionBranch, title, body });
  console.log(`${existing ? "Updated" : "Created"} ${pr.html_url}`);
}

const { baseBranch } = JSON.parse(fs.readFileSync(".changeset/config.json", "utf8"));
// `changeset status` compares the working tree against a local base branch.
run("git", ["switch", "--force-create", baseBranch]);
const plan = JSON.parse(changesetOutput(["status"]));

if (plan.changesets.length === 0) {
  tagReleases();
}
else if (plan.changesets.every(changeset => changeset.releases.length === 0)) {
  console.log("All pending changesets are empty; not creating a version PR.");
}
else {
  versionPackages(baseBranch, plan);
}
