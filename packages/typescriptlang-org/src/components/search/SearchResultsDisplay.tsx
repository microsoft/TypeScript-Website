import React, { useState } from "react"

import { ResultRow } from "./ResultRow"
import { Installers, PackageSource } from "./constants"
import { RawSearchResult } from "./types"

export type SearchResultsProps = {
  result?: RawSearchResult
  search: string
}

export const SearchResultsDisplay: React.FC<SearchResultsProps> = ({
  result,
  search,
}) => {
  const [installer] = useState<PackageSource>(PackageSource.Npm)

  if (!result) {
    return <div>default search goes here ;)</div>
  }

  const typedHits = result.hits.filter(hit => hit.types.ts)

  if (!typedHits.length) {
    return <div>sad, no results for {search} :(</div>
  }

  const exactMatch = typedHits.find(hit => hit.name === search)

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={5}>Exact match</th>
          </tr>
        </thead>
        <tbody>
          {exactMatch && (
            <ResultRow hit={exactMatch} installer={Installers[installer]} />
          )}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>DLs</th>
            <th>Via</th>
            <th>Module</th>
            <th>Last Updated</th>
            <th>Install</th>
          </tr>
        </thead>
        <tbody>
          {typedHits.map(
            hit =>
              hit.name !== search && (
                <ResultRow
                  hit={hit}
                  key={hit.name}
                  installer={Installers[installer]}
                />
              )
          )}
        </tbody>
      </table>
    </>
  )
}
