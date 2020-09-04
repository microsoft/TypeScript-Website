import React, { useState } from "react"

import { ResultRow } from "./ResultRow"
import { JoinedSearchResult } from "./types"
import { Installer, Installers, PackageSource } from "./constants"

export type SearchResultsProps = {
  result?: JoinedSearchResult
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

  if (!result.packages.length) {
    return <div>sad, no results for {search} :(</div>
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={5}>Exact match</th>
          </tr>
        </thead>
        <tbody>
          {result.exactMatch && (
            <ResultRow
              installer={Installers[installer]}
              joinedPackage={result.exactMatch}
            />
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
          {result.packages.map(joinedPackage => (
            <ResultRow
              key={joinedPackage.name}
              installer={Installers[installer]}
              joinedPackage={joinedPackage}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}
