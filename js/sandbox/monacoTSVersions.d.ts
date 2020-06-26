import { ReleaseVersions } from './releases';
/** The versions you can get for the sandbox */
export declare type SupportedTSVersions = ReleaseVersions | 'Latest';
/**
 * The versions of monaco-typescript which we can use
 * for backwards compatibility with older versions
 * of TS in the playground.
 */
export declare const monacoTSVersions: SupportedTSVersions[];
/** Returns the latest TypeScript version supported by the sandbox */
export declare const latestSupportedTypeScriptVersion: string;
