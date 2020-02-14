import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { TSConfigReferenceTemplate } from "./__generated__/TSConfigReferenceTemplate"
import { Layout } from "../components/layout"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { Intl } from "../components/Intl"
import { headCopy } from "../copy/en/head-seo"

import "./markdown.scss"
import "./tsconfig.scss"

type Props = { pageContext: any, data: TSConfigReferenceTemplate, path: string }

const TSConfigReferenceTemplateComponent = (props: Props) => {
  const i = createInternational<typeof headCopy>(useIntl())

  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  const categories = props.data.sitePage!.fields!.categories

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
    <Layout title={i("tsconfig_title")} description={i("tsconfig_description")} lang={props.pageContext.locale} allSitePage={props.data.allSitePage}>
      <div className="tsconfig raised" style={{ maxWidth: 960, margin: "1rem auto", paddingTop: "0.5rem" }}>
        <div id="full-option-list" className="indent">
          {categories!.categories!.map(c => {
            if (!c) return null
            return <div className="tsconfig-nav-top" key={c.anchor!}>
              <h5><a href={"#" + c.anchor}>{c.display}</a></h5>
              <ul key={c.anchor!}>
                {c.options!.map(element => <li key={element!.anchor!}><a href={"#" + element!.anchor!}>{element!.anchor}</a></li>)}
              </ul>
            </div>
          })}
        </div>

        <nav id="sticky">
          {categories!.categories!.map(c => <li key={c!.anchor!}><a href={"#" + c!.anchor}>{c!.display}</a></li>)}
        </nav>

        <div className="indent">
          <div dangerouslySetInnerHTML={{ __html: post.html! }} />
        </div>
      </div>
    </Layout>
  )
}


export const pageQuery = graphql`
  query TSConfigReferenceTemplate($path: String, $tsconfigMDPath: String!) {
    ...AllSitePage

    sitePage(path: { eq: $path }) {
      id
      fields {
        categories {
          categories {
            display
            anchor
            options {
              anchor
            }
          }
        }
      }
    }

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
