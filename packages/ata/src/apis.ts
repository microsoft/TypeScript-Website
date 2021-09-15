import { ATABootstrapConfig } from "."

//  https://github.com/jsdelivr/data.jsdelivr.com

export const getNPMVersionsForModule = (config: ATABootstrapConfig, moduleName: string) => {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}`
  return api<{ tags: Record<string, string>; versions: string[] }>(config, url)
}

export const getNPMVersionForModuleReference = (config: ATABootstrapConfig, moduleName: string, reference: string) => {
  const url = `https://data.jsdelivr.com/v1/package/resolve/npm/${moduleName}@${reference}`
  return api<{ version: string | null }>(config, url)
}

export type NPMTreeMeta = { default: string; files: Array<{ name: string }>; moduleName: string; version: string }

export const getFiletreeForModuleWithVersion = async (
  config: ATABootstrapConfig,
  moduleName: string,
  version: string
) => {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}@${version}/flat`
  const res = await api<NPMTreeMeta>(config, url)
  if (res instanceof Error) {
    return res
  } else {
    return {
      ...res,
      moduleName,
      version,
    }
  }
}

export const getDTSFileForModuleWithVersion = async (
  config: ATABootstrapConfig,
  moduleName: string,
  version: string,
  file: string
) => {
  // file has a prefix / in falr mode
  const url = `https://cdn.jsdelivr.net/npm/${moduleName}@${version}${file}`
  const f = config.fetcher || fetch
  const res = await f(url, { headers: { "User-Agent": `Type Acquisition ${config.projectName}` } })
  if (res.ok) {
    return res.text()
  } else {
    return new Error("OK")
  }
}

function api<T>(config: ATABootstrapConfig, url: string): Promise<T | Error> {
  const f = config.fetcher || fetch
  return f(url, { headers: { "User-Agent": `Type Acquisition ${config.projectName}` } }).then(res => {
    if (res.ok) {
      return res.json().then(f => f as T)
    } else {
      return new Error("OK")
    }
  })
}
