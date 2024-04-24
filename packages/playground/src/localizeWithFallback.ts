/** contains the ts-ignore, and the global window manipulation  */
export const localize = (key: string, fallback: string) =>
  // @ts-ignore
  '__tsLocalize' in window ? window.__tsLocalize(key) : fallback
