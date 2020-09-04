import * as React from "react"

import { cx } from "../../lib/cx"
import { SearchHit } from "./types"

import "./ResultRow.scss"

export type ResultRowprops = {
  installer: [string, string]
  hit: SearchHit
  raised?: boolean
}

export const ResultRow: React.FC<ResultRowprops> = ({
  installer,
  hit: {
    description,
    downloadsLast30Days,
    humanDownloadsLast30Days,
    modified,
    name,
    types,
  },
  raised,
}) => {
  return (
    <tr className={cx("resultRow", raised && "resultRowRaised")}>
      <td
        className={cx(
          "downloads",
          downloadsLast30Days > 1_000_000
            ? "downloadsMillion"
            : downloadsLast30Days > 100_000
            ? "downloadsHundredThousand"
            : "downloadsMeh"
        )}
      >
        {humanDownloadsLast30Days}
      </td>
      <td className="via">{types.ts === "included" ? "IN" : "DT"}</td>
      <td className="name">
        <strong>{name}</strong>
        {description}
      </td>
      <td className="updated">{modified}</td>
      <td className="install">
        <pre className="pre">
          <code>
            &gt; {installer[0]} {name}
            {types.ts === "definitely-typed" && (
              <>
                {"\n"}
                &gt; {installer[0]} ${types.definitelytyped} {installer[1]}
              </>
            )}
          </code>
        </pre>
      </td>
    </tr>
  )
}
