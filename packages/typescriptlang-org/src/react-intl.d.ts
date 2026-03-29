// Override react-intl's defineMessages to accept plain string values.
// The localization files from TypeScript-Website-Localizations use
// defineMessages({key: "string", ...}) which react-intl v7 types reject
// (v7 expects MessageDescriptor values). At runtime defineMessages is an
// identity function so plain strings work fine.
import "react-intl"

declare module "react-intl" {
  export function defineMessages<U extends Record<string, string>>(msgs: U): U
}
