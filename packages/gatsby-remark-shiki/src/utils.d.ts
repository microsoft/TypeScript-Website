type Range = { begin: number; end: number; text?: string; count?: number; tooltip?: string[] }

export function createHighlightedString(ranges: Range[], text: string): string
