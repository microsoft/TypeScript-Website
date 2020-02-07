/** contains the ts-ignore, and the global window manipulation  */
export const localize = (key: string, fallback: string) =>
  // @ts-ignore
  'i' in window ? window.i(key) : fallback
