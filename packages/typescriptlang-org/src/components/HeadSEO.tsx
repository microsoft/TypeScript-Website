import * as React from "react"
import { Helmet } from "react-helmet";

export type SeoProps = {
  title: string
  description: string
  ogTags?: { [key: string]: string }
}

export const HeadSEO = (props: SeoProps) => {

  const ogTags = {
    ...props.ogTags,
    "og:title": props.title,
    "og:description": props.description,
    "twitter:site": "typescriptlang",
  }

  // Skip search engine indexing on the staging site, this is changed by running:
  // yarn workspace typescriptlang-org setup-staging
  const staging = false;

  // do we want localized pages to be the english version?
  //{seo.url && <meta property="og:url" content={seo.url} />}

  // TODO: a lot of pages should have this
  // <meta property="og:type" content="article" />

  // TODO: Maybe on prod we can generate an image for each file
  // <meta name="image" content={seo.image} />

  return (
    <>
      <Helmet title={props.title} titleTemplate={"TypeScript: %s"}>
        <meta name="description" key="description" content={props.description} />
        { staging ? <meta name="robots" content="noindex" />: null }
        {
          Object.keys(ogTags).map(k => <meta key={k} property={k} content={ogTags[k]} />)
        }
      </Helmet>
    </>
  )
}
