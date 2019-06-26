# Jekyll Markdown Link Converter

Converts Markdown-linked documents to link to their respective HTML outputs.

# Usage

1. Clone this repository into your Jekyll source directory's `_plugins` folder.
2. Somewhere in your `_config.yml` file, add the line `markdown: JekyllMarkdownLinkConverter`.

# Motivation

Let's say you author several markdown documents, each which conveniently link to each other.

* `./Document A.md`

    ```markdown
    ---
    permalink: document-a.html
    ---

    See [Document B](Document B.md) for more details.
    ```

* `./Document B.md`

    ```markdown
    ---
    permalink: document-b.html
    ---

    See [Document A](Document A.md) for more details.
    ```

Problematically, Jekyll/Kramdown won't convert these to in the produced HTML that you might specify in the permalink.

* `./document-a.html`

    ```html
    See <a href="Document B.md">Document B</a> for more details.
    ```

* `./document-b.html`

    ```markdown
    See <a href="Document A.md">Document A</a> for more details.
    ```

This Jekyll plugin is a basic workaround for this issue.
In the above example, it will instead output the following HTML documents.

* `./document-a.html`

    ```html
    See <a href="document-b.html">Document B</a> for more details.
    ```

* `./document-b.html`

    ```markdown
    See <a href="document-b.html">Document A</a> for more details.
    ```

# Expectations

Each markdown document needs to be permalinked to its current filename, after its name has been

1. Lowercased.
2. Had consecutive whitespace and individual dots replaced with hyphens.
