import * as React from "react"
import { useEffect, useState } from "react"

import "./SiteFooter.scss"
import { PlaygroundSamples } from "./SiteFooter-PlaygroundSamples"
import { AllSitePage, createIntlLink } from "../IntlLink"
import { whenEscape } from "../../lib/whenEscape"

export type Props = {
  lang: string
  suppressCustomization?: true
  allSitePage: AllSitePage
}

const popularPages = [
  {
    title: "Basic Types",
    url: "/docs/handbook/basic-types.html",
    description: "JavaScript primitive types inside TypeScript",
  },
  {
    title: "Advanced Types",
    url: "/docs/handbook/advanced-types.html",
    description: "TypeScript language extensions to JavaScript",
  },
  {
    title: "Functions",
    url: "/docs/handbook/functions.html",
    description: "How to provide types to functions in JavaScript",
  },
  {
    title: "Interfaces",
    url: "/docs/handbook/interfaces.html",
    description: "How to provide a type shape to JavaScript objects",
  },
  {
    title: "Variable Declarations",
    url: "/docs/handbook/variable-declarations.html",
    description: "How to create and type JavaScript variables",
  },
  {
    title: "TypeScript in 5 minutes",
    url: "/docs/handbook/typescript-in-5-minutes.html",
    description: "An overview of building a TypeScript web app",
  },
  {
    title: "TSConfig Options",
    url: "/docs/handbook/tsconfig-json.html",
    description: "JavaScript primitive types inside TypeScript",
  },
  {
    title: "Classes",
    url: "/docs/handbook/classes.html",
    description: "How to provide types to JavaScript ES6 classes",
  },
]

const useTypeScriptLinks = [
  {
    title: "Get Started",
    url: "/docs/home",
  },
  {
    title: "Download",
    url: "/download",
  },
  {
    title: "Community",
    url: "/community",
  },
  {
    title: "Playground",
    url: "/play/",
  },
  {
    title: "TSConfig Ref",
    url: "/tsconfig",
  },
  {
    title: "Code Samples",
    url: "/play/#show-examples",
  },
  {
    title: "Why TypeScript",
    url: "/why-create-typescript",
  },
  {
    title: "Design",
    url: "/branding",
  },
]

const communityLinks = [
  {
    title: "Get Help",
    url: "/community",
  },
  {
    title: "Blog",
    url: "https://devblogs.microsoft.com/typescript/",
  },
  {
    title: "GitHub Repo",
    url: "https://github.com/microsoft/TypeScript/#readme",
  },
  {
    title: "Community Chat",
    url: "https://discord.gg/typescript",
  },
  {
    title: "@TypeScript",
    url: "https://twitter.com/TypeScript",
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com/questions/tagged/typescript",
  },
  {
    title: "Web Updates",
    url: "https://github.com/microsoft/TypeScript-Website/issues/130",
  },
  {
    title: "Web Repo",
    url: "https://github.com/microsoft/TypeScript-Website",
  },
]

