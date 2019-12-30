/**
 * The versions of monaco-typescript which we can use
 * for backwards compatibility with older versions
 * of TS in the playground.
 */
export const monacoTSVersions = {
  Nightly: { monaco: 'next', module: '@typescript-deploys/monaco-editor' },
  '3.7.3': { monaco: '3.7.3', module: '@typescript-deploys/monaco-editor' },
  // Don't break old links, but re-direct them to prod, but don't show this in the menus
  '3.7-Beta': { monaco: '3.7.2', module: '@typescript-deploys/monaco-editor', hide: true },
  '3.6.3': { monaco: '0.18.1', module: 'monaco-editor' },
  '3.5.1': { monaco: '0.17.1', module: 'monaco-editor' },
  '3.3.3': { monaco: '0.16.1', module: 'monaco-editor' },
  '3.1.6': { monaco: '0.15.6', module: 'monaco-editor' },
  '3.0.1': { monaco: '0.14.3', module: 'monaco-editor' },
  '2.8.1': { monaco: '0.13.1', module: 'monaco-editor' },
  '2.7.2': { monaco: '0.11.1', module: 'monaco-editor' },
  '2.4.1': { monaco: '0.10.0', module: 'monaco-editor' },
} as const

/** Returns the latest TypeScript version supported by the sandbox */
export const latestSupportedTypeScriptVersion: string = Object.keys(monacoTSVersions)
  .filter(key => key !== 'Nightly' && !key.includes('-'))
  .sort()
  .pop()!

export type SupportedTSVersions = 'Latest' | keyof typeof monacoTSVersions
