import React, { useEffect } from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { Intl } from "../components/Intl"
import { headCopy } from "../copy/en/head-seo"

import "./markdown.scss"
import "./tsconfig.scss"

import { setupTwoslashHovers } from "shiki-twoslash/dist/dom"

type Props = { pageContext: any, data: GatsbyTypes.TSConfigReferenceTemplateQuery, path: string }

const GlossaryTemplateComponent = (props) => {
  const i = createInternational<typeof headCopy>(useIntl())

  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  useEffect(() => {
    //   // Overrides the anchor behavior to smooth scroll instead
    //   // Came from https://css-tricks.com/sticky-smooth-active-nav/
    //   const subnavLinks = document.querySelectorAll<HTMLAnchorElement>(".tsconfig nav li a");

    //   subnavLinks.forEach(link => {
    //     link.addEventListener("click", event => {
    //       event.preventDefault();

    //       let target = document.querySelector(event.target!["hash"]);
    //       target.scrollIntoView({ behavior: "smooth", block: "start" });
    //     })
    //   })

    //   // Sets the current selection
    //   const updateSidebar = () => {
    //     const fromTop = window.scrollY;
    //     let currentPossibleAnchor: HTMLAnchorElement | undefined

    //     // Scroll down to find the highest anchor on the screen
    //     subnavLinks.forEach(link => {
    //       const section = document.querySelector<HTMLDivElement>(link.hash);
    //       if (!section) { return }
    //       const isBelow = section.offsetTop - 100 <= fromTop
    //       if (isBelow) currentPossibleAnchor = link
    //     });

    //     // Then set the active tag
    //     subnavLinks.forEach(link => {
    //       if (link === currentPossibleAnchor) {
    //         link.classList.add("current");
    //       } else {
    //         link.classList.remove("current");
    //       }
    //     })
    //   }

    //   // Handles setting the scroll 
    //   window.addEventListener("scroll", updateSidebar, { passive: true, capture: true });
    //   updateSidebar()
    setupTwoslashHovers()

    return () => {
      // window.removeEventListener("scroll", updateSidebar)
    }
  }, [])
  const meta = props.pageContext.languageMeta as typeof import("../../../glossary/output/en.json")
  console.log(props)
  return (
    <Layout title={i("tsconfig_title")} description={i("tsconfig_description")} lang={props.pageContext.locale}>

      <ul>
        {meta.terms.map(t => {
          return <li><a href={"#" + t.id}>{t.display}</a></li>
        })}
      </ul>
      <div dangerouslySetInnerHTML={{ __html: post.html! }} />
    </Layout>
  )
}


export const pageQuery = graphql`
  query GlossaryTemplate($glossaryPath: String!) {
    markdownRemark(fileAbsolutePath: {eq: $glossaryPath} ) {
      id
      html
      frontmatter {
        permalink
      }
    }
  }
`


export default (props: Props) => <Intl locale={props.pageContext.locale}><GlossaryTemplateComponent {...props} /></Intl>