const faviconForURL = (url: string) => {
  switch (url) {
    case "https://github.com/microsoft/TypeScript-Website":
    case "https://github.com/microsoft/TypeScript/#readme":
      return (
        <svg
          fill="none"
          height="12"
          viewBox="0 0 12 12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="m6.03927.165405c-3.27055 0-5.922909 2.652005-5.922909 5.923645 0 2.61709 1.697089 4.83705 4.050909 5.62035.29636.0546.40436-.1284.40436-.2854 0-.1408-.00509-.5131-.008-1.0073-1.64763.3578-1.99527-.7942-1.99527-.7942-.26946-.68436-.65782-.86654-.65782-.86654-.53782-.36727.04073-.36001.04073-.36001.59454.04182.90727.61055.90727.61055.52836.90509 1.38655.64364 1.724.492.05382-.38254.20691-.64363.376-.79163-1.31527-.14946-2.69818-.65782-2.69818-2.92764 0-.64654.23091-1.17564.60982-1.58946-.06109-.14981-.26437-.75236.05818-1.56763 0 0 .49709-.15927 1.62872.60727.47237-.13163.97928-.19709 1.48291-.19964.50328.00255 1.00982.06801 1.48291.19964 1.13091-.76654 1.62727-.60727 1.62727-.60727.32328.81527.12001 1.41782.05928 1.56763.37964.41382.60873.94292.60873 1.58946 0 2.27564-1.38509 2.77636-2.70437 2.92291.21237.18291.40182.54436.40182 1.09672 0 .79204-.00727 1.43094-.00727 1.62514 0 .1585.10691.3429.40727.2851 2.35197-.7851 4.04767-3.00369 4.04767-5.62005 0-3.27164-2.6524-5.923645-5.92403-5.923645z"
            fill="#fffffe"
            fillRule="evenodd"
          />
        </svg>
      )
    case "https://twitter.com/TypeScript":
      return (
        <svg
          fill="none"
          height="10"
          viewBox="0 0 13 10"
          width="13"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m4.58519 10c4.62962 0 7.16291-3.83919 7.16291-7.16289 0-.10801 0-.21602-.0049-.32403.4909-.35348.918-.80024 1.2568-1.30591-.4517.20128-.9377.33384-1.4483.39766.5204-.30929.9181-.805148 1.1095-1.394284-.486.289658-1.026.495856-1.6004.608773-.4615-.490946-1.11448-.7953322-1.83617-.7953322-1.38938 0-2.51856 1.1291732-2.51856 2.5185532 0 .19638.02455.38785.06383.57441-2.09143-.1031-3.94721-1.10954-5.1893-2.631474-.21602.373119-.33876.805154-.33876 1.266644 0 .87388.44677 1.64467 1.11936 2.09634-.41239-.01473-.80024-.12765-1.13899-.31421v.03437c0 1.21754.86897 2.23871 2.01778 2.46946-.2111.05891-.43203.08837-.66277.08837-.16202 0-.31912-.01473-.47131-.04419.31911 1.00153 1.25191 1.72813 2.35163 1.74777-.86406.67751-1.94906 1.08008-3.12733 1.08008-.20128 0-.402571-.00982-.59895-.03436 1.10954.70696 2.43509 1.12425 3.85393 1.12425z"
            fill="#fff"
          />
        </svg>
      )
    case "https://discord.gg/typescript":
      return (
        <svg
          fill="none"
          height="10"
          viewBox="0 0 11 10"
          width="11"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m9.05511 0h-7.11021c-.59959 0-1.087753.46-1.087753 1.03v6.76c0 .57.488163 1.03 1.087753 1.03h6.01715l-.28123-.925.67918.595.64205.56 1.14085.95v-8.97c0-.57-.4882-1.03-1.08779-1.03zm-2.04817 6.53s-.19102-.215-.3502-.405c.6951-.185.96041-.595.96041-.595-.21755.135-.42449.23-.61021.295-.2653.105-.52.175-.76938.215-.50939.09-.97633.065-1.37429-.005-.30245-.055-.56245-.135-.78-.215-.12204-.045-.25469-.1-.38735-.17-.01592-.01-.03183-.015-.04775-.025-.01061-.005-.01592-.01-.02123-.015-.09551-.05-.14857-.085-.14857-.085s.2547.4.92857.59c-.15918.19-.35551.415-.35551.415-1.17265-.035-1.61836-.76-1.61836-.76 0-1.61.76408-2.915.76408-2.915.76408-.54 1.49102-.525 1.49102-.525l.05306.06c-.9551.26-1.39551.655-1.39551.655s.11673-.06.31306-.145c.56776-.235 1.01878-.3 1.20449-.315.03184-.005.05837-.01.0902-.01.32368-.04.6898-.05 1.07184-.01.50408.055 1.04531.195 1.59714.48 0 0-.41918-.375-1.32122-.635l.07428-.08s.72694-.015 1.49103.525c0 0 .76408 1.305.76408 2.915 0 0-.45102.725-1.62368.76z"
            fill="#fff"
          />
        </svg>
      )
    case "https://stackoverflow.com/questions/tagged/typescript":
      return (
        <svg
          fill="none"
          height="16"
          viewBox="0 0 12 16"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m.375 15.1875v-6h1.09375l-.03125 4.8125h7.1875v-4.78125h1.125v5.96875zm1.75-3.1563h5.625v1.1876h-5.625zm.03125-.9374.09375-1.2188 5.65625.5312-.125 1.2188zm.28125-2.4688.34375-1.1875 5.46875 1.53125-.34375 1.18745zm1.03125-2.90625.625-1.0625 4.84375 2.9375-.65625 1.0625zm2.40625-2.9375 1-.71875 3.3125 4.625-1 .71875zm3.625-1.78125 1.1875-.1875.9375 5.59375-1.2188.1875z"
            fill="#fff"
          />
        </svg>
      )
  }
}

