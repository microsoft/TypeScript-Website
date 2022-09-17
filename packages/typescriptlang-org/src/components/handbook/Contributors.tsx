import React, { useEffect } from "react";
import attribution from "../../../../documentation/output/attribution.json";
import { doesLocalePageExist } from "../layout/doesLocalePageExist";
import { isEnglishPath } from "../layout/isEnglishPath";

interface ContributorsProps {
  i: (string) => string;
  path: string;
  lastEdited: string;
  lang: string;
}

const Row = (props: { children: any; className?: string }) =>
  <div className={["row", props.className].join(" ")}>{props.children}</div>;

const Section = (props: { children: any; className?: string; sKey: string }) =>
  <div key={props.sKey} className="bottom-section-content">
    {props.children}
  </div>;

export const Contributors = (props: ContributorsProps) => {
  const attrPath = props.path.replace("/packages/documentation/", "");
  const page = attribution[attrPath];
  const shouldRedirectToLocalization = !isEnglishPath() && doesLocalePageExist()

  // https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/en/Advanced%20Types.md
  const reposRootURL = !shouldRedirectToLocalization ?
    "https://github.com/microsoft/TypeScript-Website/blob/v2" :
    "https://github.com/microsoft/TypeScript-Website-Localizations/blob/main/docs/documentation";
  const path = !shouldRedirectToLocalization ?
    props.path :
    props.path.replace(/^.*\/packages\/documentation\/copy/g, '');
  const repoPageURL = reposRootURL + path;

  const d = new Date(props.lastEdited);
  const dtf = new Intl.DateTimeFormat(
    props.lang,
    { year: "numeric", month: "short", day: "2-digit" },
  );
  const lastEdited = dtf.format(d);

  useEffect(() => {
    // @ts-ignore
    const perf = window.performance || window.mozPerformance ||
      // @ts-ignore
      window.msPerformance || window.webkitPerformance || {};
    const t = perf.timing;
    if (!t) return;

    const pageLoadIndicator = document.querySelector("#page-loaded-time");
    if (pageLoadIndicator?.innerHTML.includes("This page")) return;

    const start = t.navigationStart;
    const end = t.domInteractive;
    const loadTime = (end - start) / 1000;

    // No idea how this is happening, likely from React re-rendering
    if (loadTime < 0) return;

    if (pageLoadIndicator) {
      pageLoadIndicator.innerHTML = "This page loaded in " + loadTime +
        " seconds.</p>";
    }
  }, []);

  return (
    <div className="whitespace-tight raised" style={{ padding: 0 }}>
      <Row className="justify-between small-columns">
        <Section sKey="pr">
          <p>
            The TypeScript docs are an open source project. Help us improve
            these pages <a href={repoPageURL}>by sending a Pull Request</a> ❤
          </p>
        </Section>
        <div
          key="line1"
          className="hide-small vertical-line"
          style={{ marginTop: "1.5rem" }}
        />
        <Section sKey="contribs">
          Contributors to this page:<br />
          <Avatars data={page} />
        </Section>
        <div
          key="line2"
          className="hide-small vertical-line"
          style={{ marginTop: "1.5rem" }}
        />
        <Section sKey="updated">
          <p>
            {`Last updated: ${lastEdited}`}
            <br />
            <br />
            <span id="page-loaded-time">&nbsp;</span>
          </p>
        </Section>
      </Row>
    </div>
  );
};

const Avatars = (
  props: {
    data: typeof attribution["copy/en/declaration-files/By Example.md"];
  },
) => {
  const showRest = props.data && props.data.total > props.data.top.length;
  return <div>
    {props.data && props.data.top.map((t) => {
      const grav = t.gravatar.startsWith("http") ? t.gravatar : `https://gravatar.com/avatar/${t.gravatar}?s=32&&d=blank`;
      const alt = `${t.name}  (${t.count})`;
      const chars = t.name.split(" ").map((dp) => dp.substr(0, 1)).join("")
        .toUpperCase();
      return <div key={t.gravatar} className="circle-bg">
        {chars}
        <img id={t.gravatar} src={grav} alt={alt} />
      </div>;
    })}
    {showRest &&
      <div className="circle-bg">
        {props.data.total - props.data.top.length}+
      </div>}
  </div>;
};
