import React from "react"
import { graphql } from "gatsby"
import { TSConfigReferenceTemplate } from "./__generated__/TSConfigReferenceTemplate"
import { Layout } from "../components/layout"

import "./markdown.scss"
import "./tsconfig.scss"

class TSConfigReferenceTemplateComponent extends React.Component<{ pageContext: any, data: TSConfigReferenceTemplate }> {
  render() {
    const post = this.props.data.markdownRemark
    if (!post) {
      console.log("Could not render:", JSON.stringify(this.props))
      return <div></div>
    }

    // if (!post.html) throw new Error("No HTML found for TSConfig page")

    return (
      <Layout >
        <div className="tsconfig ms-depth-4" style={{ backgroundColor: "white", maxWidth: 960, margin: "1rem auto", padding: "2rem", paddingTop: "0.5rem" }}>
          <h1>TSConfig Reference</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html! }} />
        </div>
      </Layout>
    )
  }
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
