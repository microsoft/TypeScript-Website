// This hooks ups client-side app analytics
// it's based on how the google analytics plugin works for gatsby
// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-google-analytics/src/gatsby-browser.js

exports.onRouteUpdate = ({ location, prevLocation }) => {
  // Run both clear and app insights for a bit, then drop app insights

  // prettier-ignore
  // ;(function(c,l,a,r,i,t,y){
  //       c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  //       t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  //       y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  //   })(window, document, "clarity", "script", "3w5kyel345");

  var sdkInstance = "appInsightsSDK"
  window[sdkInstance] = "appInsights"
  const config = {
    instrumentationKey: "78a8fb52-a225-4c66-ac08-92fad1c1ade1",
    // loggingLevelConsole: 1
  }

  let hasLocalStorage = false
  try {
    hasLocalStorage = typeof localStorage !== `undefined`
  } catch (error) {}

  try {
    // prettier-ignore
    // @ts-ignore
    var aiName = window[sdkInstance], aisdk = window[aiName] || function (e) { function n(e) { t[e] = function () { var n = arguments; t.queue.push(function () { t[e].apply(t, n) }) } } var t = { config: e }; t.initialize = !0; var i = document, a = window; setTimeout(function () { var n = i.createElement("script"); n.async = true; n.src = e.url || "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", i.getElementsByTagName("script")[0].parentNode.appendChild(n) }); try { t.cookie = i.cookie } catch (e) { } t.queue = [], t.version = 2; for (var r = ["Event", "PageView", "Exception", "Trace", "DependencyData", "Metric", "PageViewPerformance"]; r.length;)n("track" + r.pop()); n("startTrackPage"), n("stopTrackPage"); var s = "Track" + r[0]; if (n("start" + s), n("stop" + s), n("setAuthenticatedUserContext"), n("clearAuthenticatedUserContext"), n("flush"), !(!0 === e.disableExceptionTracking || e.extensionConfig && e.extensionConfig.ApplicationInsightsAnalytics && !0 === e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)) { n("_" + (r = "onerror")); var o = a[r]; a[r] = function (e, n, i, a, s) { var c = o && o(e, n, i, a, s); return !0 !== c && t["_" + r]({ message: e, url: n, lineNumber: i, columnNumber: a, error: s }), c }, e.autoExceptionInstrumented = !0 } return t }(config);
    window[aiName] = aisdk

    const locationWithoutPlaygroundCode = location.pathname
      .split("#code")[0]
      .split("#src")[0]

    const prevHref = (prevLocation && prevLocation.pathname) || ""
    const previousLocationWithoutPlaygroundCode = prevHref
      .split("#code")[0]
      .split("#src")[0]

    const referrerWithoutPlaygroundCode =
      document.referrer && document.referrer.split("#code")[0].split("#src")[0]

    // @ts-ignore
    aisdk.trackPageView({
      uri: locationWithoutPlaygroundCode,
      refUri: referrerWithoutPlaygroundCode,
      properties: {
        uri: locationWithoutPlaygroundCode,
        prev: previousLocationWithoutPlaygroundCode,
        lang: document.documentElement.lang,
        visitedPlayground:
          hasLocalStorage && localStorage.getItem("sandbox-history") !== null,
      },
    })
  } catch (error) {
    console.error("Error with Application Insights")
    console.error(error)
  }
}
