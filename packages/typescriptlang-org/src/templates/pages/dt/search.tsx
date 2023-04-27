import React from "react"

import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

type SearchProps = {
  pageContext: { lang: string }
}

const title = "Search for typed packages";
const description = "This page is no longer necessary.";

const Search: React.FC<SearchProps> = ({ pageContext }) => {
  return (
    <Layout title={title} description={description} lang={pageContext.lang}>
      <div className="raised main-content-block">
        <h1>{title}</h1>
        <p>
          <strong>{description}</strong>
        </p>
        <p>
          The npm and Yarn package registries now include type information for packages.
          <br />
          You can read more on:{' '}
          <a href="https://github.blog/changelog/2020-12-16-npm-displays-packages-with-bundled-typescript-declarations">
            npm displays packages with bundled TypeScript declarations
          </a>.
        </p>
      </div>
    </Layout>
  )
}

export default (props: SearchProps) => (
  <Intl locale={props.pageContext.lang}>
    <Search {...props} />
  </Intl>
)
