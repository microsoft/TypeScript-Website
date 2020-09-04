
export type RawSearchResults = {
    /**
     * @remarks These should be from two queries: ["packageName", "@types/packageName"]
     */
    results: [RawSearchResult, RawSearchResult]
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
    description: string
    downloadsLast30Days: number
    homepage: string | null
    humanDownloadsLast30Days: string
    keywords: string
    license: string | null
    modified: number
    name: string
    objectID: string
    owner: SearchOwner
    repository: SearchRepository
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

export type SearchTypes = {
    ts: boolean
}

export type JoinedSearchResult = {
    exactMatch?: JoinedPackage
    packages: JoinedPackage[]
    query: string
}

export type JoinedPackage = {
    description: string
    downloadsLast30Days: number
    externalTypes: boolean
    modified: number
    name: string
}
