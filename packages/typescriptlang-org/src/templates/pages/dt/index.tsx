import React from "react"
import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

import { indexCopy } from "../../../copy/en/index2"
import { createIntlLink } from "../../../components/IntlLink"
import { createInternational } from "../../../lib/createInternational"
import { useIntl } from "react-intl"

import "../../pages/css/documentation.scss"
import "./index.scss"

const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + (props.className ?? "")}><div className="container">{props.children}</div></div>

type Props = {
  pageContext: any
}

const DTIndex: React.FC<Props> = (props) => {
  const i = createInternational<typeof indexCopy>(useIntl())
  const Link = createIntlLink(props.pageContext.lang)

  return (
    <Layout title="What is Definitely Typed?" description="Definitely Type provides type information for thousands of JavaScript Libraries." lang={props.pageContext.lang} suppressCustomization>
      <div id="dt">
        <Section color="darkblue">
          <div className="dt-background" aria-hidden="true">node, yargs, events, minimatch, glob, q, istanbul-lib-coverage, istanbul-lib-report, @babel/generator, @babel/traverse, react, stack-utils, @babel/core, istanbul-reports, yargs-parser, @babel/template, prop-types, lodash, jest, color-name, json-schema, express, express-serve-static-core, connect, body-parser, serve-static, mime, parse-json, eslint-visitor-keys, range-parser, react-dom, normalize-package-data, history, long, webpack-sources, tough-cookie, request, unist, source-list-map, caseless, tapable, webpack, estree, jasmine, webpack-env, react-transition-group, selenium-webdriver, uglify-js, uuid, sizzle, react-router, @reach/router, hoist-non-react-statics, fs-extra, zen-observable, chai, anymatch, jquery, semver, debug, ws, react-syntax-highlighter, mocha, bluebird, react-redux, react-router-dom, @testing-library/dom, json5, node-fetch, jasminewd2, cheerio, is-function, react-textarea-autosize, cors, duplexify, @testing-library/react, mkdirp, babel-types, babylon, enzyme, react-native, async, keygrip, koa, accepts, sinon, jsonwebtoken, react-test-renderer, cookies, koa-compose, http-assert, classnames, superagent, resolve, geojson, invariant, cookiejar, react-color, qs, bytebuffer, graphql-upload, eslint, js-yaml, fs-capacitor, retry, styled-components, moment-timezone, bunyan, tmp, validator, minimist, mongodb, cookie, supertest, enzyme-adapter-react-16, aws-lambda, prettier, rimraf, is-glob, bson, faker, puppeteer, yup, through, redis, http-proxy, react-select, xml2js, object-assign, d3-shape, configstore, valid-url, d3-path, underscore, react-slick, ramda, react-helmet, chart.js, object-hash, npmlog, mongoose, googlemaps, pg, mime-types, d3, express-jwt, js-cookie, debounce, compression, core-js, d3-array, express-unless, d3-scale, d3-time, styled-jsx, pg-types, @testing-library/react-hooks, micromatch, agent-base, @ember/object, restify, angular, concat-stream, bn.js, inquirer, d3-selection, ioredis, file-saver, continuation-local-storage, webpack-dev-server, mysql, html-webpack-plugin, d3-transition, marked, clean-css, elliptic, source-map-support, d3-color, d3-format, domhandler, acorn, sax, tunnel, d3-time-format, d3-ease, d3-interpolate, @hapi/joi, d3-axis, relateurl, chai-as-promised, d3-hierarchy, request-promise-native, html-minifier, cookie-parser, lru-cache, color, d3-geo, redux-mock-store, d3-dsv, morgan, d3-collection, d3-timer, d3-zoom, d3-voronoi, d3-drag, d3-force, http-errors, d3-dispatch, d3-brush, d3-random, d3-quadtree, d3-chord, d3-polygon, http-proxy-middleware, request-promise, helmet, shelljs, react-modal, node-forge, passport, asap, assert, bootstrap, color-convert, jwt-decode, isomorphic-fetch, argparse, got, joi, hammerjs, shallowequal, recompose, jsdom, atob, sinon-chai, @testing-library/jest-dom, ua-parser-js, react-virtualized, redux-logger, multer, karma, balanced-match, nodemailer, react-table, d3-scale-chromatic, vinyl, sprintf, node-int64, jest-specific-snapshot, humps, tryer, istanbul-lib-source-maps, bonjour, webpack-node-externals, imagemin-optipng, filewriter, write, parallel-transform, js-levenshtein, array-find-index, graphql-type-json, victory, imagemin-svgo, filesystem, json2csv, osenv, postcss-modules-extract-imports, is-finite, console-log-level, imagemin-gifsicle, eslint-plugin-prettier, google-libphonenumber, postcss-modules-local-by-default, postcss-modules-scope, interpret, raf, react-responsive, bser, material-ui, css, koa-send, watchpack, update-notifier, react-measure, webpack-manifest-plugin, app-root-path, uniq, newrelic</div>
          <h1>Definitely Typed</h1>
          <h2>Provides type information for thousands of JavaScript libraries.</h2>
        </Section>
        <Section color="white">
          <a className="dt-info-button" href="#" style={{ opacity: "0.2", pointerEvents: "none" }} aria-hidden="true" tabIndex={-1}>
            <div aria-hidden="true" className="above"><p tabIndex={-1} aria-hidden="true">Learn</p></div>
            <div aria-hidden="true" className="below"><p tabIndex={-1} aria-hidden="true">What is<br />Definitely Typed?</p></div>
          </a>

          <a className="dt-info-button" href="/dt/search">
            <div className="above"><p>Type Search</p></div>
            <div className="below"><p>Find libraries<br />with types</p></div>
          </a>

          <a className="dt-info-button" href="https://github.com/definitelytyped/definitelytyped/#definitely-typed">
            <div className="above"><p>Contribute</p></div>
            <div className="below"><p>Help improve<br />Definitely Typed?</p></div>
          </a>
        </Section>
      </div>
    </Layout >
  )
}


export default (props: Props) => <Intl locale={props.pageContext.lang}><DTIndex {...props} /></Intl>
