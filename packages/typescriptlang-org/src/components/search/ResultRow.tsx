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
    repository,
    types,
  },
}) => {
  const [icon, label, viaUrl] =
    types.ts === "included"
      ? ["in", "included", repository.url]
      : [
          "dt",
          "from Definitely Typed",
          `https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/${name}`,
        ]
  const npmUrl = `https://www.npmjs.com/package/${name}`

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
        <a className="resultLink" href={npmUrl}>
          {humanDownloadsLast30Days}
        </a>
      </td>
      <td className="via">
        <a
          aria-label={`Types ${label}`}
          className={cx("resultLink typeImage", icon)}
          href={viaUrl}
          role="img"
        />
      </td>
      <td className="name">
        <a className="resultLink resultName" href={npmUrl}>
          {name}
        </a>
        {description
          ?.replace(/\!?\[.*\]\[(.*)\]/g, "$1")
          .replace(/\!?\[(.*)\]\(.*\)/g, "$1")
          .replace(/\&amp;/g, "&")}
      </td>
      <td className="updated">
        <TimeAgo ago={Date.now() - modified} />
      </td>
      <td className="install">
        <pre className="pre">
          <code>
            <span className="no-select">&gt; </span>
            {installer[0]} {name}
            {types.ts === "definitely-typed" && (
              <>
                {"\n"}
                <span className="no-select">&gt; </span>
                {installer[0]} {types.definitelyTyped} {installer[1]}
              </>
            )}
          </code>
        </pre>
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
