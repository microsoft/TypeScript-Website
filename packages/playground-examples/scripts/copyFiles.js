// @ts-check

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { join, extname } = require("path");
const fse = require("fs-extra");

const copyDir = join(__dirname, "..", "copy");
const jsonDir = join(__dirname, "..", "generated");
const outDir = join(__dirname, "..", "..", "typescriptlang-org", "static", "js", "examples");

if (!existsSync(outDir)) execSync(`mkdir ${outDir}`);

// Move samples
fse.copySync(copyDir, outDir);

/**
 * Filter logic, will be included if return true. However, we must skip the source dir as stated on
 * https://github.com/jprichardson/node-fs-extra/issues/741#issuecomment-579629747
 */

const filterFunc = src => {
  return src === jsonDir || extname(src) === ".json";
};

// Move the JSON files which are generated
fse.copySync(jsonDir, outDir, { filter: filterFunc });
