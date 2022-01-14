import * as React from "react";
import { Layout } from "../../../components/layout";

import "../css/documentation.scss";
import { Intl } from "../../../components/Intl";

import { docCopy } from "../../../copy/en/documentation";
import { cheatCopy } from "../../../copy/en/cheatsheets";

import { createInternational } from "../../../lib/createInternational";
import { useIntl } from "react-intl";
import { QuickJump } from "../../../components/QuickJump";
import { getDocumentationNavForLanguage } from "../../../lib/documentationNavigation"

import { Link } from "gatsby"

import "../css/documentation.scss"
import "../../documentation.scss"
import { SidebarNavItem } from "../../../lib/documentationNavigationUtils";

type Props = {
  pageContext: any;
};


const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof docCopy & typeof cheatCopy>(useIntl());
  const nav = getDocumentationNavForLanguage(props.pageContext.lang)
  
  const cheatSheets: SidebarNavItem = {
    id: "cheat",
    title: i("cht_layout_title"),
    oneline: i("cht_blurb_1") + ".",
    items: [ 
      {
        id: "1",
        title: i("cht_cfa"),
        permalink: require("../../../../static/images/cheatsheets/TypeScript Control Flow Analysis.png").default
      },
      {
        id: "2",
        title: i("cht_classes"),
        permalink: require("../../../../static/images/cheatsheets/TypeScript Classes.png").default
      },
      {
        id: "3",
        title: i("cht_interfaces"),
        permalink: require("../../../../static/images/cheatsheets/TypeScript Interfaces.png").default
      },
      {
        id: "4",
        title: i("cht_types"),
        permalink: require("../../../../static/images/cheatsheets/TypeScript Types.png").default
      },
      {
        id: "5",
        title: i("cht_dl_title"),
        permalink: "/assets/typescript-cheat-sheets.zip"
      }
    ]
  }

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
        { path.endsWith("png") ?
          <a href={path}>{item.title}</a> :
          <Link to={path}>{item.title}</Link>
        }
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
          {[...nav, cheatSheets].map(navRoot => {
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
