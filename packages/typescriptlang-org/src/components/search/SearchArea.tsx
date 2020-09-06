import { withPrefix } from "gatsby"
import * as React from "react"

import { cx } from "../../lib/cx"
import { ISearch, RawSearchResult } from "./types"

import "./SearchArea.scss"

export type SearchAreaProps = {
  result?: RawSearchResult
  search: string
  i: ISearch
  setSearch: (newSearch: string) => void
}

export const SearchArea: React.FC<SearchAreaProps> = ({
  result,
  search,
  setSearch,
  i,
}) => {
  return (
    <div className={cx("searchArea", search && "searchAreaSearching")}>
      <div className="searchBar">
        <input
          aria-label={i("dt_s_title")}
          autoComplete="off"
          autoFocus
          className="searchInput"
          onChange={event => setSearch(event.target.value)}
          placeholder={i("dt_s_title")}
          type="search"
          value={search}
        />
        {search === result?.query && (
          <span aria-live="polite" className="resultsCount">
            {pluralize(result.hits.length, 50, "match", "es")}
          </span>
        )}
        {!search ? (
          <div className="magnifier" />
        ) : (
          <input
            alt="Clear search"
            className="closer"
            onClick={() => setSearch("")}
            type="button"
          />
        )}
      </div>
      {!search && <p className="description">{i("dt_s_subtitle")}</p>}
    </div>
  )
}

const pluralize = (count: number, max: number, text: string, suffix: string) =>
  count > max
    ? `>${max} ${text}${suffix}`
    : `${count} ${text}${count === 1 ? "" : suffix}`
