import React from "react"
import { withPrefix } from "gatsby"

// Automatic metadata from NPM and VS Marketplace
import releaseInfo from "../lib/release-info.json"
// Manual input of dates
import releasePlan from "../lib/release-plan.json"

import { navCopy } from "../copy/en/nav"
import { createInternational } from "../lib/createInternational"
import { useIntl } from "react-intl"

/**
 * Shows the current versions, and upcoming releases
 */
export const UpcomingReleaseMeta = () => {
  const i = createInternational<typeof navCopy>(useIntl())
  i

  return (
    <div className="grey-box release-info last">
      <div className="release">
        <div>
          <div className="separator" />
          <div className="bar" />
        </div>
        <p>3.5 release<br />May 29th</p>
      </div>
      <div className="beta">
        <div>
          <div className="separator" />
          <div className="bar" />
        </div>
        <p>3.6 beta<br />Jul 12th</p>
      </div>
      <div className="rc">
        <div>
          <div className="separator" />
          <div className="bar" />
        </div>
        <p>3.6 RC<br />Aug 13th</p>
      </div>
    </div>)
}
