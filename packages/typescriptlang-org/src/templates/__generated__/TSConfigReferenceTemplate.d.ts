/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TSConfigReferenceTemplate
// ====================================================

export interface TSConfigReferenceTemplate_markdownRemark_frontmatter {
  __typename: "MarkdownRemarkFrontmatter";
  permalink: string | null;
}

export interface TSConfigReferenceTemplate_markdownRemark {
  __typename: "MarkdownRemark";
  id: string;
  html: string | null;
  frontmatter: TSConfigReferenceTemplate_markdownRemark_frontmatter | null;
}

export interface TSConfigReferenceTemplate {
  markdownRemark: TSConfigReferenceTemplate_markdownRemark | null;
}

export interface TSConfigReferenceTemplateVariables {
  tsconfigMDPath: string;
}
