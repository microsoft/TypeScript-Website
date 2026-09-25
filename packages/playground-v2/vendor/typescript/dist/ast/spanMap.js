import { SpanMapFeature } from "#enums/spanMapFeature";
import { SpanMapFidelity } from "#enums/spanMapFidelity";
import { SpanMapKind } from "#enums/spanMapKind";
export { SpanMapFeature, SpanMapFidelity, SpanMapKind };
/** Provides bidirectional span-aware mapping between virtual and original text. */
export class SpanMap {
    segments;
    originalIndex;
    /** Copies and sorts segments by virtual start, normalizing omitted features to `All`. */
    constructor(segments) {
        this.segments = segments
            .map(segment => ({ ...segment, features: segment.features ?? SpanMapFeature.All }))
            .sort((left, right) => left.virtualStart - right.virtualStart);
    }
    /** Reports whether a mapping is a precise, edit-safe projection through one verbatim segment. */
    static isExact(fidelity) {
        return fidelity === SpanMapFidelity.Exact;
    }
    /** Reports whether a mapping lies in one verbatim or atom segment. */
    static isSingleSegment(fidelity) {
        return fidelity === SpanMapFidelity.Exact || fidelity === SpanMapFidelity.Atom;
    }
    /** Reports whether the input had no counterpart in the target text. */
    static isNone(fidelity) {
        return fidelity === SpanMapFidelity.None;
    }
    /**
     * Maps a virtual range to original text. Gaps map to insertion points with `None` fidelity,
     * and ranges crossing segment boundaries map their endpoints with `Approximate` fidelity.
     */
    virtualToOriginalSpan(range) {
        return this.mapRange(range, this.segments, false);
    }
    /** Maps a visible LS result only when every covered segment participates in `feature`. */
    virtualToOriginalSpanForFeature(range, feature) {
        const mapped = this.virtualToOriginalSpan(range);
        return this.virtualRangeSupportsFeature(range, feature) ? mapped : { ...mapped, fidelity: SpanMapFidelity.None };
    }
    /** Maps a virtual position to original text, using `None` fidelity for synthesized gaps. */
    virtualToOriginalPosition(position) {
        return this.mapPoint(position, this.segments, false);
    }
    virtualToOriginalPositionForFeature(position, feature) {
        const mapped = this.virtualToOriginalPosition(position);
        const [index, inside] = segmentIndexAt(this.segments, position, false);
        return inside && supportsFeature(this.segments[index], feature) ? mapped : { ...mapped, fidelity: SpanMapFidelity.None };
    }
    /**
     * Returns every virtual projection of an original position whose segment participates in `feature`.
     * Segment ends are inclusive for point mapping, so adjacent spans may both produce projections.
     * Results are ordered by virtual position; uncovered or disabled positions produce no results.
     */
    originalToVirtualPositions(position, feature) {
        const groups = segmentGroupsAtOriginalPosition(this.getOriginalIndex(), position);
        const results = [];
        for (const group of groups) {
            for (const segment of group.segments) {
                if (!supportsFeature(segment, feature))
                    continue;
                const mapped = segment.kind === SpanMapKind.Verbatim
                    ? { position: mapVerbatimPosition(segment, position, true), fidelity: SpanMapFidelity.Exact }
                    : { position: group.atEnd ? segment.virtualEnd : segment.virtualStart, fidelity: SpanMapFidelity.Atom };
                if (!results.some(result => result.position === mapped.position && result.fidelity === mapped.fidelity)) {
                    results.push(mapped);
                }
            }
        }
        return results.sort((left, right) => left.position - right.position);
    }
    /**
     * Returns every feature-compatible virtual projection of an original range.
     * A range contained by one or more segments produces one exact or atom result per matching segment.
     *
     * A range that starts in one group and ends in another can have several possible virtual ranges. For
     * example, suppose two original segments are each copied twice into the virtual text:
     *
     * ```text
     * original:   [ A ][ B ]
     *                [---)       range from inside A to inside B
     *
     * virtual:    [ A ][ B ]      [ A ][ B ]
     *                ^   ^          ^   ^
     *              start end      start end
     *                1   3          11  13
     * ```
     *
     * The map says that the range may start at 1 or 11 and end at 3 or 13, but it does not say which copy of A
     * belongs with which copy of B. We choose the smallest range around each possible location, producing [1,3)
     * and [11,13). We do not return [1,13), because it contains both smaller candidates and would include code
     * that may be unrelated to the original range. These cross-group results have approximate fidelity.
     */
    originalToVirtualSpans(range, feature) {
        const start = range.pos;
        const end = Math.max(range.end, start);
        if (start === end) {
            return this.originalToVirtualPositions(start, feature).map(({ position, fidelity }) => ({
                range: { pos: position, end: position },
                fidelity,
            }));
        }
        const lastCharacter = end - 1;
        const originalIndex = this.getOriginalIndex();
        const startSegments = segmentsAtOriginalPosition(originalIndex, start);
        const endSegments = segmentsAtOriginalPosition(originalIndex, lastCharacter);
        if (!startSegments || !endSegments)
            return [];
        const containing = startSegments.filter(segment => end <= segment.originalEnd);
        if (containing.length > 0) {
            const results = [...originalToVirtualSpansInSegments(containing, start, end, feature)];
            if (results.length > 0)
                return results.sort((left, right) => left.range.pos - right.range.pos);
        }
        const starts = [...originalStartProjections(startSegments, start, feature)].sort((left, right) => left - right);
        const ends = [...originalEndProjections(endSegments, end, feature)].sort((left, right) => left - right);
        if (starts.length === 0 || ends.length === 0)
            return [];
        return starts.flatMap((virtualStart, index) => {
            const virtualEnd = ends.find(end => end >= virtualStart);
            return virtualEnd === undefined || index + 1 < starts.length && starts[index + 1] <= virtualEnd
                ? []
                : [{ range: { pos: virtualStart, end: virtualEnd }, fidelity: SpanMapFidelity.Approximate }];
        });
    }
    /** Maps one range through an ordered segment index in the direction selected by `reverse`. */
    mapRange(range, segments, reverse) {
        const start = range.pos;
        const end = Math.max(range.end, start);
        if (start === end) {
            const { position, fidelity } = this.mapPoint(start, segments, reverse);
            return { range: { pos: position, end: position }, fidelity };
        }
        const [startIndex, startInside] = segmentIndexAt(segments, start, reverse);
        const endProbe = end - 1;
        const [endIndex, endInside] = segmentIndexAt(segments, endProbe, reverse);
        if (startIndex === endIndex && startInside === endInside) {
            if (startInside) {
                const segment = segments[startIndex];
                if (segment.kind === SpanMapKind.Verbatim) {
                    const mappedStart = mapVerbatimPosition(segment, start, reverse);
                    const mappedEnd = Math.max(mappedStart, mapVerbatimPosition(segment, end, reverse));
                    return { range: { pos: mappedStart, end: mappedEnd }, fidelity: SpanMapFidelity.Exact };
                }
                return { range: targetRange(segment, reverse), fidelity: SpanMapFidelity.Atom };
            }
            const position = insertionPoint(segments, startIndex, reverse);
            return { range: { pos: position, end: position }, fidelity: SpanMapFidelity.None };
        }
        const mappedStart = mapBoundary(segments, start, startIndex, startInside, reverse, false);
        const mappedEnd = Math.max(mappedStart, mapBoundary(segments, end, endIndex, endInside, reverse, true));
        return { range: { pos: mappedStart, end: mappedEnd }, fidelity: SpanMapFidelity.Approximate };
    }
    /** Maps one position through an ordered segment index in the direction selected by `reverse`. */
    mapPoint(position, segments, reverse) {
        const [index, inside] = segmentIndexAt(segments, position, reverse);
        if (!inside) {
            return { position: insertionPoint(segments, index, reverse), fidelity: SpanMapFidelity.None };
        }
        const segment = segments[index];
        if (segment.kind === SpanMapKind.Verbatim) {
            return { position: mapVerbatimPosition(segment, position, reverse), fidelity: SpanMapFidelity.Exact };
        }
        return {
            position: reverse ? segment.virtualStart : segment.originalStart,
            fidelity: SpanMapFidelity.Atom,
        };
    }
    /** Returns the lazily built original-text interval index. */
    getOriginalIndex() {
        if (this.originalIndex)
            return this.originalIndex;
        const segments = [...this.segments].sort((left, right) => left.originalStart - right.originalStart
            || left.originalEnd - right.originalEnd
            || left.virtualStart - right.virtualStart);
        let leafCount = 1;
        while (leafCount < segments.length)
            leafCount *= 2;
        const maxEnds = new Array(2 * leafCount).fill(0);
        for (let i = 0; i < segments.length; i++)
            maxEnds[leafCount + i] = segments[i].originalEnd;
        for (let i = leafCount - 1; i > 0; i--)
            maxEnds[i] = Math.max(maxEnds[2 * i], maxEnds[2 * i + 1]);
        return this.originalIndex = { segments, leafCount, maxEnds };
    }
    virtualRangeSupportsFeature(range, feature) {
        const start = range.pos;
        const end = Math.max(range.end, start);
        if (start === end) {
            const [index, inside] = segmentIndexAt(this.segments, start, false);
            return inside && supportsFeature(this.segments[index], feature);
        }
        let [index, inside] = segmentIndexAt(this.segments, start, false);
        if (!inside)
            return false;
        let coveredThrough = start;
        while (index < this.segments.length && coveredThrough < end) {
            const segment = this.segments[index];
            if (segment.virtualStart > coveredThrough || segment.virtualEnd <= coveredThrough || !supportsFeature(segment, feature))
                return false;
            coveredThrough = segment.virtualEnd;
            index++;
        }
        return coveredThrough >= end;
    }
}
/**
 * Maps the inclusive start of an original range through every matching segment. Verbatim segments preserve
 * the offset within the segment; atoms map to their virtual start.
 *
 * ```text
 * original:       [---------)
 *                    ^ start
 *
 * virtual:    [---------)   [---------)
 *                ^             ^
 *              result        result
 * ```
 */
