import React, { useState } from "react";

import { indexCopy } from "../../copy/en/index";
import { createInternational } from "../../lib/createInternational";
import { useIntl } from "react-intl";
import { ShowErrorsExample } from "./twoslash/generated/showErrors";
import { ReactExample } from "./twoslash/generated/react";
import { TypeDefinitionsExample } from "./twoslash/generated/typeDefinitions";
import { InterfaceExample } from "./twoslash/generated/interface";

export const EditorExamples = () => {
  const i = createInternational<typeof indexCopy>(useIntl());

  // Controls which story we should show
  const [index, setIndex] = useState(0);

  const explanations = [
    "TypeScript validates your JavaScript ahead of time",
    "Provides auto-complete for untyped libraries",
    "Describe the shape of objects and functions",
    "Supports rich type-checking in JSX environments like React",
  ];

  const loadIndex = (index: number) => setIndex(index);

  const next = (e) => {
    if (index + 1 === explanations.length) loadIndex(0);
    else loadIndex(index + 1);

    e.preventDefault();
    return false;
  };

  return (
    <div className="headline-diagram">
      <div className="slides">
        {{
          0: (
            <Editor inline={() => <ShowErrorsExample />} />
          ),
          1: (
            <Editor inline={() => <TypeDefinitionsExample />} />
          ),
          2: (
            <Editor inline={() => <InterfaceExample />} />
          ),
          3: (
            <Editor inline={() => <ReactExample />} />
          ),
        }[index]}
      </div>

      <div className="button-container">
        <a
          className="next-headline-button"
          href="#"
          onClick={next}
          role="presentation"
        >
          <div className="message">{explanations[index]}</div>
          <div className="next">
            <p>Next</p>
            <p style={{ margin: 0 }}>
              <svg
                width="11"
                height="15"
                viewBox="0 0 11 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 14.5V0.5L10.5 7L0 14.5Z" fill="white" />
              </svg>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};


type EditorProps = {
  inline?: () => JSX.Element;
};

const Editor = (props: EditorProps) => {
  const classes = ["editor", "ts", "front"];
  return (
    <div className={classes.join(" ")}>
        <div className="content">
          <div className="text">
            {props.inline && props.inline() || null}
          </div>
        </div>
    </div>
  );
};
