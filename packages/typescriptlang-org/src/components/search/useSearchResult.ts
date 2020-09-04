import { useEffect, useState } from "react"

import { RawSearchResults, RawSearchResult } from "./types"

const createPostData = (requestedSearch: string) => {
    const search = requestedSearch || "react"
    return {
        requests: [{
            analyticsTags: ["yarnpkg.com"],
            attributesToHighlight: ["name", "description", "keywords"],
            attributesToRetrieve: [
                "deprecated",
                "description",
                "downloadsLast30Days",
                "homepage",
                "humanDownloadsLast30Days",
                "keywords",
                "license",
                "modified",
                "name",
                "owner",
                "repository",
                "types",
                "version",
            ],
            facets: ["keywords", "keywords", "owner.name"],
            hitsPerPage: requestedSearch ? 51 : 25,
            indexName: "npm-search",
            maxValuesPerFacet: 10,
            page: 0,
            params: "",
            query: search.startsWith("@types/")
                ? search.substring("@types/".length)
                : search,
            tagFilters: "",
        }]
    }
}

const searchParams = new URLSearchParams({
    "x-algolia-agent": "TS DT Fetch",
    "x-algolia-application-id": "OFCNCOG2CU",
    "x-algolia-api-key": "f54e21fa3a2a0160595bb058179bfb1e",
})

const href = `https://ofcncog2cu-2.algolianet.com/1/indexes/*/queries?${searchParams.toString()}`

const cache = new Map<string, RawSearchResult>()

export const useSearchResult = (search: string) => {
    const [result, setResult] = useState<RawSearchResult>()

    useEffect(() => {
        const cached = cache.get(search)
        if (cached) {
            setResult(cached)
            return
        }

        let stillValid = true

        fetch(href, { method: "POST", body: JSON.stringify(createPostData(search)) }).then(
            async response => {
                if (!stillValid) {
                    return
                }

                const json = await response.json()
                if (!stillValid) {
                    return
                }

                const [rawResult] = (json as RawSearchResults).results
                const processedResult = {
                    ...rawResult,
                    hits: rawResult.hits.filter(hit => hit.types.ts)
                }

                cache.set(search, processedResult)
                setResult(processedResult)
            }
        )

        return () => {
            stillValid = false
        }
    }, [search])

    return result
}
