import * as React from "react"
import { withPrefix } from "gatsby"
import releaseInfo from "../lib/release-info.json"

import { navCopy } from "../copy/en/nav"
import { createInternational } from "../lib/createInternational"
import { useIntl } from "react-intl"

/**
 * Shows the current versions, and upcoming releases
 */
export const VersionBar = () => {
  const i = createInternational<typeof navCopy>(useIntl())
  const beta = <span>{i("nav_version_between")}<a href={releaseInfo.betaPostURL}>{releaseInfo.tags.betaMajMin}</a> {i("nav_version_beta_prefix")}</span>
  const rc = <span>{i("nav_version_between")}<a href={releaseInfo.betaPostURL}>{releaseInfo.tags.rcMajMin}</a> {i("nav_version_rc_prefix")}</span>
  const prefix = releaseInfo.isRC ? rc : releaseInfo.isBeta ? beta : null

  return (
    <div className="version-bar">
      <p><a href={withPrefix(releaseInfo.releaseNotesURL)}>TypeScript {releaseInfo.tags.stableMajMin}</a> {i("nav_version_stable_prefix")}{prefix}</p>
    </div>)
}
