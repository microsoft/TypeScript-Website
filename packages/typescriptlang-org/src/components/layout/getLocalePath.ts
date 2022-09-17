import { getLocaleVersionOfPage } from "./getLocaleVersionOfPage"

export const getLocalePath = () => {
  let localePath = getLocaleVersionOfPage()
  if (localePath.startsWith("/en")) {
    localePath = localePath.slice(3)
  }

  if (localePath === "") localePath = "/"

  return localePath
}