function originalStartProjections(segments, start, feature) {
    return segments
        .filter(segment => supportsFeature(segment, feature))
        .map(segment => segment.kind === SpanMapKind.Verbatim
        ? mapVerbatimPosition(segment, start, true)
        : segment.virtualStart);
}
/**
 * Maps the exclusive end of an original range through every matching segment. The caller uses `end - 1`
 * to find the segment containing the final character, while this helper maps the `end` boundary itself.
 *
 * ```text
 * original:       [---------)[ next segment )
 *                          ^`-- end
 *                          `--- end - 1
 *
 * virtual:    [---------)   [---------)
 *                       ^             ^
 *                     result        result
 * ```
 */
function originalEndProjections(segments, end, feature) {
    return segments
        .filter(segment => supportsFeature(segment, feature))
        .map(segment => segment.kind === SpanMapKind.Verbatim
        ? mapVerbatimPosition(segment, end, true)
        : segment.virtualEnd);
}
/** Maps a range fully contained by each segment. */
function originalToVirtualSpansInSegments(segments, start, end, feature) {
    return segments
        .filter(segment => supportsFeature(segment, feature))
        .map(segment => {
        if (segment.kind === SpanMapKind.Verbatim) {
            const mappedStart = mapVerbatimPosition(segment, start, true);
            const mappedEnd = Math.max(mappedStart, mapVerbatimPosition(segment, end, true));
            return { range: { pos: mappedStart, end: mappedEnd }, fidelity: SpanMapFidelity.Exact };
        }
        return { range: { pos: segment.virtualStart, end: segment.virtualEnd }, fidelity: SpanMapFidelity.Atom };
    });
}
/** Reports whether two segments belong to the same duplicate group. */
function sameOriginalRange(left, right) {
    return left.originalStart === right.originalStart && left.originalEnd === right.originalEnd;
}
/**
 * Returns every mapping segment containing the original-text `position`.
 * Segment ends are exclusive; starts, including zero-length segment starts, are included.
 */
