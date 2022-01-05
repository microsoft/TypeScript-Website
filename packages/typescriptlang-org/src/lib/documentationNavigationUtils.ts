export interface SidebarNavItem {
  title: string
  id: string
  permalink?: string
  chronological?: boolean
  oneline?: string
  items?: SidebarNavItem[]
}

const findInNav = (
  item: SidebarNavItem | SidebarNavItem[],
  fun: (item: SidebarNavItem) => boolean
): SidebarNavItem | undefined => {
  if (Array.isArray(item)) {
    for (const subItem of item) {
      const sub = findInNav(subItem, fun)
      if (sub) return sub
    }
  } else {
    if (fun(item)) return item
    if (!item.items) return undefined
    for (const subItem of item.items) {
      const sub = findInNav(subItem, fun)
      if (sub) return sub
    }
    return undefined
  }
}

export function getNextPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false
  if (!section) return undefined
  if (!section.chronological) return undefined
  if (!section.items) return

  const currentIndex = section.items.findIndex(i => i.id === currentID)
  const next = section.items[currentIndex + 1]
  if (next) {
    if (next.items) {
      return {
        path: next.items[0].permalink,
        ...section.items[currentIndex + 1],
      }
    } else {
      return {
        path: next.permalink,
        ...section.items[currentIndex + 1],
      }
    }
  }
}

export function getPreviousPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false

  if (!section) return undefined
  if (!section.chronological) return undefined
  if (!section.items) return

  const currentIndex = section.items.findIndex(i => i.id === currentID)
  const prev = section.items[currentIndex - 1]

  if (prev) {
    return {
      path: prev.permalink,
      ...section.items[currentIndex - 1],
    }
  }
}
