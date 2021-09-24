import * as React from "react";
import { Layout } from "../../../components/layout";

import "../css/documentation.scss";
import { Intl } from "../../../components/Intl";

import { docCopy } from "../../../copy/en/documentation";
import { createInternational } from "../../../lib/createInternational";
import { useIntl } from "react-intl";
import { QuickJump } from "../../../components/QuickJump";
import { getDocumentationNavForLanguage } from "../../../lib/documentationNavigation"

import { Link } from "gatsby"

import "../css/documentation.scss"
import "../../documentation.scss"

type Props = {
  pageContext: any;
};

const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof docCopy>(useIntl());
  const nav = getDocumentationNavForLanguage(props.pageContext.lang)

  const RenderItems = ({ items }) => {
    if (!items.items) return null

    return items.items && items.items.map(item => {
      const path = item.permalink!
      if (item.items) {
        return <> 
          <li key={item.id}>{item.title}</li>
          <li><ul><RenderItems items={item}/></ul></li>
        </>
      } else {

      return <li key={item.id}>
        <Link to={path}>{item.title}</Link>
       </li>
      }
    })
  }
  
  return (
    <Layout title={i("doc_layout_title")} description={i("doc_layout_description")} lang={props.pageContext.lang}>

      <div className="main-content-block headline" style={{ marginTop: "40px" }}>
        <h1>TypeScript Documentation</h1>
      </div>

      <div className="main-content-block container handbook-content" >
        <div className="columns wide">
          {nav.map(navRoot => {
            if (navRoot.id === "what's-new") return null
            const showIntro = navRoot.id === "handbook"

            return (
              <div className="item raised" key={navRoot.id}>

                <h4>{navRoot.title}</h4>
                <p>{navRoot.oneline || " "}</p>

                <ul>
                  <RenderItems items={navRoot} />
                </ul>

                {showIntro && <p>We also have an <a href='/assets/typescript-handbook.epub'>epub</a> and <a href='/assets/typescript-handbook.pdf'>pdf</a> version of the Handbook.</p>}
              </div>
            )
          })}
        </div>
      </div>

      <QuickJump title={i("doc_headline")} lang={props.pageContext.lang} />
    </Layout>
  );
};

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <Index {...props} />
  </Intl>
);
