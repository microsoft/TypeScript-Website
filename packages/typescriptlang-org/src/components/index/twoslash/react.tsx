// twoslash: { themes: ["min-dark", "../../../packages/typescriptlang-org/lib/themes/typescript-beta-dark"], disableImplicitReactImport: true  }
import * as React from "react";

interface UserThumbnailProps {
  img: string;
  alt: string;
  url: string;
}

export const UserThumbnail = (props: UserThumbnailProps) =>
  <a href={props.url}>
    <img src={props.img} alt={props.alt} />
  </a>
