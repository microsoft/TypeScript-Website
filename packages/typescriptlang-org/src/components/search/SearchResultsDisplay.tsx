import React from "react"

import { cx } from "../../lib/cx"
import { useLocalStorage } from "../../lib/useLocalStorage"
import { ResultRow } from "./ResultRow"
import { installerOptions, Installers, PackageSource } from "./constants"
import { RawSearchResult } from "./types"

import "./SearchResultsDisplay.scss"

export type SearchResultsDisplayProps = {
  result?: RawSearchResult
  search: string
}

export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
  result,
  search,
}) => {
  const [installer, setInstaller] = useLocalStorage<PackageSource>(
    "dt/search/packageSource",
    PackageSource.Npm
  )

  if (!result) {
    return <div className="loading">...</div>
  }

  if (!result.hits.length) {
    return (
      <div className="empty">
        <div>
          No results found for <strong>{search}</strong>.
        </div>

        <div>Try another search?</div>
      </div>
    )
  }

  const exactMatch = result.hits.find(hit => hit.name === search)

  return (
    <table className="resultsTable">
      <thead>
        {!search && (
          <tr>
            <th className="popular" colSpan={5}>
              Popular on Definitely Typed
            </th>
          </tr>
        )}
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
        <tr className={cx("headRow", (exactMatch || search) && "afterTop")}>
          <th className="dlsHead">DLs</th>
          <th>Via</th>
          <th>Module</th>
          <th className="updatedHead">Last Updated</th>
          <th className="installHead">
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
