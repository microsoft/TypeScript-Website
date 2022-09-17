export const getLocaleVersionOfPage = () => {
  // @ts-ignore 
  const userLocale = navigator.language || navigator.userLanguage || "en-UK"
  const userLang = userLocale.split("-")[0]
  const thisPaths = location.pathname.split("/")

  // / -> /es
  if (thisPaths.length === 0) {
    return "/" + userLocale
  }

  const isEnglishPath = thisPaths[1].length !== 2

  // /play -> /zh/play
  if (isEnglishPath) {
    return "/" + userLang + location.pathname
  }

  // /zh/play -> /es/play
  thisPaths[1] = userLang
  // Drop any preceding /s
  if (thisPaths[thisPaths.length - 1] === "") thisPaths.pop()

  return thisPaths.join("/")
}
