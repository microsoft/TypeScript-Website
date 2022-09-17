import { allFiles } from "../../__generated__/allPages"
import { getLocalePath } from "./getLocalePath"

export const doesLocalePageExist = (path?: string): boolean => {
  const localePath = path || getLocalePath()

  const doesPageExist = allFiles.find(f => f === localePath || f + "/" === localePath)
  if (!doesPageExist) return false

  return true
}