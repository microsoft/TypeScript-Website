import * as React from "react"

import { cx } from "../../lib/cx"
import { SearchHit } from "./types"

export type ResultRowprops = {
  installer: [string, string]
  hit: SearchHit
}

export const ResultRow: React.FC<ResultRowprops> = ({
  installer,
  hit: { description, downloadsLast30Days, modified, name, types },
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
      <td>{types.ts === "included" ? "IN" : "DT"}</td>
      <td>
        <strong>{name}</strong> <br /> {description}
      </td>
      <td>{modified}</td>
      <td>
        <pre>
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

const humanize = (count: number) => `${count}...!`
