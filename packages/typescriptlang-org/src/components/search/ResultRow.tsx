import React, { useState } from "react"
import { FormattedRelativeTime } from "react-intl"

import { cx } from "../../lib/cx"
import { ISearch, SearchHit } from "./types"

import "./ResultRow.scss"

export type ResultRowprops = {
  exactMatch?: boolean
  installer: [string, string]
  hit: SearchHit
  i: ISearch
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
  i
}) => {
  const npmUrl = `https://www.npmjs.com/package/${name}`
  const dtID = !name.includes("@") ? name : name.toString().replace("@", "").replace("/", "__")
  const [icon, label, viaUrl] =
    types.ts === "included"
      ? ["in", "included", repository?.url || npmUrl]
      : [
        "dt",
        "from Definitely Typed",
        `https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/${dtID}`,
      ]

  const initialCopyStatus = [i("dt_s_copy"), `Copy ${name} installation script`]
  const [copyStatus, setCopyStatus] = useState(initialCopyStatus)

  const installCommands = [`${installer[0]} ${name}`]
  if (types.ts === "definitely-typed") {
    installCommands.push(
      `${installer[0]} ${types.definitelyTyped} ${installer[1]}`
    )
  }
  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCommands.join("\n"))
      setCopyStatus([i("dt_s_copied"), `Copied ${name} installation script`])
    } catch {
      setCopyStatus([":(", `Failed to copy ${name} installation script`])
    }
  }

  const resetCopyInstall = () => {
    setCopyStatus(initialCopyStatus)
  }

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
            {installCommands.map(command => (
              <span className="code-line" key={command}>
                {command}
              </span>
            ))}
          </code>
        </pre>
        <button
          aria-label={copyStatus[1]}
          aria-live="polite"
          className="copyInstall"
          onBlur={resetCopyInstall}
          onClick={copyInstall}
          role="button"
        >
          {copyStatus[0]}
        </button>
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

  // @ts-expect-error - this isn't in the JSTS dom APIs
  if (Intl.RelativeTimeFormat) {
    return (
      <FormattedRelativeTime
        numeric="auto"
        style="long"
        value={Math.ceil(-ago / ms)}
        unit={unit}
      />
    )
  } else {
    const value = -1 * Math.ceil(-ago / ms)
    const suffix = value === 1 ? "" : "s"
    return <>{value} {unit}{suffix}</>
  }
}
