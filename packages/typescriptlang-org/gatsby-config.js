module.exports = {
  plugins: [
    "gatsby-plugin-codegen",
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../handbook-v1/en`,
        name: `handbook-v1`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
  ],
}
