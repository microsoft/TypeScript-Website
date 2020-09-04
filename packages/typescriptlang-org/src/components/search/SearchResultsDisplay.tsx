import React, { useState } from "react"

import { cx } from "../../lib/cx"
import { ResultRow } from "./ResultRow"
import { installerOptions, Installers, PackageSource } from "./constants"
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
  const [installer, setInstaller] = useState(PackageSource.Npm)

  if (!result) {
    return <div>default search goes here ;)</div>
  }

  if (!result && search) {
    return <div>loading first result set...</div>
  }

  if (!result.hits.length) {
    return <div>sad, no results for {search} :(</div>
  }

  const exactMatch = result.hits.find(hit => hit.name === search)

  return (
    <table className="searchResultsDisplay">
      <thead>
        {exactMatch && (
          <>
            <tr>
              <th colSpan={5}>Exact match</th>
            </tr>
            <ResultRow
              exactMatch
              hit={exactMatch}
              installer={Installers[installer]}
            />
          </>
        )}
        <tr className="headRow">
          <th>DLs</th>
          <th>Via</th>
          <th>Module</th>
          <th>Last Updated</th>
          <th>
            Install
            <div className="installers">
              {installerOptions.map(installOption => (
                <button
                  className={cx(
                    "installer",
                    installer === installOption && "installerSelected"
                  )}
                  key={installOption}
                  onClick={() => setInstaller(installOption)}
                >
                  {installOption}
                </button>
              ))}
            </div>
          </th>
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
  )
}
