import { withPrefix } from "gatsby"
import * as React from "react"

import { cx } from "../../lib/cx"
import { JoinedSearchResult } from "./types"

export type SearchAreaProps = {
  result?: JoinedSearchResult
  search: string
  setSearch: (newSearch: string) => void
}

export const SearchArea: React.FC<SearchAreaProps> = ({
  result,
  search,
  setSearch,
}) => {
  return (
    <div className={cx("searchArea", search && "searchAreaSearching")}>
      <div className="searchBar">
        <input
          autoComplete="off"
          autoFocus
          className="searchInput"
          onChange={event => setSearch(event.target.value)}
          placeholder="Type Search"
          type="search"
          value={search}
        />
        {search === result?.query && (
          <span aria-live="polite" className="resultsCount">
            {pluralize(result.packages.length, 50, "match", "es")}
          </span>
        )}
        {!search ? (
          <img
            alt=""
            className="magnifier"
            src={withPrefix("images/dt/magnifier.svg")}
          />
        ) : (
          <input
            alt="Clear search"
            className="closer"
            onClick={() => setSearch("")}
            src={withPrefix("images/dt/close.svg")}
            type="image"
          />
        )}
      </div>
      {!search && (
        <p className="description">
          Find npm packages that have type declarations, either bundled or on
          DefinitelyTyped.
        </p>
      )}
    </div>
  )
}

const pluralize = (count: number, max: number, text: string, suffix: string) =>
  count > max
    ? `>${max} ${text}${suffix}`
    : `${count} ${text}${count === 1 ? "" : suffix}`
