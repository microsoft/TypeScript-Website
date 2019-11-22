import React from "react"
import { Link, graphql } from "gatsby"
import { BlogPostBySlug } from "./__generated__/BlogPostBySlug"
import { Layout } from "../components/layout"
import { Sidebar } from "../components/layout/Sidebar"
import { oldHandbookNavigation } from "../lib/oldNavigation"

import "./handbook.scss"
import "./document.scss"
import "./markdown.scss"

class BlogPostTemplate extends React.Component<{ pageContext: any, data: BlogPostBySlug, path: string }> {
  render() {
    const post = this.props.data.markdownRemark
    if (!post) {
      console.log("Could not render:", JSON.stringify(this.props))
      return <div></div>
    }

    const { previous, next } = this.props.pageContext
    const selectedID = this.props.path.split("/").pop().replace(".html", "")

    return (
      <Layout >
        <section id="doc-layout">
          <Sidebar navItems={oldHandbookNavigation} selectedID={selectedID}/>
          <div id="handbook-content">
            <h2>{post.frontmatter.title}</h2>
            <div className="ms-depth-4" style={{ backgroundColor: "white", margin: "1rem auto", padding: "2rem" }}>
              <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
          </div>
        </section>
        <hr />
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
        title
      }
    }
  }
`
