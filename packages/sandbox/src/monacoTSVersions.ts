import { supportedReleases, ReleaseVersions } from './releases'

/** The versions you can get for the sandbox */
export type SupportedTSVersions = ReleaseVersions | 'Latest'

/**
 * The versions of monaco-typescript which we can use
 * for backwards compatibility with older versions
 * of TS in the playground.
 */
export const monacoTSVersions: SupportedTSVersions[] = [...supportedReleases, 'Latest']

/** Returns the latest TypeScript version supported by the sandbox */
export const latestSupportedTypeScriptVersion: string = Object.keys(monacoTSVersions)
  .filter(key => key !== 'Nightly' && !key.includes('-'))
  .sort()
  .pop()!
