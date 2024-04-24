// @ts-check

// For the handbook navigation structure, we want to use
// filepaths, but want to be prepared in case they change

// yarn workspace documentation create-handbook-nav

const fs = require("fs");
const path = require("path")
const { format } = require("prettier");

// prettier-ignore
const getFilePaths = folderPath => {
  const entryPaths = fs.readdirSync(folderPath).map(entry => path.join(folderPath, entry));
  const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
  const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(getFilePaths(curr)), []);
  return [...filePaths, ...dirFiles].filter((f) => !path.basename(f).startsWith("."));
};

const allFiles = getFilePaths(path.join(__dirname, "..", "copy", "en"));
const enRoot = path.join(__dirname, "..", "copy", "en");

// From:   '/Users/ortatherox/dev/typescript/new-website/packages/documentation/copy/en/Advanced Types.md',
// To:     'Advanced Types.md',
const files = allFiles.map((f) => path.relative(enRoot, f).replace(/\\/g, "/"));

const code = `
  export type AllDocsPages = "${files.join('" | "')}"
`;

const typePath = path.join(__dirname, "types", "AllFilenames.d.ts");
fs.writeFileSync(typePath, format(code, { filepath: typePath }));

module.exports = {
  enRoot,
  getFilePaths,
};