function segmentsAtOriginalPosition(index, position) {
    // Query intervals that contain position strictly before their exclusive end. Segments starting exactly at
    // position are appended separately so zero-length segments are included while maxEnd <= position is pruned.
    const start = firstOriginalSegmentAtOrAfter(index.segments, position);
    const results = segmentsEndingAtOrAfter(index, start, position, false);
    const end = firstOriginalSegmentAfter(index.segments, position);
    results.push(...index.segments.slice(start, end));
    return results.length > 0 ? results : undefined;
}
/** Returns segments among `[0, limit)` whose original end reaches `position`. */
function segmentsEndingAtOrAfter(index, limit, position, includeEnd) {
    const results = [];
    collectSegmentsEndingAtOrAfter(index, 1, 0, index.leafCount, limit, position, includeEnd, results);
    return results;
}
/** Walks the flat max-end tree left-to-right, preserving original-text order. */
function collectSegmentsEndingAtOrAfter(index, node, start, end, limit, position, includeEnd, results) {
    const maxEnd = index.maxEnds[node];
    if (start >= limit || maxEnd < position || !includeEnd && maxEnd === position)
        return;
    if (end - start === 1) {
        results.push(index.segments[start]);
        return;
    }
    const middle = start + ((end - start) >>> 1);
    collectSegmentsEndingAtOrAfter(index, 2 * node, start, middle, limit, position, includeEnd, results);
    collectSegmentsEndingAtOrAfter(index, 2 * node + 1, middle, end, limit, position, includeEnd, results);
}
/** Returns the first original-ordered segment whose start is greater than or equal to `position`. */
function firstOriginalSegmentAtOrAfter(segments, position) {
    let low = 0;
    let high = segments.length;
    while (low < high) {
        const middle = (low + high) >>> 1;
        if (segments[middle].originalStart < position)
            low = middle + 1;
        else
            high = middle;
    }
    return low;
}
/** Returns the first original-ordered segment whose start is greater than `position`. */
function firstOriginalSegmentAfter(segments, position) {
    let low = 0;
    let high = segments.length;
    while (low < high) {
        const middle = (low + high) >>> 1;
        if (segments[middle].originalStart <= position)
            low = middle + 1;
        else
            high = middle;
    }
    return low;
}
/**
 * Returns every group of equal-range mapping segments containing or touching the original-text `position`.
 * Segment ends are included for point mapping:
 *
 * ```text
 * original:  [--- A ---)[--- B ---)
 *                       ^ position
 *
 * virtual:   [ A1 ) [ A2 )    [ B1 ) [ B2 )
 *              left group       right group
 *              atEnd: true      atEnd: false
 * ```
 */
