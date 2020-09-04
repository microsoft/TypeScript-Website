import { graphql } from "gatsby"
import React, { useEffect, useState } from "react"
import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

import "./search.scss"

import { DTSearchPageQuery } from "../../../__generated__/gatsby-types"
import { SearchArea } from "../../../components/search/SearchArea"
import { SearchResultsDisplay } from "../../../components/search/SearchResultsDisplay"
import { useSearchResult } from "../../../components/search/useSearchResult"

type Props = {
  data: DTSearchPageQuery
  location: Location
  pageContext: any
}

const Index: React.FC<Props> = props => {
  const [search, setSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  )
  const result = useSearchResult(search)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("search", search)
    history.pushState(null, "", `${window.location.pathname}?${params}`)
  }, [search])

  return (
    <Layout
      title="Search for typed packages"
      description="Find npm packages that have type declarations, either bundled or on DefinitelyTyped."
      lang={props.pageContext.lang}
      allSitePage={props.data.allSitePage}
    >
      <div className="topContents">
        <SearchArea result={result} search={search} setSearch={setSearch} />
      </div>
      <div className="resultsBackground">
        <div className="resultsArea">
          <SearchResultsDisplay result={result} search={search} />
        </div>
      </div>
    </Layout>
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
