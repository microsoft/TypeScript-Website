import { JoinedPackage, JoinedSearchResult, RawSearchResults, SearchHit } from "./types"

export const joinSearchResults = (
    [directResult, typedResult]: RawSearchResults['results']
): JoinedSearchResult => {
    const { query } = directResult
    const externallyAvailableTypeNames = new Set(
        typedResult.hits
            .filter(hit => hit.name.startsWith("@types/"))
            .map(hit => hit.name)
    )

    const formatJoinedPackage = (hit: SearchHit): JoinedPackage => ({
        description: hit.description,
        downloadsLast30Days: hit.downloadsLast30Days,
        externalTypes: !hit.types.ts,
        modified: hit.modified,
        name: hit.name,
    })

    const packages: JoinedPackage[] = []
    let exactMatch: JoinedPackage | undefined

    for (const hit of directResult.hits) {
        if (!hit.types.ts && !externallyAvailableTypeNames.has(hit.name)) {
            continue
        }

        const joinedPackage = formatJoinedPackage(hit)

        if (hit.name === query) {
            exactMatch = joinedPackage
        } else {
            packages.push(joinedPackage)
        }
    }

    return { exactMatch, packages, query };
}