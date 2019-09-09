/**
 * The versions of monaco-typescript which we can use
 * for backwards compatibility with older versions
 * of TS in the playground.
 */
export const monacoTSVersions = {
  '3.5.1': { monaco: '0.17.1' },
  '3.3.3': { monaco: '0.16.1' },
  '3.1.6': { monaco: '0.15.6' },
  '3.0.1': { monaco: '0.14.3' },
  '2.8.1': { monaco: '0.13.1' },
  '2.7.2': { monaco: '0.11.1' },
  '2.4.1': { monaco: '0.10.0' },
} as const;

export type SupportedTSVersions = keyof typeof monacoTSVersions
