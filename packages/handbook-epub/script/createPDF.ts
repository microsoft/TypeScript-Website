#!/usr/bin/env ts-node

import { execSync } from "child_process";
import { join } from "path";
import { copyFileSync } from "fs";

try {
  execSync("which ebook-convert", { encoding: "utf8" });
} catch (e) {
  console.log("Skipping converting to pdf because calibre is not installed");
  process.exit(0);
}

const distPath = join(__dirname, "..", "dist");

// prettier-ignore
execSync(`ebook-convert ${join(distPath, "handbook.epub")} ${join(distPath, "handbook.pdf")}`);

// prettier-ignore
copyFileSync(join(distPath, "handbook.pdf"), join(__dirname, "..", "..", "typescriptlang-org", "static", "assets", "typescript-handbook.pdf"))
