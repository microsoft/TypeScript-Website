## How Does The i18n Work in The Site?

Let's take some example code from inside the [top navigation bar](../packages/typescriptlang-org/src/components/layout/TopNav.tsx) on the site:

```ts
// prettier-ignore
<nav role="navigation">
  <ul>
    <li className="nav-item hide-small"><IntlLink to="/download">{i("nav_download")}</IntlLink></li>
    <li className="nav-item"><IntlLink to="/docs/home"><span>{i("nav_documentation_short")}</span></IntlLink></li>
    <li className="nav-item show-only-large"><IntlLink to="/docs/handbook/intro.html">{i("nav_handbook")}</IntlLink></li>
    <li className="nav-item"><IntlLink to="/community">{i("nav_community")}</IntlLink></li>
    <li className="nav-item show-only-largest"><IntlLink to="/play">{i("nav_playground")}</IntlLink></li>
    <li className="nav-item"><IntlLink to="/tools">{i("nav_tools")}</IntlLink></li>
  </ul>
</nav>
```

There are two i18n primitives in here:

- `IntlLink`
- `i("nav_download")`

## IntlLink

An IntlLink is a <Link> element, which is effectively an `<a>`, but that it knows the entire sitemap and the current locale.

This means the link will detect whether there is a version of the page available in the current locale if possible. You just write the English URL.

## i("x")

This is [React Intl](https://www.npmjs.com/package/react-intl).

There are a few parts which lead up to having an `i("x")`. Let's go in order:

- A site page which can be internationalized must be wrapped in an [`Intl` component](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/components/Intl.tsx#L7)

  This sets up the language copy based in the locale, it uses a dynamic require to [the `copy/`](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/copy/) folder + the locale + `.ts`. This sets up the outer context.

  In the site, we have this as the `default export` for i18n'd pages

  ```ts
  export default (props: Props) => (
    <Intl locale={props.pageContext.lang}>
      <Comm {...props} />
    </Intl>
  )
  ```

- At the start of the react component for the page, we create an `i`:

  ```ts
  type Props = {
    data: CommunityPageQuery
    pageContext: any
  }

  export const Comm: React.FC<Props> = props => {
    const intl = useIntl()
    const i = createInternational<typeof comCopy>(intl)
    // ...
  }
  ```

  The first relevant line is `useIntl()` which is a standard feature of react-intl.

  The second wraps the result of `useIntl` into a function which lets you use the types to determine the keys available in for this file.
