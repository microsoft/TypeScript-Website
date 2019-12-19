import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { TSConfigReferenceTemplate } from "./__generated__/TSConfigReferenceTemplate"
import { Layout } from "../components/layout"

import categories from "../../../tsconfig-reference/output/en.json"

import "./markdown.scss"
import "./tsconfig.scss"

const TSConfigReferenceTemplateComponent = (props: { pageContext: any, data: TSConfigReferenceTemplate, path: string }) => {

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
        const isBelow = section.offsetTop <= fromTop
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
    return () => {
      window.removeEventListener("scroll", updateSidebar)
    }
  })


  return (
    <Layout >
      <div className="tsconfig ms-depth-4" style={{ backgroundColor: "white", maxWidth: 960, margin: "1rem auto", paddingTop: "0.5rem" }}>
        <nav>
          {categories.categories.map(c => <li key={c.anchor}><a href={"#" + c.anchor}>{c.display}</a></li>)}
        </nav>
        <div style={{ padding: "2rem" }}>
          <h1>TSConfig Reference</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html! }} />
        </div>
      </div>
    </Layout>
  )
}


export default TSConfigReferenceTemplateComponent

export const pageQuery = graphql`
  query TSConfigReferenceTemplate($tsconfigMDPath: String!) {
    markdownRemark(fileAbsolutePath: {eq: $tsconfigMDPath} ) {
      id
      html

      frontmatter {
        permalink
      }
    }
  }
`
