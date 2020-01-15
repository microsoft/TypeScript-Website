import { IntlShape } from "react-intl"

/**
 * This will let you define an area for your localization and have typescript
 * keep the keys in check
 *
 * @param intlUseEffect the result of `useIntl()`
 */
export function createInternational<NavSection>(
  intlUseEffect: IntlShape
): (intlKey: keyof NavSection, obj?: any) => string {
  return (k, obj) => intlUseEffect.formatMessage({ id: k as string }, obj)
}
