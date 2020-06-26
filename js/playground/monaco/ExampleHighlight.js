define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExampleHighlighter = void 0;
    /**
     * Allows inline clicking on internal URLs to get different example code
     */
    class ExampleHighlighter {
        provideLinks(model) {
            const text = model.getValue();
            // https://regex101.com/r/3uM4Fa/1
            const docRegexLink = /example:([^\s]+)/g;
            const links = [];
            let match;
            while ((match = docRegexLink.exec(text)) !== null) {
                const start = match.index;
                const end = match.index + match[0].length;
                const startPos = model.getPositionAt(start);
                const endPos = model.getPositionAt(end);
                const range = {
                    startLineNumber: startPos.lineNumber,
                    startColumn: startPos.column,
                    endLineNumber: endPos.lineNumber,
                    endColumn: endPos.column,
                };
                const url = document.location.href.split('#')[0];
                links.push({
                    url: url + '#example/' + match[1],
                    range,
                });
            }
            return { links };
        }
    }
    exports.ExampleHighlighter = ExampleHighlighter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhhbXBsZUhpZ2hsaWdodC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL21vbmFjby9FeGFtcGxlSGlnaGxpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQTs7T0FFRztJQUNILE1BQWEsa0JBQWtCO1FBQzdCLFlBQVksQ0FBQyxLQUE0QztZQUN2RCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7WUFFN0Isa0NBQWtDO1lBQ2xDLE1BQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFBO1lBRXhDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQTtZQUVoQixJQUFJLEtBQUssQ0FBQTtZQUNULE9BQU8sQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDakQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQTtnQkFDekIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO2dCQUN6QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMzQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUV2QyxNQUFNLEtBQUssR0FBRztvQkFDWixlQUFlLEVBQUUsUUFBUSxDQUFDLFVBQVU7b0JBQ3BDLFdBQVcsRUFBRSxRQUFRLENBQUMsTUFBTTtvQkFDNUIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxVQUFVO29CQUNoQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU07aUJBQ3pCLENBQUE7Z0JBRUQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNoRCxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNULEdBQUcsRUFBRSxHQUFHLEdBQUcsV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEtBQUs7aUJBQ04sQ0FBQyxDQUFBO2FBQ0g7WUFFRCxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFDbEIsQ0FBQztLQUNGO0lBaENELGdEQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWxsb3dzIGlubGluZSBjbGlja2luZyBvbiBpbnRlcm5hbCBVUkxzIHRvIGdldCBkaWZmZXJlbnQgZXhhbXBsZSBjb2RlXG4gKi9cbmV4cG9ydCBjbGFzcyBFeGFtcGxlSGlnaGxpZ2h0ZXIge1xuICBwcm92aWRlTGlua3MobW9kZWw6IGltcG9ydCgnbW9uYWNvLWVkaXRvcicpLmVkaXRvci5JTW9kZWwpIHtcbiAgICBjb25zdCB0ZXh0ID0gbW9kZWwuZ2V0VmFsdWUoKVxuXG4gICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci8zdU00RmEvMVxuICAgIGNvbnN0IGRvY1JlZ2V4TGluayA9IC9leGFtcGxlOihbXlxcc10rKS9nXG5cbiAgICBjb25zdCBsaW5rcyA9IFtdXG5cbiAgICBsZXQgbWF0Y2hcbiAgICB3aGlsZSAoKG1hdGNoID0gZG9jUmVnZXhMaW5rLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzdGFydCA9IG1hdGNoLmluZGV4XG4gICAgICBjb25zdCBlbmQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBtb2RlbC5nZXRQb3NpdGlvbkF0KHN0YXJ0KVxuICAgICAgY29uc3QgZW5kUG9zID0gbW9kZWwuZ2V0UG9zaXRpb25BdChlbmQpXG5cbiAgICAgIGNvbnN0IHJhbmdlID0ge1xuICAgICAgICBzdGFydExpbmVOdW1iZXI6IHN0YXJ0UG9zLmxpbmVOdW1iZXIsXG4gICAgICAgIHN0YXJ0Q29sdW1uOiBzdGFydFBvcy5jb2x1bW4sXG4gICAgICAgIGVuZExpbmVOdW1iZXI6IGVuZFBvcy5saW5lTnVtYmVyLFxuICAgICAgICBlbmRDb2x1bW46IGVuZFBvcy5jb2x1bW4sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVybCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXVxuICAgICAgbGlua3MucHVzaCh7XG4gICAgICAgIHVybDogdXJsICsgJyNleGFtcGxlLycgKyBtYXRjaFsxXSxcbiAgICAgICAgcmFuZ2UsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7IGxpbmtzIH1cbiAgfVxufVxuIl19