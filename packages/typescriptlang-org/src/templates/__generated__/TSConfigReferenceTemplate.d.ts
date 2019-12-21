/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TSConfigReferenceTemplate
// ====================================================

export interface TSConfigReferenceTemplate_sitePage_fields_categories_categories_options {
  __typename: "SitePageFieldsCategoriesCategoriesOptions";
  anchor: string | null;
}

export interface TSConfigReferenceTemplate_sitePage_fields_categories_categories {
  __typename: "SitePageFieldsCategoriesCategories";
  display: string | null;
  anchor: string | null;
  options: (TSConfigReferenceTemplate_sitePage_fields_categories_categories_options | null)[] | null;
}

export interface TSConfigReferenceTemplate_sitePage_fields_categories {
  __typename: "SitePageFieldsCategories";
  categories: (TSConfigReferenceTemplate_sitePage_fields_categories_categories | null)[] | null;
}

export interface TSConfigReferenceTemplate_sitePage_fields {
  __typename: "SitePageFields";
  categories: TSConfigReferenceTemplate_sitePage_fields_categories | null;
}

export interface TSConfigReferenceTemplate_sitePage {
  __typename: "SitePage";
  id: string;
  fields: TSConfigReferenceTemplate_sitePage_fields | null;
}

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
  sitePage: TSConfigReferenceTemplate_sitePage | null;
  markdownRemark: TSConfigReferenceTemplate_markdownRemark | null;
}

export interface TSConfigReferenceTemplateVariables {
  path?: string | null;
  tsconfigMDPath: string;
}
