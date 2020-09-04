import React, { useState } from "react"

import { ResultRow } from "./ResultRow"
import { Installers, PackageSource } from "./constants"
import { RawSearchResult } from "./types"

import "./SearchResultsDisplay.scss"

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

  if (!result.hits.length) {
    return <div>sad, no results for {search} :(</div>
  }

  const exactMatch = result.hits.find(hit => hit.name === search)

  return (
    <div className="searchResultsDisplay">
      <table className="resultsTable">
        <thead>
          {exactMatch && (
            <>
              <tr>
                <th colSpan={5}>Exact match</th>
              </tr>
              <ResultRow
                hit={exactMatch}
                installer={Installers[installer]}
                raised
              />
            </>
          )}
          <tr className="headRow">
            <th>DLs</th>
            <th>Via</th>
            <th>Module</th>
            <th>Last Updated</th>
            <th>Install</th>
          </tr>
        </thead>
        <tbody className="resultsRaised">
          {result.hits.map(
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
    </div>
  )
}
