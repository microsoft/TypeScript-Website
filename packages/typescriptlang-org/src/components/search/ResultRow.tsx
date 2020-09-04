import * as React from "react"

import { cx } from "../../lib/cx"
import { JoinedPackage } from "./types"

export type ResultRowprops = {
  installer: [string, string]
  joinedPackage: JoinedPackage
}

export const ResultRow: React.FC<ResultRowprops> = ({
  installer,
  joinedPackage: {
    description,
    downloadsLast30Days,
    externalTypes,
    modified,
    name,
  },
}) => {
  return (
    <tr className="resultRow">
      <td
        className={cx(
          "hitDownloads",
          downloadsLast30Days > 1_000_000
            ? "hitDownloadsMillion"
            : downloadsLast30Days > 100_000
            ? "hitDownloadsHundredThousand"
            : "hitDownloadsMeh"
        )}
      >
        {humanize(downloadsLast30Days)}
      </td>
      <td>{externalTypes ? "DT" : "IN"}</td>
      <td>
        <strong>{name}</strong> <br /> {description}
      </td>
      <td>{modified}</td>
      <td>
        <pre>
          <code>
            &gt; {installer[0]} {name}
            {externalTypes && (
              <>
                {"\n"}
                &gt; {installer[0]} @types/${name} {installer[1]}
              </>
            )}
          </code>
        </pre>
      </td>
    </tr>
  )
}

const humanize = (count: number) => `${count}...!`
