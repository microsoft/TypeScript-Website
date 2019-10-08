// @ts-check
import React from "react"
import { Link, graphql } from "gatsby"
import {BlogPostBySlug} from "./__generated__/BlogPostBySlug"
// import Bio from "../components/bio"
import {Layout} from "../components/layout"
// import SEO from "../components/seo"
// import { rhythm, scale } from "../utils/typography"

class BlogPostTemplate extends React.Component<{ pageContext: any,  data: BlogPostBySlug}> {
  render() {
    const post = this.props.data.markdownRemark
    if (!post) {
      console.log("Could not render:", JSON.stringify(this.props))
      return <div></div>
    }

    const { previous, next } = this.props.pageContext
    return (
      <Layout >

        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr/>
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
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(frontmatter: { permalink: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        permalink
      }
    }
  }
`