export const SiteFooter = (props: Props) => {
  const normalLinks = useTypeScriptLinks.filter(
    l => !l.url.includes("#show-examples")
  )
  const playgroundExamples = useTypeScriptLinks.find(l =>
    l.url.includes("#show-examples")
  )!

  const Link = createIntlLink(props.lang, props.allSitePage)

  useEffect(() => {
    // Handle escape closing dropdowns etc
    document.onkeydown = whenEscape(() => {
      document.getElementById("playground-samples-popover")!.style.visibility =
        "hidden"
    })
  }, [])

  let hasLocalStorage = false
  try {
    hasLocalStorage = typeof localStorage !== `undefined`
  } catch (error) { }

  const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const customThemeOverride = hasLocalStorage && localStorage.getItem("color-theme")
  const useDark = !customThemeOverride && systemIsDark ? true : customThemeOverride === "dark-theme"
  const [isDarkMode, setDarkMode] = useState(useDark)

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(!event.currentTarget.checked)
    if (document.location.pathname.includes("/play")) {
      document.location.reload()
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light-theme")
      document.documentElement.classList.add("dark-theme")
      hasLocalStorage && localStorage.setItem("color-theme", "dark-theme")

    } else {
      document.documentElement.classList.remove("dark-theme")
      document.documentElement.classList.add("light-theme")
      hasLocalStorage && localStorage.setItem("color-theme", "light-theme")
    }
  }, [isDarkMode])

  return (
    <footer id="site-footer" role="contentinfo">
      { props.suppressCustomization ? null :
        <section id="switcher">
          <article>
            <h3>Customize</h3>
            <label>
              <p>Site Colours:</p>
              <div className="switch-wrap">
                <input type="checkbox" checked={!isDarkMode} onChange={handleThemeChange} />
                <div className="switch"></div>
              </div>
            </label>
          </article>
        </section>
      }

      <section id="popular">
        <h3>Popular Documentation Pages</h3>
        <ul>
          {popularPages.map(page => (
            <li key={page.url}>
              <Link to={page.url}>{page.title}</Link>
              <p>{page.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="community">
        <article id="logos">
          <svg
            fill="none"
            height="26"
            viewBox="0 0 26 26"
            width="26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="m.975 0h24.05c.5385 0 .975.436522.975.975v24.05c0 .5385-.4365.975-.975.975h-24.05c-.538478 0-.975-.4365-.975-.975v-24.05c0-.538478.436522-.975.975-.975zm13.4782 13.8324v-2.1324h-9.2532v2.1324h3.30357v9.4946h2.62983v-9.4946zm1.0485 9.2439c.4241.2162.9257.3784 1.5048.4865.579.1081 1.1893.1622 1.8309.1622.6253 0 1.2193-.0595 1.782-.1784.5628-.1189 1.0562-.3149 1.4803-.5879s.7598-.6297 1.0072-1.0703.3711-.9852.3711-1.6339c0-.4703-.0707-.8824-.212-1.2365-.1414-.3541-.3453-.669-.6117-.9447s-.5859-.523-.9583-.7419c-.3725-.2189-.7925-.4257-1.2601-.6203-.3425-.1406-.6497-.2771-.9216-.4095-.2718-.1324-.5029-.2676-.6932-.4054-.1903-.1379-.3371-.2838-.4404-.4379-.1033-.154-.155-.3284-.155-.523 0-.1784.0463-.3392.1387-.4824.0924-.1433.2229-.2663.3915-.369.1685-.1027.3751-.1824.6198-.2392.2447-.0567.5165-.0851.8156-.0851.2174 0 .4472.0162.6891.0486.242.0325.4853.0825.7299.15.2447.0676.4826.1527.7137.2555.2311.1027.4445.2216.6402.3567v-2.4244c-.3969-.1514-.8305-.2636-1.3008-.3365-.4704-.073-1.01-.1095-1.6189-.1095-.6199 0-1.2071.0662-1.7617.1987-.5546.1324-1.0425.3392-1.4639.6203s-.7544.6392-.9991 1.0743c-.2447.4352-.367.9555-.367 1.5609 0 .7731.2243 1.4326.6729 1.9785.4485.546 1.1295 1.0082 2.043 1.3866.3588.146.6932.2892 1.0031.4298.3099.1405.5777.2865.8033.4378.2257.1514.4037.3162.5342.4946s.1958.3811.1958.6082c0 .1676-.0408.323-.1224.4662-.0815.1433-.2052.2676-.371.373-.1659.1054-.3725.1879-.6199.2473-.2474.0595-.5369.0892-.8686.0892-.5654 0-1.1254-.0986-1.68-.2959s-1.0684-.4933-1.5415-.8879z"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
          <svg
            className="typescript-long"
            fill="none"
            height="25"
            viewBox="0 0 105 25"
            width="105"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="m52.8777 17.6304v-1.4159c1.2926.8186 2.6019 1.228 3.9281 1.228 1.41 0 2.4802-.2903 3.2104-.8709s1.0953-1.393 1.0953-2.4372c0-.9189-.2455-1.6519-.7365-2.1991-.4735-.5276-1.4796-1.2397-3.0184-2.13631l-.1732-.10038c-1.8297-1.06092-2.988-1.94849-3.4748-2.66273-.4868-.71425-.7302-1.53916-.7302-2.47478 0-1.26976.4952-2.34737 1.4856-3.23287.9904-.88549 2.3124-1.32823 3.9659-1.32823 1.0743 0 2.1486.179602 3.223.538812v1.303168c-1.0576-.47616-2.1865-.71423-3.3867-.71423-1.2254 0-2.197.30908-2.9146.92725-.7176.61818-1.0764 1.40341-1.0764 2.35574 0 .9189.2455 1.64984.7365 2.19283.491.543 1.5506 1.28229 3.1789 2.2179 1.6871.95233 2.8097 1.79813 3.3678 2.53743.5582.7393.8373 1.5893.8373 2.55 0 1.3783-.4805 2.5019-1.4416 3.3707-.961.8687-2.3186 1.3031-4.0728 1.3031-.6211 0-1.3366-.096-2.1466-.2882-.8099-.1921-1.4289-.4135-1.857-.6641zm-44.74534-14.7957h5.16264v-2.532528h-13.295v2.532528h5.15008v15.4459h2.98228zm9.92154 17.5014 5.8166-14.89726h-2.9461l-3.223 9.35466c-.0764.2868-.1363.5202-.1798.7005l-.0468.2024h-.0629c-.0672-.2867-.1206-.5105-.1604-.6715l-.0663-.2565-3.0719-9.32956h-3.2356l5.1241 12.81566-.8687 2.1067c-.5372 1.07-1.3513 1.6051-2.4425 1.6051-.3777 0-.7973-.0753-1.259-.2258v2.4202c.4113.1087.9233.163 1.536.163 2.1823 0 3.8777-1.3292 5.0863-3.9876zm10.5978-3.9583h-.0503v7.7948h-2.918v-18.73516h2.918v2.25574h.0503c.9978-1.70435 2.4567-2.55651 4.3769-2.55651 1.635 0 2.9095.57229 3.8235 1.71687.9139 1.14459 1.3709 2.68182 1.3709 4.61176 0 2.1388-.5157 3.8515-1.547 5.1381s-2.44 1.9299-4.226 1.9299c-1.6434 0-2.9095-.7185-3.7983-2.1555zm-.0978-3.4018v-1.583c0-1.0968.3163-2.0109.9488-2.74216.6325-.73125 1.4681-1.09688 2.5069-1.09688.9802 0 1.7572.35524 2.331 1.06572.5739.71049.8608 1.69312.8608 2.94792 0 1.4957-.3078 2.6611-.9236 3.4963-.6157.8351-1.4639 1.2527-2.5446 1.2527-.9215 0-1.6818-.3241-2.2808-.9723-.599-.6481-.8985-1.4376-.8985-2.3683zm22.813-.3261h-8.703c.0332 1.1874.3969 2.103 1.091 2.7469s1.6479.9658 2.8615.9658c1.3632 0 2.6142-.4097 3.753-1.2292v2.3455c-1.1637.7359-2.7015 1.1038-4.6133 1.1038-1.8786 0-3.352-.5832-4.4201-1.7497s-1.6022-2.8075-1.6022-4.9231c0-1.99856.5881-3.62703 1.7643-4.88552 1.1762-1.25848 2.6371-1.88771 4.3827-1.88771s3.0963.56443 4.0522 1.6933 1.4339 2.69672 1.4339 4.70363zm-3.4528-4.52311c.4806.58334.7251 1.39958.7334 2.44871h-5.8921c.1326-.99038.4869-1.79193 1.0628-2.40464.576-.61272 1.2783-.91907 2.107-.91907.8453 0 1.5082.29166 1.9889.875zm21.8704 10.45591c1.3315 0 2.4776-.2921 3.4383-.8764v-1.2018c-.9607.6844-2.0899 1.0266-3.3878 1.0266-1.4157 0-2.5555-.505-3.4193-1.5149s-1.2957-2.3453-1.2957-4.0063c0-1.7193.4719-3.11943 1.4158-4.2003.9438-1.08086 2.1742-1.62128 3.6911-1.62128 1.104 0 2.1195.28377 3.0465.85133v-1.30204c-.927-.40063-1.8835-.60094-2.8695-.60094-1.9046 0-3.4636.64893-4.6771 1.9468-1.2136 1.29787-1.8203 2.96503-1.8203 5.00153 0 1.9364.5393 3.5034 1.618 4.7012 1.0787 1.1977 2.4987 1.7965 4.26 1.7965zm11.0428-11.9856c-.3837-.27698-.8341-.41547-1.3512-.41547-1.0093 0-1.8559.52458-2.5399 1.57375-.684 1.04916-1.026 2.53892-1.026 4.46942v6.0558h-1.126v-12.89213h1.126v2.85791h.0501c.2919-.98202.7548-1.7458 1.3888-2.29136.6339-.54557 1.3679-.81835 2.202-.81835.4755 0 .9009.07554 1.2762.22662zm1.8042-4.61517c.1955.18952.4208.28427.6759.28427.2721 0 .5059-.09906.7014-.29719.1956-.19812.2934-.43501.2934-.71067 0-.292879-.0999-.525459-.2997-.697743s-.4315-.258425-.6951-.258425c-.2466 0-.4698.088294-.6696.264885-.1998.176592-.2997.407018-.2997.691283 0 .29289.0978.53408.2934.72359zm.0088 16.29867v-12.84176h1.2086v12.84176zm5.0798-2.2859h.0501c.9181 1.7283 2.337 2.5924 4.2566 2.5924 1.7194 0 3.1028-.6617 4.1502-1.985 1.0475-1.3234 1.5712-3.0579 1.5712-5.2036 0-1.92865-.4569-3.45443-1.3709-4.5774-.9139-1.12296-2.1846-1.68443-3.8121-1.68443-1.0266 0-1.9677.25673-2.8232.77021-.8555.51347-1.5127 1.24192-1.9718 2.18538h-.0501v-2.6425h-1.1517v18.72284h1.1517zm.0569-4.7728v1.6133c0 1.284.4088 2.3867 1.2264 3.308s1.8923 1.382 3.2241 1.382c1.3233 0 2.398-.5607 3.2241-1.6822.826-1.1214 1.239-2.5951 1.239-4.421 0-1.60088-.3793-2.87236-1.1379-3.81453-.7586-.94216-1.7701-1.41324-3.0344-1.41324-1.5088 0-2.6762.50026-3.5023 1.50079-.826 1.00053-1.239 2.17613-1.239 3.52688zm15.542 7.3608c.523 0 1.083-.1417 1.681-.4252v-1.0754c-.548.3084-1.058.4627-1.532.4627-.664 0-1.135-.198-1.413-.594s-.417-1.0359-.417-1.9196v-8.45368h3.362v-1.05046h-3.362v-3.71411c-.183.06669-.373.12922-.573.18758-.199.06669-.39.13339-.572.20009v3.32644h-2.2916v1.05046h2.2916v8.60378c0 2.2676.942 3.4014 2.826 3.4014z"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
          <p>Made with &#9829; in Redmond, Boston, SF &amp; NYC</p>

          <a href="">
            <img
              id="microsoft-logo"
              width={92}
              height={19}
              src={require("../../assets/microsoft-logo.png")}
              alt="Microsoft Logo"
            />
          </a>
          <p>
            © 2012-{new Date().getFullYear()} Microsoft
            <br />
            <a
              href="https://go.microsoft.com/fwlink/?LinkId=521839"
              title="Microsoft Privacy Policy"
            >
              Privacy
            </a>
          </p>
        </article>

        <article id="using-typescript">
          <h3>Using TypeScript</h3>
          <ul>
            {normalLinks.map(page => (
              <li key={page.url}>
                <Link to={page.url}>{page.title}</Link>
              </li>
            ))}
            <li key="last" id="popover-trigger" className="popover-container">
              <a
                href={playgroundExamples.url}
                aria-haspopup="true"
                id="popover-trigger-anchor"
              >
                <span
                  style={{ display: "none" }}
                  className="link-prefix footer-icon"
                ></span>
                {playgroundExamples.title}
              </a>
              <PlaygroundSamples lang="en" />
            </li>
          </ul>
        </article>

        <article id="community-links">
          <h3>Community</h3>
          <ul>
            {communityLinks.map(page => {
              const favicon = faviconForURL(page.url)
              const favSpan = favicon ? (<span className="link-prefix">{favicon}</span>) : null
              return (
                <li key={page.url}>
                  <a style={{ position: "relative" }} href={page.url}>
                    {favSpan}
                    {page.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </article>
      </section>

    </footer>
  )
}
