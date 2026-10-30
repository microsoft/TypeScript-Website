// Release jobs have no repository checkout, so this script is copied into the
// pipeline artifact next to publish-manifest.json and must only use Node
// built-ins.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(artifactDir, "publish-manifest.json"), "utf8"));

function setVariable(name, value) {
  console.log(`##vso[task.setvariable variable=${name}]${value}`);
}

function warn(message) {
  console.log(`##vso[task.logissue type=warning]${message}`);
}

function spec(pkg) {
  return `${pkg.name}@${pkg.version}`;
}

function stagePackages(stage) {
  const packages = manifest.stages[stage];
  if (!packages) throw new Error(`Unknown publish stage ${stage}`);
  return packages;
}

// Unlike packuments, the per-version endpoint is not cached by npm's CDN, so
// it reflects newly published versions immediately.
async function isOnNpm(pkg) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${encodeURIComponent(pkg.version)}`;
  let response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  }
  catch (error) {
    throw new Error(`GET ${url}: ${error.cause?.message ?? error.message}`);
  }
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
  return true;
}

// ESRP fails when asked to publish a version that already exists, so drop
// packages that an earlier attempt of this run already published.
async function prepareStage(stage) {
  let pending = 0;
  for (const pkg of stagePackages(stage)) {
    let published = false;
    try {
      published = await isOnNpm(pkg);
    }
    catch (error) {
      warn(`Could not check whether ${spec(pkg)} is on npm; publishing it. ${error.message}`);
    }

    if (published) {
      console.log(`${spec(pkg)} is already on npm; not publishing it again.`);
      fs.rmSync(path.join(artifactDir, `stage-${stage}`, pkg.filename), { force: true });
    }
    else {
      console.log(`${spec(pkg)} will be published.`);
      pending++;
    }
  }
  setVariable(`PublishStage${stage}`, pending > 0);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function githubRequest(route, method = "GET", body) {
  const repository = requireEnv("GITHUB_REPOSITORY");
  const response = await fetch(`https://api.github.com/repos/${repository}/${route}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${requireEnv("GH_TOKEN")}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (method === "GET" && response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`${method} ${route}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function ensureTag(tag, commit) {
  const ref = await githubRequest(`git/ref/tags/${tag}`);
  if (!ref) {
    await githubRequest("git/refs", "POST", { ref: `refs/tags/${tag}`, sha: commit });
    console.log(`Created tag ${tag}.`);
    return;
  }

  let object = ref.object;
  while (object.type === "tag") {
    object = (await githubRequest(`git/tags/${object.sha}`)).object;
  }
  if (object.type !== "commit" || object.sha !== commit) {
    throw new Error(`Tag ${tag} already exists but does not point to ${commit}.`);
  }
  console.log(`Tag ${tag} already exists.`);
}

async function ensureRelease(tag, pkg) {
  const release = await githubRequest(`releases/tags/${tag}`);
  if (release) {
    console.log(`GitHub release ${tag} already exists: ${release.html_url}`);
    return;
  }

  const created = await githubRequest("releases", "POST", {
    tag_name: tag,
    name: tag,
    body: pkg.releaseNotes,
    prerelease: pkg.version.includes("-"),
  });
  console.log(`Created GitHub release: ${created.html_url}`);
}

// Recreate what changesets/action does after `changeset publish`: a
// name@version tag and a GitHub release for every published package.
async function finalize() {
  const commit = requireEnv("RELEASE_SOURCE_COMMIT");
  for (const pkg of manifest.stages.flat()) {
    const tag = spec(pkg);
    await ensureTag(tag, commit);
    await ensureRelease(tag, pkg);
  }
}

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case "prepare-stage":
    await prepareStage(Number(args[0]));
    break;
  case "finalize":
    await finalize();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
