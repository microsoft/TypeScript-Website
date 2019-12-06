/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetHandbookBySlug
// ====================================================

export interface GetHandbookBySlug_markdownRemark_headings {
  __typename: "MarkdownHeading";
  value: string | null;
  depth: number | null;
}

export interface GetHandbookBySlug_markdownRemark_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  permalink: string | null;
  title: string | null;
}

export interface GetHandbookBySlug_markdownRemark {
  __typename: "MarkdownRemark";
  id: string;
  excerpt: string | null;
  html: string | null;
  headings: (GetHandbookBySlug_markdownRemark_headings | null)[] | null;
  frontmatter: GetHandbookBySlug_markdownRemark_frontmatter | null;
}

export interface GetHandbookBySlug {
  markdownRemark: GetHandbookBySlug_markdownRemark | null;
}

export interface GetHandbookBySlugVariables {
  slug: string;
}
