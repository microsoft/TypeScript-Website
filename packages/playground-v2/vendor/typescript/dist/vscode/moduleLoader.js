var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
/**
 * Loads the selected installation's API modules in this process.
 * Pass the SDK's packageJsonPath through your server's initialization options.
 * Restart this process after an in-place package upgrade to clear its module cache.
 */
export function createTypeScriptModuleLoader(packageJsonPath) {
    async function importModule(exportPath) {
        if (!exportPath.startsWith("typescript/")
            || exportPath.length === "typescript/".length
            || exportPath.includes("\\")
            || exportPath.split("/").includes("..")) {
            throw new Error(`Invalid TypeScript API module export path '${exportPath}'.`);
        }
        const manifestPath = await fs.realpath(packageJsonPath);
        const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
        if (!manifest || typeof manifest !== "object" || !("name" in manifest) || typeof manifest.name !== "string") {
            throw new Error(`TypeScript API package manifest at '${packageJsonPath}' does not contain a package name.`);
        }
        const require = createRequire(manifestPath);
        const modulePath = require.resolve(`${manifest.name}/${exportPath.slice("typescript/".length)}`);
        return import(__rewriteRelativeImportExtension(pathToFileURL(modulePath).href));
    }
    return { importModule };
}
//# sourceMappingURL=moduleLoader.js.map