import React from "react"
import { graphql } from "gatsby"
import {TSConfigReferenceTemplate} from "./__generated__/TSConfigReferenceTemplate"
import {Layout} from "../components/layout"

class TSConfigReferenceTemplateComponent extends React.Component<{ pageContext: any,  data: TSConfigReferenceTemplate}> {
  render() {
    console.log(this.props)
    const post = this.props.data.markdownRemark
    if (!post) {
      console.log("Could not render:", JSON.stringify(this.props))
      return <div></div>
    }

    return (
      <Layout >

        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr/>
        
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
