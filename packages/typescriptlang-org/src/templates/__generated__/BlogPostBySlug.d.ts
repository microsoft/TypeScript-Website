/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlogPostBySlug
// ====================================================

export interface BlogPostBySlug_markdownRemark_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  permalink: string | null;
  title: string | null;
}

export interface BlogPostBySlug_markdownRemark {
  __typename: "MarkdownRemark";
  id: string;
  excerpt: string | null;
  html: string | null;
  frontmatter: BlogPostBySlug_markdownRemark_frontmatter | null;
}

export interface BlogPostBySlug {
  markdownRemark: BlogPostBySlug_markdownRemark | null;
}

export interface BlogPostBySlugVariables {
  slug: string;
}
