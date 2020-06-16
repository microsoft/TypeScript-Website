import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { GetHandbookBySlugQuery } from "../__generated__/gatsby-types"
import { Layout } from "../components/layout"
import { Sidebar, SidebarToggleButton } from "../components/layout/Sidebar"
import { handbookNavigation } from "../lib/handbookNavigation"
import { Intl } from "../components/Intl"

// This dependency is used in gatsby-remark-autolink-headers to generate the slugs
import slugger from "github-slugger"

import "./handbook.scss"
import "./markdown.scss"

import { NextPrev } from "../components/handbook/NextPrev"
import { idFromURL } from "../../lib/bootup/ingestion/createPagesForOldHandbook"
import { createInternational } from "../lib/createInternational"
import { useIntl } from "react-intl"
import { createIntlLink } from "../components/IntlLink"
import { handbookCopy } from "../copy/en/handbook"
import { setupTwoslashHovers } from "gatsby-remark-shiki-twoslash/dist/dom"
import { Contributors } from "../components/handbook/Contributors"

type Props = {
  pageContext: {
    isOldHandbook: boolean
    nextID: string
    previousID: string
    repoPath: string
    slug: string
    lang: string
    modifiedTime: string
  }
  data: GetHandbookBySlugQuery
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
    // Overrides the anchor behavior to smooth scroll instead
    // Came from https://css-tricks.com/sticky-smooth-active-nav/
    const subnavLinks = document.querySelectorAll<HTMLAnchorElement>("#handbook-content nav ul li a");
    subnavLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();

        let target = document.querySelector(event.target!["hash"]);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.location.hash = event.target!["hash"]
      })
    })

    // Sets the current selection
    const updateSidebar = () => {
      const fromTop = window.scrollY;
      let currentPossibleAnchor: HTMLAnchorElement | undefined
      const offset = 100

      // Scroll down to find the highest anchor on the screen
      subnavLinks.forEach(link => {
        try {
          const section = document.querySelector<HTMLDivElement>(link.hash);
          if (!section) { return }
          const isBelow = section.offsetTop - offset <= fromTop
          if (isBelow) currentPossibleAnchor = link

        } catch (error) {
          return
        }
      });

      // Then set the active tag
      subnavLinks.forEach(link => {
        if (link === currentPossibleAnchor) {
          link.classList.add("current");
        } else {
          link.classList.remove("current");
        }
      })
    }

    // Handles setting the scroll 
    window.addEventListener("scroll", updateSidebar, { passive: true, capture: true });
    // Sets current selection
    updateSidebar()

    setupTwoslashHovers()

    return () => {
      window.removeEventListener("scroll", updateSidebar)
    }
  }, [])


  if (!post.frontmatter) throw new Error(`No front-matter found for the file with props: ${props}`)
  if (!post.html) throw new Error(`No html found for the file with props: ${props}`)

  const selectedID = idFromURL(post.frontmatter.permalink!)
  const showSidebar = !post.frontmatter.disable_toc && post.headings && !!post.headings.length && post.headings.length <= 30

  return (
    <Layout title={"Handbook - " + post.frontmatter.title} description={post.frontmatter.oneline || ""} lang="en" allSitePage={props.data.allSitePage}>
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

        <Sidebar navItems={handbookNavigation} selectedID={selectedID} />
        <div id="handbook-content" role="article">
          <h2>{post.frontmatter.title}</h2>
          <article>
            <div className="whitespace raised">
              <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html! }} />
            </div>


            {showSidebar &&
              <aside className="handbook-toc">
                <nav>
                  <h5>On this page</h5>
                  <ul>
                    {post.headings!.map(heading => {
                      if (heading!.depth! > 2) return null
                      const id = slugger().slug(heading!.value, false)
                      return <li key={id}><a href={'#' + id}>{heading!.value}</a></li>
                    })}
                  </ul>
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
  query GetHandbookBySlug($slug: String!, $previousID: String, $nextID: String) {
    ...AllSitePage
    
    markdownRemark(frontmatter: { permalink: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      headings  {
        value
        depth
      }
      frontmatter {
        permalink
        title
        disable_toc
        oneline
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
