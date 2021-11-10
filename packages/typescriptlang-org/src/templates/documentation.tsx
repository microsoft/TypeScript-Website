import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"
import { Sidebar, SidebarToggleButton } from "../components/layout/Sidebar"
import { getDocumentationNavForLanguage } from "../lib/documentationNavigation"
import { Intl } from "../components/Intl"

// This dependency is used in gatsby-remark-autolink-headers to generate the slugs
import slugger from "github-slugger"

import "./documentation.scss"
import "./markdown.scss"

import { NextPrev } from "../components/handbook/NextPrev"
import { createInternational } from "../lib/createInternational"
import { useIntl } from "react-intl"
import { createIntlLink } from "../components/IntlLink"
import { handbookCopy } from "../copy/en/handbook"
import { Contributors } from "../components/handbook/Contributors"
import { overrideSubNavLinksWithSmoothScroll, updateSidebarOnScroll } from "./scripts/setupSubNavigationSidebar"
import { setupLikeDislikeButtons } from "./scripts/setupLikeDislikeButtons"
import { DislikeUnfilledSVG, LikeUnfilledSVG } from "../components/svgs/documentation"
import { Popup, useQuickInfoPopup } from "../components/Popup"
import Helmet from "react-helmet"

type Props = {
  pageContext: {
    // This is only set up if it's in the handbook nav
    id: string | undefined
    nextID: string
    previousID: string
    repoPath: string
    slug: string
    lang: string
    modifiedTime: string
  }
  data: GatsbyTypes.GetDocumentBySlugQuery
  path: string
}

