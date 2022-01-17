/**
    Updates the JSON file `attribution.json` with contributors based on commits to files, to run:
    yarn workspace documentation bootstrap
*/
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { format } = require("prettier");

console.log("Grabbing attribution");

// We need to work across two repos
const oldJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, "handbookAttribution.json"), "utf8")
);

const handleDupeNames = (name) => {
  if (name === "Orta") return "Orta Therox";
  return name;
};

// Being first gets you a free x commits
const getOriginalAuthor = (filepath) => {
  const creator = execSync(
    `git log --follow --format="%an | %aE"  --diff-filter=A "${filepath}"`
  )
    .toString()
    .trim();
  return {
    name: creator.split(" | ")[0],
    email: creator.split(" | ")[1],
  };
};

const gravatarURLForAuthor = (email) => {
  switch (email) {
    case "orta.therox@gmail.com":
    case "git@orta.io":
    case "ortam@microsoft.com":
      return "https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4";

    default:
      return crypto.createHash("md5").update(email).digest("hex");
  }
};

// Gets the rest of the authors for a file
const getAuthorsForFile = (filepath) => {
  const cmd = `git log --follow --format="%an | %aE" "${filepath}"`;
  const contributors = execSync(cmd).toString().trim();

  const allContributions = contributors.split("\n").map((c) => {
    return {
      name: handleDupeNames(c.split(" | ")[0]),
      email: c.split(" | ")[1],
    };
  });

  // Keep a map of all found authors,
  const objs = new Map();
  allContributions.forEach((c) => {
    const id = c.name.toLowerCase().replace(/\s/g, "");
    const existing = objs.get(id);
    if (existing) {
      objs.set(id, {
        name: c.name,
        gravatar: existing.gravatar,
        count: existing.count + 1,
      });
    } else {
      const email = c.email || "NOOP";
      objs.set(id, {
        name: c.name,
        gravatar: gravatarURLForAuthor(email),
        count: 1,
      });
    }
  });

  return [...objs.values()];
};

const allFiles = recursiveReadDirSync("copy/");
const json = {};

if (!process.env.CI) {
  console.log("Skipping because not CI");
} else {
  allFiles.forEach((f) => {
    const oldName = f.split("/").splice(2).join("/");
    const originalRef = oldJSON[oldName] || { top: [], total: 0 };

    const first = getOriginalAuthor(f);
    const rest = getAuthorsForFile(f);

    const firstInRest = rest.find((a) => a.name === first.name);
    // it's 50 from the original docs in the handbook, which should
    // offset orta "creating" all these files
    if (firstInRest) firstInRest.count += 5;

    originalRef.top.forEach((r) => {
      const inRest = rest.find((a) => a.name === r.name);
      if (inRest) inRest.count += r.count;
      else rest.push(r);
    });

    rest.sort((l, r) => r.count - l.count);
    // console.log(" - " + f + " (" + rest.length + ")");

    json[f] = { top: rest.slice(0, 5), total: rest.length + originalRef.total };
  });
}

const output = path.join(__dirname, "..", "output");
if (!fs.existsSync(output)) fs.mkdirSync(output);

const outputJSON = path.join(output, "attribution.json");
fs.writeFileSync(
  outputJSON,
  format(JSON.stringify(json), { filepath: outputJSON })
);

/** Recursively retrieve file paths from a given folder and its subfolders. */
// https://gist.github.com/kethinov/6658166#gistcomment-2936675
/** @returns {string[]} */
function recursiveReadDirSync(folderPath) {
  if (!fs.existsSync(folderPath)) return [];

  const entryPaths = fs
    .readdirSync(folderPath)
    .map((entry) => path.join(folderPath, entry));

  const filePaths = entryPaths.filter((entryPath) =>
    fs.statSync(entryPath).isFile()
  );
  const dirPaths = entryPaths.filter(
    (entryPath) => !filePaths.includes(entryPath)
  );
  const dirFiles = dirPaths.reduce(
    (prev, curr) => prev.concat(recursiveReadDirSync(curr)),
    []
  );

  return [...filePaths, ...dirFiles].filter(
    (f) => !f.endsWith(".DS_Store") && !f.endsWith("README.md")
  );
}

module.exports = {
  recursiveReadDirSync,
};
