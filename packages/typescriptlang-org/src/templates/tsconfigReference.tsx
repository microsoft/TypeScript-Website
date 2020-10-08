import React, { useEffect } from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { Intl } from "../components/Intl"
import { headCopy } from "../copy/en/head-seo"

import "./markdown.scss"
import "./tsconfig.scss"

import { TSConfigReferenceTemplateQuery } from "../__generated__/gatsby-types"
import { setupTwoslashHovers } from "shiki-twoslash/dist/dom"

type Props = { pageContext: any, data: TSConfigReferenceTemplateQuery, path: string }

const TSConfigReferenceTemplateComponent = (props) => {
  const i = createInternational<typeof headCopy>(useIntl())

  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  useEffect(() => {
    // Overrides the anchor behavior to smooth scroll instead
    // Came from https://css-tricks.com/sticky-smooth-active-nav/
    const subnavLinks = document.querySelectorAll<HTMLAnchorElement>(".tsconfig nav li a");

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
        const section = document.querySelector<HTMLDivElement>(link.hash);
        if (!section) { return }
        const isBelow = section.offsetTop - 100 <= fromTop
        if (isBelow) currentPossibleAnchor = link
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
    updateSidebar()
    setupTwoslashHovers()

    return () => {
      window.removeEventListener("scroll", updateSidebar)
    }
  }, [])

  return (
    <Layout title={i("tsconfig_title")} description={i("tsconfig_description")} lang={props.pageContext.locale} allSitePage={props.data.allSitePage}>
      <div className="tsconfig raised main-content-block markdown">
        <div dangerouslySetInnerHTML={{ __html: post.html! }} />
      </div>
    </Layout>
  )
}


export const pageQuery = graphql`
  query TSConfigReferenceTemplate($tsconfigMDPath: String!) {
    ...AllSitePage

    markdownRemark(fileAbsolutePath: {eq: $tsconfigMDPath} ) {
      id
      html
      frontmatter {
        permalink
      }
    }
  }
`


export default (props: Props) => <Intl locale={props.pageContext.locale}><TSConfigReferenceTemplateComponent {...props} /></Intl>
