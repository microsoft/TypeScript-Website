import React, { useEffect, useState } from "react"
import { debounce } from "ts-debounce"
import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

import "./search.scss"

import { SearchArea } from "../../../components/search/SearchArea"
import { SearchResultsDisplay } from "../../../components/search/SearchResultsDisplay"
import { useSearchResult } from "../../../components/search/useSearchResult"
import { createInternational } from "../../../lib/createInternational"
import { useIntl } from "react-intl"
import { dtCopy } from "../../../copy/en/dt"

type SearchProps = {
  location: Location
  pageContext: any
}

const updateHistorySearch = debounce((search: string) => {
  const params = new URLSearchParams(window.location.search)
  params.set("search", search)
  history.pushState(null, "", `${window.location.pathname}?${params}`)
}, 250)

const Search: React.FC<SearchProps> = ({ location, pageContext }) => {
  const i = createInternational<typeof dtCopy>(useIntl())

  const [search, setSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  )
  const result = useSearchResult(search)

  useEffect(() => {
    updateHistorySearch(search)
  }, [search])

  return (
    <Layout title={i("dt_s_page_title")} description={i("dt_s_subtitle")} lang={pageContext.lang}>
      <div className="topContents">
        <SearchArea result={result} search={search} setSearch={setSearch} i={i} />
      </div>
      <div className="resultsBackground">
        <div className="resultsArea">
          <SearchResultsDisplay result={result} search={search} i={i} />
        </div>
      </div>
    </Layout>
  )
}

export default (props: SearchProps) => (
  <Intl locale={props.pageContext.lang}>
    <Search {...props} />
  </Intl>
)
