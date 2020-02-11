// This file exists to ensure that global.DOMParser
// is set up, to let react-intl do it's work with RichText in
// a message: https://github.com/formatjs/react-intl/issues/1438#issuecomment-523153456

global.DOMParser = new (require("jsdom").JSDOM)().window.DOMParser

const React = require("react")
exports.wrapRootElement = ({ element }) => {
  return <>{element}</>
}
