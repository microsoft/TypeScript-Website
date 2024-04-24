/** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
export const requireURL = (path: string) => {
  // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
  const isDev = document.location.host.includes('localhost')
  const prefix = isDev ? 'local/' : 'unpkg/typescript-playground-presentation-mode/dist/'
  return prefix + path
}

/** Use this to make a few dumb element generation funcs */
export const el = (str: string, el: string, container: Element) => {
  const para = document.createElement(el)
  para.innerHTML = str
  container.appendChild(para)
}
