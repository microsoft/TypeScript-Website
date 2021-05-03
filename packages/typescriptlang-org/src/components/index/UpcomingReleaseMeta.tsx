import * as React from "react"
import { withPrefix } from "gatsby"

// Automatic metadata from npm and VS Marketplace
import releaseInfo from "../../lib/release-info.json"
// Manual input of dates
import releasePlan from "../../lib/release-plan.json"

import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"
import { indexCopy } from "../../copy/en/index.js"

/**
 * Shows the current versions, and upcoming releases
 */
export const UpcomingReleaseMeta = () => {
  const intl = useIntl()

  const i = createInternational<typeof indexCopy>(intl)

  const startDate = new Date(releasePlan.last_release_date)
  const betaDate = new Date(releasePlan.upcoming_beta_date)
  const rcDate = new Date(releasePlan.upcoming_rc_date)
  const endDate = new Date(releasePlan.upcoming_release_date)

  // const today = new Date("04/30/2020")
  const today = new Date()

  validateDates(startDate, betaDate, rcDate, endDate)

  // it's an approximation, but we don't need fidelity on a 300px wide bar
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTotalDays = Math.round(Math.abs(((+startDate) - (+endDate)) / oneDay));
  const diffToBetaDays = Math.round(Math.abs(((+startDate) - (+betaDate)) / oneDay));
  const diffToRCDays = Math.round(Math.abs(((+startDate) - (+rcDate)) / oneDay));
  const diffToToday = Math.round(Math.abs(((+startDate) - (+today)) / oneDay));

  let needlePerc = -1
  // is after release || somehow ended up negative
  if (diffToToday > diffTotalDays || diffToToday < 0) {
    // uh oh, we need to update the release-plan.json
    // so NOOP to leave at -1
  } else if (diffToToday < diffToBetaDays) {
    // It's in the first bit, so x% of 0 - 55%
    const onePerc = 55 / 100;
    needlePerc = ((diffToToday / diffToBetaDays) * onePerc) * 100
  } else if (diffToToday < diffToRCDays) {
    // It's in the second bit, so x% of 55 - 83%
    const onePerc = (83 - 55) / 100;
    needlePerc = ((onePerc * (diffToToday / diffToRCDays)) * 100) + 55
  } else {
    // must be in the final section
    const onePerc = 17 / 100;
    needlePerc = ((onePerc * (diffToToday / diffTotalDays)) * 100) + 83
  }

  const releaseParts = intl.formatDateToParts(startDate, { month: "short", day: "numeric" })
  const betaParts = intl.formatDateToParts(betaDate, { month: "short", day: "numeric" })
  const rcParts = intl.formatDateToParts(rcDate, { month: "short", day: "numeric" })
  const shipParts = intl.formatDateToParts(endDate, { month: "short", day: "numeric" })

  const shipMsg = <a href={releasePlan.iteration_plan_url}>{releasePlan.upcoming_version}</a>
  const releaseMsg = <a href={withPrefix(releaseInfo.releaseNotesURL)}>{i("index_releases_released")}</a>
  const betaMsg = !releaseInfo.isBeta ? <span>{i("index_releases_beta")}</span> : <a href={releaseInfo.betaPostURL}>{i("index_releases_beta")}</a>
  const rcMsg = !releaseInfo.isRC ? <span>{i("index_releases_rc")}</span> : <a href={releaseInfo.rcPostURL}>{i("index_releases_rc")}</a>

  return (
    <div className="grey-box last">
      <p>{i("index_releases_pt1")} {shipMsg}{i("index_releases_pt2")} {shipParts.map(p => p.value).join('')}</p>
      <div className="release-info">
        <div className="needle" style={{ left: needlePerc + "%", display: needlePerc === -1 ? "none" : "block" }} />
        <div className="needle-head" style={{ left: needlePerc + "%", display: needlePerc === -1 ? "none" : "block" }} />
        <div className="release">
          <div>
            <div className="separator" />
            <div className="bar" />
          </div>
          <p>{releaseInfo.tags.stableMajMin} {releaseMsg}<br />{releaseParts.map(p => p.value).join('')}</p>
        </div>
        <div className="beta">
          <div>
            <div className="separator" />
            <div className="bar" />
          </div>
          <p>{releasePlan.upcoming_version} {betaMsg}<br />{betaParts.map(p => p.value).join('')}</p>
        </div>
        <div className="rc">
          <div>
            <div className="separator" />
            <div className="bar" />
          </div>
          <p>{releasePlan.upcoming_version} {rcMsg}<br />{rcParts.map(p => p.value).join('')}</p>
        </div>
      </div>
    </div>)
}


function validateDates(startDate: Date, betaDate: Date, rcDate: Date, endDate: Date) {
  if (!startDate || !betaDate || !rcDate || !endDate) {
    const dates = [
      { "name": "startDate", date: startDate },
      { "name": "betaDate", date: betaDate },
      { "name": "rcDate", date: rcDate },
      { "name": "releaseDate", date: releasePlan }
    ]
    const failed = dates.filter(d => d instanceof Date)
    throw new Error(`Dates in release-plan.json can't be converted into JS dates: ${failed.join(" - ")}`)
  }
}

