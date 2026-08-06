const localePattern = /^[a-z]{2}$/

export const normalizePath = value => {
  const [pathname, suffix = ""] = String(value).split(/(?=[?#])/)
  const normalized = `/${pathname}`.replace(/\/{2,}/g, "/")
  return `${normalized === "/" ? "/" : normalized.replace(/\/$/, "")}${suffix}`
}

export const stripLocale = value => {
  const normalized = normalizePath(value)
  const [pathname, suffix = ""] = normalized.split(/(?=[?#])/)
  const parts = pathname.split("/").filter(Boolean)
  if (localePattern.test(parts[0] || "")) parts.shift()
  return `${parts.length ? `/${parts.join("/")}` : "/"}${suffix}`
}

export const createLocalizedHref = (locale, href, availablePaths) => {
  if (!href.startsWith("/") || locale === "en") return href
  const [pathname, suffix = ""] = stripLocale(href).split(/(?=[?#])/)
  const candidate = normalizePath(`/${locale}${pathname === "/" ? "" : pathname}`)
  const paths = availablePaths instanceof Set ? availablePaths : new Set(availablePaths)
  return paths.has(candidate) || paths.has(`${candidate}/`) ? `${candidate}${suffix}` : href
}

export const localeVersionOfPath = (pathname, locale, availablePaths) => {
  const base = stripLocale(pathname).split(/[?#]/)[0]
  const candidate = locale === "en" ? base : normalizePath(`/${locale}${base === "/" ? "" : base}`)
  const paths = availablePaths instanceof Set ? availablePaths : new Set(availablePaths)
  return paths.has(candidate) || paths.has(`${candidate}/`) ? candidate : undefined
}
