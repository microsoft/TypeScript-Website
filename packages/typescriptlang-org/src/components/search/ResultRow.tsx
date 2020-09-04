import * as React from "react"
import { useIntl, FormattedRelativeTime } from "react-intl"

import { cx } from "../../lib/cx"
import { SearchHit } from "./types"

import "./ResultRow.scss"

export type ResultRowprops = {
  exactMatch?: boolean
  installer: [string, string]
  hit: SearchHit
}

export const ResultRow: React.FC<ResultRowprops> = ({
  exactMatch,
  installer,
  hit: {
    description,
    downloadsLast30Days,
    humanDownloadsLast30Days,
    modified,
    name,
    types,
  },
}) => {
  const [icon, label] =
    types.ts === "included"
      ? ["in", "included"]
      : ["dt", "from DefinitelyTyped"]

  return (
    <tr className={cx("resultRow", exactMatch && "resultRowExactMatch")}>
      <td
        className={cx(
          "downloads",
          downloadsLast30Days > 1_000_000
            ? "downloadsMillion"
            : downloadsLast30Days > 100_000 && "downloadsHundredThousand"
        )}
      >
        {humanDownloadsLast30Days}
      </td>
      <td className="via">
        <div
          aria-label={`Types ${label}`}
          className={cx("typeImage", icon)}
          role="img"
        />
      </td>
      <td className="name">
        <strong>{name}</strong>
        {description
          .replace(/\!?\[.*\]\[(.*)\]/g, "$1")
          .replace(/\!?\[(.*)\]\(.*\)/g, "$1")}
      </td>
      <td className="updated">
        <TimeAgo ago={Date.now() - modified} />
      </td>
      <td className="install">
        {!exactMatch && (
          <pre className="pre">
            <code>
              &gt; {installer[0]} {name}
              {types.ts === "definitely-typed" && (
                <>
                  {"\n"}
                  &gt; {installer[0]} {types.definitelyTyped} {installer[1]}
                </>
              )}
            </code>
          </pre>
        )}
      </td>
    </tr>
  )
}

const msHour = 60 * 1000 * 60
const msDay = msHour * 24
const msWeek = msDay * 7
const msMonth = msDay * 30
const msYear = msDay * 365

const timeMeasures = [
  [msYear, "year"],
  [msMonth, "month"],
  [msWeek, "week"],
  [msDay, "day"],
] as const

type TimeAgoProps = {
  ago: number
}

const TimeAgo: React.FC<TimeAgoProps> = ({ ago }) => {
  const measureIndex = timeMeasures.findIndex(([ms]) => ago > ms)
  if (measureIndex === -1) {
    return <>just now</>
  }

  const [ms, unit] = timeMeasures[measureIndex]

  return (
    <FormattedRelativeTime
      numeric="auto"
      style="long"
      value={Math.ceil(-ago / ms)}
      unit={unit}
    />
  )
}
