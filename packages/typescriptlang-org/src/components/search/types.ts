import { dtCopy } from "../../copy/en/dt"

export type ISearch = (s: keyof typeof dtCopy) => string

export type RawSearchResults = {
  results: [RawSearchResult]
}

export type RawSearchResult = {
  exhaustiveFacetsCount: boolean
  exhaustiveNbHits: boolean
  hits: SearchHit[]
  hitsPerPage: number
  page: number
  query: string
}

export type SearchHit = {
  deprecated: boolean
  description?: string
  downloadsLast30Days: number
  homepage: string | null
  humanDownloadsLast30Days: string
  keywords: string
  license: string | null
  modified: number
  name: string
  objectID: string
  owner: SearchOwner
  repository?: SearchRepository
  types: SearchTypes
  version: string
}

export type SearchOwner = {
  avatar: string
  link: string
  name: "zeekay"
}

export type SearchRepository = {
  host: string
  path: string
  project: string
  url: string
  user: string
}

export type SearchTypes =
  | SearchTypesExternal
  | SearchTypesIncluded
  | SearchTypesMissing

export type SearchTypesExternal = {
  definitelyTyped: string
  ts: "definitely-typed"
}

export type SearchTypesIncluded = {
  ts: "included"
}

export type SearchTypesMissing = {
  ts: false
}
