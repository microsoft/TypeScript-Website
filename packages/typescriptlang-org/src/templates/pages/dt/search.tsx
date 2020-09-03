import cx from "classnames"
import { graphql, withPrefix } from "gatsby"
import * as React from "react"
import { useState, useEffect } from "react"
import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

import "./search.scss"

import { DTSearchPageQuery } from "../../../__generated__/gatsby-types"
import { SearchResults, SearchHit } from "./types"

type Props = {
  pageContext: any
  data: DTSearchPageQuery
}

const Index: React.FC<Props> = props => {
  const [search, setSearch] = useState<string>("")
  const [results, setResults] = useState<SearchResults>()

  useEffect(() => {
    if (!search) {
      setResults(undefined)
      return
    }

    let stillValid = true

    const postData = {
      requests: [
        {
          indexName: "npm-search",
          params: "",
          hitsPerPage: 51,
          page: 0,
          analyticsTags: ["yarnpkg.com"],
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
          attributesToHighlight: ["name", "description", "keywords"],
          query: search,
          maxValuesPerFacet: 10,
          facets: ["keywords", "keywords", "owner.name"],
          tagFilters: "",
        },
      ],
    }
    const query = new URLSearchParams({
      "x-algolia-agent": "TS DT Fetch",
      "x-algolia-application-id": "OFCNCOG2CU",
      "x-algolia-api-key": "f54e21fa3a2a0160595bb058179bfb1e",
    })
    const href = `https://ofcncog2cu-2.algolianet.com/1/indexes/*/queries?${query.toString()}`

    fetch(href, { method: "POST", body: JSON.stringify(postData) }).then(
      async response => {
        if (!stillValid) {
          return
        }

        const json = await response.json()
        if (stillValid) {
          setResults(json.results[0])
        }
      }
    )

    return () => {
      stillValid = false
    }
  }, [search])

  return (
    <Layout
      title="Search for typed packages"
      description="Find npm packages that have type declarations, either bundled or on DefinitelyTyped."
      lang={props.pageContext.lang}
      allSitePage={props.data.allSitePage}
    >
      <div className="topContents">
        <SearchArea results={results} search={search} setSearch={setSearch} />
      </div>
      <div className="resultsArea">
        <SearchResultsDisplay results={results} search={search} />
      </div>
    </Layout>
  )
}

export type SearchAreaProps = {
  results?: SearchResults
  search: string
  setSearch: (newSearch: string) => void
}

const SearchArea: React.FC<SearchAreaProps> = ({
  results,
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
        {search === results?.query && (
          <span aria-live="polite" className="resultsCount">
            {pluralize(results.hits.length, 50, "match", "es")}
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

type SearchResultsProps = {
  results?: SearchResults
  search: string
}

const SearchResultsDisplay: React.FC<SearchResultsProps> = ({
  results,
  search,
}) => {
  if (!results) {
    return <div>default search goes here ;)</div>
  }

  if (!results.hits.length) {
    return <div>sad, no results for {search} :(</div>
  }

  console.log(results.hits.map(hit => hit.name))

  return (
    <table>
      <tbody>
        {results.hits.map(hit => (
          <HitResult
            definitelyTyped
            key={hit.name}
            hit={hit}
            installer={["npm i", "--save-dev"]}
          />
        ))}
      </tbody>
    </table>
  )
}

type HitResultProps = {
  definitelyTyped?: boolean
  hit: SearchHit
  installer: [string, string]
}

const HitResult: React.FC<HitResultProps> = ({
  definitelyTyped,
  hit,
  installer,
}) => {
  return (
    <tr className="hitResult">
      <td
        className={cx(
          "hitDownloads",
          hit.downloadsLast30Days > 1_000_000
            ? "hitDownloadsMillion"
            : hit.downloadsLast30Days > 100_000
            ? "hitDownloadsHundredThousand"
            : "hitDownloadsMeh"
        )}
      >
        {hit.humanDownloadsLast30Days}
      </td>
      <td>??</td>
      <td>
        <strong>{hit.name}</strong> <br /> {hit.description}
      </td>
      <td>{hit.modified}</td>
      <td>
        <pre>
          <code>
            &gt; {installer[0]} {hit.name}
            {definitelyTyped && (
              <>
                {"\n"}
                &gt; {installer[0]} @types/${hit.name} {installer[1]}
              </>
            )}
          </code>
        </pre>
      </td>
    </tr>
  )
}

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <Index {...props} />
  </Intl>
)

export const query = graphql`
  query DTSearchPage {
    ...AllSitePage
  }
`