const HandbookTemplate: React.FC<Props> = (props) => {
  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  // Note: This can, and does, change triggering re-renders
  const showPopup = useQuickInfoPopup(props.pageContext.lang)

  const [deprecationURL, setDeprecationURL] = useState(post.frontmatter!.deprecated_by)

  const i = createInternational<typeof handbookCopy>(useIntl())
  const IntlLink = createIntlLink(props.pageContext.lang)

  useEffect(() => {
    if (document.location.hash) {
      const redirects = post.frontmatter?.deprecation_redirects || []
      const indexOfHash = redirects.indexOf(document.location.hash.slice(1))
      if (indexOfHash !== -1) {
        setDeprecationURL(redirects[indexOfHash + 1])
      }
    }

    overrideSubNavLinksWithSmoothScroll()

    // Handles setting the scroll 
    window.addEventListener("scroll", updateSidebarOnScroll, { passive: true, capture: true });
    // Sets current selection
    updateSidebarOnScroll()

    setupLikeDislikeButtons(props.pageContext.slug, i)


    return () => {
      window.removeEventListener("scroll", updateSidebarOnScroll)
    }
  }, [])


  if (!post.frontmatter) throw new Error(`No front-matter found for the file with props: ${props}`)
  if (!post.html) throw new Error(`No html found for the file with props: ${props}`)

  const selectedID = props.pageContext.id || "NO-ID"
  const sidebarHeaders = post.headings?.filter(h => (h?.depth || 0) <= 3) || []
  const showSidebar = !post.frontmatter.disable_toc
  const showExperimental = post.frontmatter.experimental
  const showSidebarHeadings = post.headings && sidebarHeaders.length <= 30
  const navigation = getDocumentationNavForLanguage(props.pageContext.lang)
  const isHandbook = post.frontmatter.handbook
  const prefix = isHandbook ? "Handbook" : "Documentation"

  const slug = slugger()
  return (
    <Layout title={`${prefix} - ${post.frontmatter.title}`} description={post.frontmatter.oneline || ""} lang={props.pageContext.lang}>
      <section id="doc-layout" >
        <SidebarToggleButton />

        <div className="page-popup" id="page-helpful-popup" style={{ opacity: 0 }}>
          <p>Was this page helpful?</p>
          <div>
            <button className="first" id="like-button-popup" title="Like this page"><LikeUnfilledSVG /></button>
            <button id="dislike-button-popup" title="Dislike this page"><DislikeUnfilledSVG /></button>
          </div>
        </div>

        <noscript>
          {/* Open by default so that folks without JS get a fully open sidebar */}
          <style dangerouslySetInnerHTML={{
            __html: `
          nav#sidebar > ul > li.closed ul {
            display: block !important;
           }
        ` }} />
        </noscript>

        <Sidebar navItems={navigation} selectedID={selectedID} />
        <div id="handbook-content" role="article">
          {deprecationURL &&
            <>
              <Helmet>
                <link rel="canonical" href={`https://www.typescriptlang.org${post.frontmatter.deprecated_by}`} />
              </Helmet>
              <div id="deprecated-header">
                <div id="deprecated-content">
                  <div id="deprecated-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="black" /><path d="M8 3V9" stroke="black" /><path d="M8 11L8 13" stroke="black" /></svg>
                  </div>
                  <div>
                    <h3>{i("handb_deprecated_title")}</h3>
                    <p>{i("handb_deprecated_subtitle")}<IntlLink className="deprecation-redirect-link" to={deprecationURL}>{i("handb_deprecated_subtitle_link")}</IntlLink></p>
                  </div>
                </div>
                <div id="deprecated-action">
                  <IntlLink className="deprecation-redirect-link" to={deprecationURL}>{i("handb_deprecated_subtitle_action")}</IntlLink>
                </div>
              </div>
            </>
          }

          {showExperimental && 
           <div id="deprecated-header">
                <div id="deprecated-content">
                  <div id="deprecated-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" stroke="black" /><path d="M8 3V9" stroke="black" /><path d="M8 11L8 13" stroke="black" /></svg>
                  </div>
                  <div>
                    <h3>{i("handb_experimental_title")}</h3>
                    <p>{i("handb_experimental_subtitle")}</p>
                  </div>
                </div>
            </div>
          }

          <h2>{post.frontmatter.title}</h2>
          {post.frontmatter.preamble && <div className="preamble" dangerouslySetInnerHTML={{ __html: post.frontmatter.preamble }} />}
          <article>
            <div className="whitespace raised">
              <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html! }} />
            </div>
            {showSidebar &&
              <aside className="handbook-toc">
                <nav className={deprecationURL ? "deprecated" : ""}>
                  {showSidebarHeadings && <>
                    <h5>{i("handb_on_this_page")}</h5>
                    <ul>
                      {
                        sidebarHeaders.map(heading => {
                          const id = slug.slug(heading!.value, false)
                          return <li key={id}><a href={'#' + id}>{heading!.value}</a></li>
                        })
                      }
                    </ul>
                  </>
                  }
                  <div id="like-dislike-subnav">
                    <h5>{i("handb_like_dislike_title")}</h5>
                    <div>
                      <button title="Like this page" id="like-button"><LikeUnfilledSVG /> {i("handb_like_desc")}</button>
                      <button title="Dislike this page" id="dislike-button"><DislikeUnfilledSVG /> {i("handb_dislike_desc")}</button>
                    </div>
                  </div>

                </nav>
              </aside>
            }
          </article>

          <NextPrev next={props.data.next as any} prev={props.data.prev as any} i={i} IntlLink={IntlLink as any} />
          <Contributors lang={props.pageContext.lang} i={i} path={props.pageContext.repoPath} lastEdited={props.pageContext.modifiedTime} />
        </div>
      </section>
    <Popup {...showPopup}/>
    </Layout>
  )
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><HandbookTemplate {...props} /></Intl>

export const pageQuery = graphql`
  query GetDocumentBySlug($slug: String!, $previousID: String, $nextID: String) {    
    markdownRemark(frontmatter: { permalink: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      headings {
        value
        depth
      }
      frontmatter {
        permalink
        title
        disable_toc
        handbook
        oneline
        preamble
        deprecated_by
        deprecation_redirects
        experimental
      }
    }

    prev: file(id: { eq: $previousID } ) {
      childMarkdownRemark  {
        frontmatter {
          title
          oneline
          permalink
        }
      }
    }

    next: file(id: { eq: $nextID } ) {
      childMarkdownRemark  {
        frontmatter {
          title
          oneline
          permalink
        }
      }
    }
  }
`
