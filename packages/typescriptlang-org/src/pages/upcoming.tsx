import * as React from "react"
import { Layout } from "../components/layout"

import { Intl } from "../components/Intl"
import { UpcomingReleaseMeta } from "../components/index/UpcomingReleaseMeta"
import { useIntl } from "react-intl"

import "../templates/pages/css/index.scss"

import releasePlan from "../lib/release-plan.json"

const Index: React.FC<{}> = (props) => {
  const intl = useIntl()
  const today = new Date()

  const startDate = new Date(releasePlan.last_release_date)
  const betaDate = new Date(releasePlan.upcoming_beta_date)
  const rcDate = new Date(releasePlan.upcoming_rc_date)
  const endDate = new Date(releasePlan.upcoming_release_date)

  // it's an approximation, but we don't need fidelity on a 300px wide bar
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTotalDays = Math.round(Math.abs(((+startDate) - (+endDate)) / oneDay));
  const diffToBetaDays = Math.round(Math.abs(((+startDate) - (+betaDate)) / oneDay));
  const diffToRCDays = Math.round(Math.abs(((+startDate) - (+rcDate)) / oneDay));
  const diffToToday = Math.round(Math.abs(((+startDate) - (+today)) / oneDay));

  const betaDateString = intl.formatDateToParts(betaDate, { month: "short", day: "numeric" }).map(p => p.value).join('')
  const rcDateString = intl.formatDateToParts(rcDate, { month: "short", day: "numeric" }).map(p => p.value).join('')
  const shipDateString = intl.formatDateToParts(endDate, { month: "short", day: "numeric" }).map(p => p.value).join('')

  // Update the meta description (so you don't need to click through) on a new build
  let metaUpcoming = ""
  if (diffToToday > diffTotalDays || diffToToday < 0) {
    metaUpcoming = "Preparing details for the next release"
  } else if (diffToToday < diffToBetaDays) {
    metaUpcoming = `${releasePlan.upcoming_version} Beta on ${betaDateString}`
  } else if (diffToToday < diffToRCDays) {
    metaUpcoming = `${releasePlan.upcoming_version} RC on ${rcDateString}`
  } else {
    metaUpcoming = `${releasePlan.upcoming_version} Final release on ${shipDateString}`
  }

  const metaDescription = `Up next: ${metaUpcoming}`

  return (
    <>
      <Layout title="Release Cycle" description={metaDescription} lang="en">
        <div id="upcoming">
          <div className="raised content main-content-block">
            <div className="split-fivehundred">
              <h1 style={{ marginTop: "20px" }}>Release Cycle</h1>
              <div id='index'>
                <UpcomingReleaseMeta />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}


export default (props: {}) => <Intl locale="en"><Index {...props} /></Intl>

