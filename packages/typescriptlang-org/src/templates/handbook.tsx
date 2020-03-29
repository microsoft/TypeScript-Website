import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { GetHandbookBySlugQuery } from "../__generated__/gatsby-types"
import { Layout } from "../components/layout"
import { Sidebar, SidebarToggleButton } from "../components/layout/Sidebar"
import { oldHandbookNavigation } from "../lib/oldHandbookNavigation"
import { Intl } from "../components/Intl"

// This dependency is used in gatsby-remark-autolink-headers to generate the slugs
import slugger from "github-slugger"

import "./handbook.scss"
import "./markdown.scss"
import { setupHandbookHovers } from "./handbook-lsp-hover"

type Props = {
  pageContext: any
  data: GetHandbookBySlugQuery
  path: string
}

const HandbookTemplate: React.FC<Props> = (props) => {

  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }


  useEffect(() => {
    // Overrides the anchor behavior to smooth scroll instead
    // Came from https://css-tricks.com/sticky-smooth-active-nav/
    const subnavLinks = document.querySelectorAll<HTMLAnchorElement>("#handbook-content nav ul li a");
    subnavLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();

        let target = document.querySelector(event.target!["hash"]);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      })
    })

    // Sets the current selection
    const updateSidebar = () => {
      const fromTop = window.scrollY;
      let currentPossibleAnchor: HTMLAnchorElement | undefined

      // Scroll down to find the highest anchor on the screen
      subnavLinks.forEach(link => {
        try {
          const section = document.querySelector<HTMLDivElement>(link.hash);
          if (!section) { return }
          const isBelow = section.offsetTop <= fromTop
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

    setupHandbookHovers()

    return () => {
      window.removeEventListener("scroll", updateSidebar)
    }
  }, [])

  const { previous, next } = props.pageContext
  if (!post.frontmatter) throw new Error(`No front-matter found for the file with props: ${props}`)
  if (!post.html) throw new Error(`No html found for the file with props: ${props}`)

  const selectedID = post.frontmatter.permalink!.split("/").pop()!.replace(".html", "") || "index"
  const showSidebar = !post.frontmatter.disable_toc && post.headings && !!post.headings.length && post.headings.length <= 30

  return (
    <Layout title={"Handbook - " + post.frontmatter.title} description={post.frontmatter.oneline || ""} lang="en" allSitePage={props.data.allSitePage}>
      <section id="doc-layout">
        <SidebarToggleButton />

        <Sidebar navItems={oldHandbookNavigation} selectedID={selectedID} />
        <div id="handbook-content">
          <h2>{post.frontmatter.title}</h2>
          <article>

            <div className="whitespace raised">
              <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html! }} />
              <div id="mouse-hover-info" className="hover-info" style={{ display: "none" }} />
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
        </div>
      </section>
      {/* 
      <ul>
        <li>
          {previous && (
            <Link to={previous.fields.slug} rel="prev"> ← {previous.frontmatter.title} </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={next.fields.slug} rel="next">{next.frontmatter.title} →</Link>
          )}
        </li>
      </ul>
      */}
    </Layout>
  )
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><HandbookTemplate {...props} /></Intl>

export const pageQuery = graphql`
  query GetHandbookBySlug($slug: String!) {
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
  }
`