function segmentGroupsAtOriginalPosition(index, position) {
    const limit = firstOriginalSegmentAfter(index.segments, position);
    const segments = segmentsEndingAtOrAfter(index, limit, position, true);
    const groups = [];
    for (let start = 0; start < segments.length;) {
        let end = start + 1;
        while (end < segments.length && sameOriginalRange(segments[start], segments[end]))
            end++;
        const segment = segments[start];
        if (position <= segment.originalEnd) {
            groups.push({
                segments: segments.slice(start, end),
                atEnd: position === segment.originalEnd && position !== segment.originalStart,
            });
        }
        start = end;
    }
    return groups;
}
/** Reports whether a segment participates in an original-to-virtual query for `features`. */
function supportsFeature(segment, feature) {
    return (segment.features & feature) !== 0;
}
/**
 * Finds the segment containing `position`, or the preceding segment when `position` is in a gap.
 * The boolean distinguishes containment from a gap; `reverse` selects original rather than virtual coordinates.
 */
function segmentIndexAt(segments, position, reverse) {
    let low = 0;
    let high = segments.length;
    while (low < high) {
        const middle = (low + high) >>> 1;
        const start = reverse ? segments[middle].originalStart : segments[middle].virtualStart;
        if (start < position)
            low = middle + 1;
        else
            high = middle;
    }
    if (low < segments.length && (reverse ? segments[low].originalStart : segments[low].virtualStart) === position) {
        return [low, true];
    }
    const previous = low - 1;
    if (previous >= 0) {
        const end = reverse ? segments[previous].originalEnd : segments[previous].virtualEnd;
        if (position < end || previous === segments.length - 1 && position === end)
            return [previous, true];
    }
    return [previous, false];
}
/** Returns the target insertion point for a gap following `previous`, or zero before the first segment. */
function insertionPoint(segments, previous, reverse) {
    if (previous < 0)
        return 0;
    return reverse ? segments[previous].virtualEnd : segments[previous].originalEnd;
}
/** Linearly maps and clamps a position within a length-preserving verbatim segment. */
function mapVerbatimPosition(segment, position, reverse) {
    const sourceStart = reverse ? segment.originalStart : segment.virtualStart;
    const targetStart = reverse ? segment.virtualStart : segment.originalStart;
    const targetEnd = reverse ? segment.virtualEnd : segment.originalEnd;
    return clamp(targetStart + position - sourceStart, targetStart, targetEnd);
}
/** Maps a range boundary, using insertion points for gaps and the selected endpoint for atoms. */
function mapBoundary(segments, position, index, inside, reverse, high) {
    if (!inside)
        return insertionPoint(segments, index, reverse);
    const segment = segments[index];
    if (segment.kind === SpanMapKind.Verbatim)
        return mapVerbatimPosition(segment, position, reverse);
    if (reverse)
        return high ? segment.virtualEnd : segment.virtualStart;
    return high ? segment.originalEnd : segment.originalStart;
}
/** Returns the complete target range of a segment in the selected direction. */
function targetRange(segment, reverse) {
    return reverse
        ? { pos: segment.virtualStart, end: segment.virtualEnd }
        : { pos: segment.originalStart, end: segment.originalEnd };
}
/** Confines `value` to the inclusive interval [`low`, `high`]. */
function clamp(value, low, high) {
    return Math.max(low, Math.min(value, high));
}
//# sourceMappingURL=spanMap.js.map