import * as React from "react";
import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational";
import { docCopy } from "../copy/en/documentation";
import { createIntlLink } from "./IntlLink";

// Automatic metadata from npm and VS Marketplace
import releaseInfo from "../lib/release-info.json";
import { withPrefix } from "gatsby";

export type Props = {
  title: string;
  lang: string;
};
export const QuickJump = (props: Props) => {
  const intl = useIntl();
  const i = createInternational<typeof docCopy>(intl);
  i;

  const releaseURL = withPrefix(releaseInfo.releaseNotesURL);
  let betaURL: string | undefined = undefined;
  if (releaseInfo.isBeta) betaURL = releaseInfo.betaPostURL;
  if (releaseInfo.isRC) betaURL = releaseInfo.rcPostURL;

  const IntlLink = createIntlLink(props.lang);

  // TODO: Internationalize these strings
  return <div className="main-content-block">
    <h2 style={{ textAlign: "center" }}>{props.title}</h2>
    <div className="columns">
      <div className="item raised">
        <h4>Get Started</h4>
        <ul>
          <li>
            <IntlLink to="/docs/bootstrap">
              Bootstrap a TS project
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/typescript-in-5-minutes.html">
              JS to TS
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/typescript-from-scratch.html">
              New to Programming
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/typescript-in-5-minutes-oop.html">
              OOP to JS
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/typescript-in-5-minutes-func.html">
              Functional to JS
            </IntlLink>
          </li>
          <li><IntlLink to="/download">Installation</IntlLink></li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Handbook</h4>
        <ul>
          <li>
            <IntlLink to="/docs/handbook/basic-types.html">
              Basic Types
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/advanced-types.html">
              Advanced Types
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/interfaces.html">
              Interfaces
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/variable-declarations.html">
              Variable Declarations
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/functions.html">Functions</IntlLink>
          </li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Tools</h4>
        <ul>
          <li><IntlLink to="/play/">Playground</IntlLink></li>
          <li><IntlLink to="/tsconfig/">TSConfig Reference</IntlLink></li>
        </ul>
        <h4 style={{ marginTop: "28px" }}>Release Notes</h4>
        <ul>
          {betaURL
            ? <li>
              <a href={betaURL}>
                What's upcoming in {releaseInfo.tags.betaMajMin}?
              </a>
            </li>
            : null}
          <li>
            <IntlLink to={releaseURL}>
              What's new in {releaseInfo.tags.stableMajMin}
            </IntlLink>
          </li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Tutorials</h4>
        <ul>
          <li>
            <IntlLink to="/docs/handbook/asp-net-core.html">ASP.NET</IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/migrating-from-javascript.html">
              Migrating from JS
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/dom-manipulation.html">
              Working with the DOM
            </IntlLink>
          </li>
          <li>
            <IntlLink to="/docs/handbook/react-&-webpack.html">
              React &amp; Webpack
            </IntlLink>
          </li>
        </ul>
      </div>
    </div>
  </div>;
};
