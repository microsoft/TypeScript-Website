import { CharacterCodes } from "#enums/characterCodes";
import { SyntaxKind } from "#enums/syntaxKind";
let syntaxKindNames;
function getSyntaxKindNames() {
    if (!syntaxKindNames) {
        syntaxKindNames = new Map();
        for (const name of Object.keys(SyntaxKind)) {
            const val = SyntaxKind[name];
            if (typeof val === "number" && !syntaxKindNames.has(val)) {
                syntaxKindNames.set(val, name);
            }
        }
        syntaxKindNames.set(SyntaxKind.EndOfFile, "EndOfFileToken");
    }
    return syntaxKindNames;
}
export function formatSyntaxKind(kind) {
    return getSyntaxKindNames().get(kind) ?? `Unknown(${kind})`;
}
/**
 * Remove one extra leading underscore from an identifier name, recovering the
 * display form from its escaped {@link __String} key.
 */
export function unescapeLeadingUnderscores(identifier) {
    const id = identifier;
    return id.length >= 3 && id.charCodeAt(0) === CharacterCodes._ && id.charCodeAt(1) === CharacterCodes._ && id.charCodeAt(2) === CharacterCodes._
        ? id.slice(1)
        : id;
}
/**
 * Add an extra leading underscore to a display name that already begins with
 * `__`, producing its escaped {@link __String} key.
 */
export function escapeLeadingUnderscores(identifier) {
    return (identifier.length >= 2 && identifier.charCodeAt(0) === CharacterCodes._ && identifier.charCodeAt(1) === CharacterCodes._
        ? "_" + identifier
        : identifier);
}
/**
 * Gets the module specifier represented by an ambient module symbol's escaped
 * name, or `undefined` when the name does not identify an ambient module.
 */
export function tryGetAmbientModuleNameFromSymbolName(name) {
    const text = name;
    if (text.charCodeAt(0) === CharacterCodes.doubleQuote && text.charCodeAt(text.length - 1) === CharacterCodes.doubleQuote) {
        return text.slice(1, -1);
    }
    const patternPrefix = '__"';
    if (!text.startsWith(patternPrefix))
        return undefined;
    const markerIndex = text.lastIndexOf('"pattern@');
    return markerIndex > patternPrefix.length ? text.slice(patternPrefix.length, markerIndex) : undefined;
}
export function tryCast(value, test) {
    return value !== undefined && test(value) ? value : undefined;
}
export function cast(value, test) {
    if (value !== undefined && test(value))
        return value;
    throw new Error(`Invalid cast. The supplied value ${value} did not pass the test '${test.name}'.`);
}
export function hasExpression(node) {
    return "expression" in node;
}
export function hasInitializer(node) {
    return "initializer" in node;
}
export function hasObjectAssignmentInitializer(node) {
    return "objectAssignmentInitializer" in node;
}
export function cloneSourceFileData(sourceFile) {
    return {
        statements: sourceFile.statements,
        endOfFileToken: sourceFile.endOfFileToken,
        text: sourceFile.text,
        originalText: sourceFile.originalText,
        spanMap: sourceFile.spanMap,
        contentMapper: sourceFile.contentMapper,
        virtualFileName: sourceFile.virtualFileName,
        diagnosticDirectives: sourceFile.diagnosticDirectives,
        supplementalSourceFileNames: sourceFile.supplementalSourceFileNames,
        canonicalSourceFileName: sourceFile.canonicalSourceFileName,
        fileName: sourceFile.fileName,
        path: sourceFile.path,
        languageVariant: sourceFile.languageVariant,
        scriptKind: sourceFile.scriptKind,
        isDeclarationFile: sourceFile.isDeclarationFile,
        referencedFiles: sourceFile.referencedFiles,
        typeReferenceDirectives: sourceFile.typeReferenceDirectives,
        libReferenceDirectives: sourceFile.libReferenceDirectives,
        imports: sourceFile.imports,
        moduleAugmentations: sourceFile.moduleAugmentations,
        ambientModuleNames: sourceFile.ambientModuleNames,
        externalModuleIndicator: sourceFile.externalModuleIndicator,
        tokenCache: undefined,
    };
}
//# sourceMappingURL=utils.js.map