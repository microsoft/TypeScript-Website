import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { GetDocumentBySlugQuery } from "../__generated__/gatsby-types"
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
import { setupTwoslashHovers } from "shiki-twoslash/dist/dom"
import { Contributors } from "../components/handbook/Contributors"
import { overrideSubNavLinksWithSmoothScroll, updateSidebarOnScroll } from "./scripts/setupSubNavigationSidebar"
import { setupLikeDislikeButtons } from "./scripts/setupLikeDislikeButtons"
import { DislikeUnfilledSVG, LikeUnfilledSVG } from "../components/svgs/documentation"

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
  data: GetDocumentBySlugQuery
  path: string
}

const HandbookTemplate: React.FC<Props> = (props) => {
  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  const i = createInternational<typeof handbookCopy>(useIntl())
  const IntlLink = createIntlLink(props.pageContext.lang, props.data.allSitePage)


  useEffect(() => {
    overrideSubNavLinksWithSmoothScroll()

    // Handles setting the scroll 
    window.addEventListener("scroll", updateSidebarOnScroll, { passive: true, capture: true });
    // Sets current selection
    updateSidebarOnScroll()

    setupTwoslashHovers()
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
  const showSidebarHeadings = post.headings && sidebarHeaders.length <= 30
  const navigation = getDocumentationNavForLanguage(props.pageContext.lang)
  const slug = slugger()
  return (
    <Layout title={"Handbook - " + post.frontmatter.title} description={post.frontmatter.oneline || ""} lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
      {post.frontmatter.beta && <div id="beta">Warning: This page is a work in progress</div>}
      <section id="doc-layout">
        <SidebarToggleButton />
        <noscript>
          <style dangerouslySetInnerHTML={{
            __html: `
          nav#sidebar > ul > li.closed ul {
            display: block !important;
           }
        ` }} />
        </noscript>

        <Sidebar navItems={navigation} selectedID={selectedID} />
        <div id="handbook-content" role="article">
          <h2>{post.frontmatter.title}</h2>
          <article>
            <div className="whitespace raised">
              <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html! }} />
            </div>


            {showSidebar &&
              <aside className="handbook-toc">
                <nav>
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
                      <button id="like-button"><LikeUnfilledSVG /> {i("handb_like_desc")}</button>
                      <button id="dislike-button"><DislikeUnfilledSVG /> {i("handb_dislike_desc")}</button>
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
    </Layout>
  )
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><HandbookTemplate {...props} /></Intl>

export const pageQuery = graphql`
  query GetDocumentBySlug($slug: String!, $previousID: String, $nextID: String) {
    ...AllSitePage
    
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
        oneline
        beta
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
