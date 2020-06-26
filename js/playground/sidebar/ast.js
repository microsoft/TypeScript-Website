define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showASTPlugin = void 0;
    exports.showASTPlugin = (i, utils) => {
        let container;
        let ast;
        let disposable;
        const plugin = {
            id: "ast",
            displayName: "AST",
            willMount: (_, _container) => {
                container = _container;
            },
            didMount: (sandbox, container) => {
                // While this plugin is forefront, keep cursor changes in sync with the AST selection
                disposable = sandbox.editor.onDidChangeCursorPosition(e => {
                    var _a;
                    const cursorPos = sandbox.getModel().getOffsetAt(e.position);
                    const allTreeStarts = container.querySelectorAll("div.ast-tree-start");
                    let deepestElement = null;
                    allTreeStarts.forEach(e => {
                        // Close them all first, because we're about to open them up after
                        e.classList.remove("open");
                        // Find the deepest element in the set and open it up
                        const { pos, end, depth } = e.dataset;
                        const nPos = Number(pos);
                        const nEnd = Number(end);
                        if (cursorPos > nPos && cursorPos <= nEnd) {
                            if (deepestElement) {
                                const currentDepth = Number(deepestElement.dataset.depth);
                                if (currentDepth < Number(depth)) {
                                    deepestElement = e;
                                }
                            }
                            else {
                                deepestElement = e;
                            }
                        }
                    });
                    // Take that element, open it up, then go through its ancestors till they are all opened
                    let openUpElement = deepestElement;
                    while (openUpElement) {
                        openUpElement.classList.add("open");
                        openUpElement = (_a = openUpElement.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".ast-tree-start");
                    }
                    // Scroll and flash to let folks see what's happening
                    deepestElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    utils.flashHTMLElement(deepestElement);
                });
            },
            modelChangedDebounce: sandbox => {
                const ds = utils.createDesignSystem(container);
                ds.clear();
                ds.title("AST");
                sandbox.getAST().then(tree => {
                    ast = ds.createASTTree(tree);
                });
            },
            didUnmount: () => {
                disposable && disposable.dispose();
            },
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvc2lkZWJhci9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUdhLFFBQUEsYUFBYSxHQUFrQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN2RCxJQUFJLFNBQXNCLENBQUE7UUFDMUIsSUFBSSxHQUFnQixDQUFBO1FBQ3BCLElBQUksVUFBbUMsQ0FBQTtRQUV2QyxNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLEtBQUs7WUFDVCxXQUFXLEVBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUU7Z0JBQzNCLFNBQVMsR0FBRyxVQUFVLENBQUE7WUFDeEIsQ0FBQztZQUNELFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDL0IscUZBQXFGO2dCQUVyRixVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs7b0JBQ3hELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO29CQUM1RCxNQUFNLGFBQWEsR0FBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQTZCLENBQUE7b0JBRW5HLElBQUksY0FBYyxHQUFtQixJQUFXLENBQUE7b0JBRWhELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3hCLGtFQUFrRTt3QkFDbEUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBRTFCLHFEQUFxRDt3QkFDckQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQXNELENBQUE7d0JBQ3BGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTt3QkFDeEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUV4QixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTs0QkFDekMsSUFBSSxjQUFjLEVBQUU7Z0NBQ2xCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUMxRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7b0NBQ2hDLGNBQWMsR0FBRyxDQUFDLENBQUE7aUNBQ25COzZCQUNGO2lDQUFNO2dDQUNMLGNBQWMsR0FBRyxDQUFDLENBQUE7NkJBQ25CO3lCQUNGO29CQUNILENBQUMsQ0FBQyxDQUFBO29CQUVGLHdGQUF3RjtvQkFDeEYsSUFBSSxhQUFhLEdBQXNDLGNBQWMsQ0FBQTtvQkFDckUsT0FBTyxhQUFhLEVBQUU7d0JBQ3BCLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUNuQyxhQUFhLFNBQUcsYUFBYSxDQUFDLGFBQWEsMENBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7cUJBQ3hFO29CQUVELHFEQUFxRDtvQkFDckQsY0FBYyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7b0JBQ3ZFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDeEMsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0Qsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDOUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO2dCQUNWLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBRWYsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDM0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzlCLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELFVBQVUsRUFBRSxHQUFHLEVBQUU7Z0JBQ2YsVUFBVSxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNwQyxDQUFDO1NBQ0YsQ0FBQTtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiwgUGx1Z2luRmFjdG9yeSB9IGZyb20gXCIuLlwiXG5pbXBvcnQgdHlwZSB7IElEaXNwb3NhYmxlIH0gZnJvbSBcIm1vbmFjby1lZGl0b3JcIlxuXG5leHBvcnQgY29uc3Qgc2hvd0FTVFBsdWdpbjogUGx1Z2luRmFjdG9yeSA9IChpLCB1dGlscykgPT4ge1xuICBsZXQgY29udGFpbmVyOiBIVE1MRWxlbWVudFxuICBsZXQgYXN0OiBIVE1MRWxlbWVudFxuICBsZXQgZGlzcG9zYWJsZTogSURpc3Bvc2FibGUgfCB1bmRlZmluZWRcblxuICBjb25zdCBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gPSB7XG4gICAgaWQ6IFwiYXN0XCIsXG4gICAgZGlzcGxheU5hbWU6IFwiQVNUXCIsXG4gICAgd2lsbE1vdW50OiAoXywgX2NvbnRhaW5lcikgPT4ge1xuICAgICAgY29udGFpbmVyID0gX2NvbnRhaW5lclxuICAgIH0sXG4gICAgZGlkTW91bnQ6IChzYW5kYm94LCBjb250YWluZXIpID0+IHtcbiAgICAgIC8vIFdoaWxlIHRoaXMgcGx1Z2luIGlzIGZvcmVmcm9udCwga2VlcCBjdXJzb3IgY2hhbmdlcyBpbiBzeW5jIHdpdGggdGhlIEFTVCBzZWxlY3Rpb25cblxuICAgICAgZGlzcG9zYWJsZSA9IHNhbmRib3guZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnNvclBvcyA9IHNhbmRib3guZ2V0TW9kZWwoKS5nZXRPZmZzZXRBdChlLnBvc2l0aW9uKVxuICAgICAgICBjb25zdCBhbGxUcmVlU3RhcnRzID0gKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2LmFzdC10cmVlLXN0YXJ0XCIpIGFzIGFueSkgYXMgSFRNTERpdkVsZW1lbnRbXVxuXG4gICAgICAgIGxldCBkZWVwZXN0RWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBudWxsIGFzIGFueVxuXG4gICAgICAgIGFsbFRyZWVTdGFydHMuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAvLyBDbG9zZSB0aGVtIGFsbCBmaXJzdCwgYmVjYXVzZSB3ZSdyZSBhYm91dCB0byBvcGVuIHRoZW0gdXAgYWZ0ZXJcbiAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoXCJvcGVuXCIpXG5cbiAgICAgICAgICAvLyBGaW5kIHRoZSBkZWVwZXN0IGVsZW1lbnQgaW4gdGhlIHNldCBhbmQgb3BlbiBpdCB1cFxuICAgICAgICAgIGNvbnN0IHsgcG9zLCBlbmQsIGRlcHRoIH0gPSBlLmRhdGFzZXQgYXMgeyBwb3M6IHN0cmluZzsgZW5kOiBzdHJpbmc7IGRlcHRoOiBzdHJpbmcgfVxuICAgICAgICAgIGNvbnN0IG5Qb3MgPSBOdW1iZXIocG9zKVxuICAgICAgICAgIGNvbnN0IG5FbmQgPSBOdW1iZXIoZW5kKVxuXG4gICAgICAgICAgaWYgKGN1cnNvclBvcyA+IG5Qb3MgJiYgY3Vyc29yUG9zIDw9IG5FbmQpIHtcbiAgICAgICAgICAgIGlmIChkZWVwZXN0RWxlbWVudCkge1xuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RGVwdGggPSBOdW1iZXIoZGVlcGVzdEVsZW1lbnQhLmRhdGFzZXQuZGVwdGgpXG4gICAgICAgICAgICAgIGlmIChjdXJyZW50RGVwdGggPCBOdW1iZXIoZGVwdGgpKSB7XG4gICAgICAgICAgICAgICAgZGVlcGVzdEVsZW1lbnQgPSBlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlZXBlc3RFbGVtZW50ID0gZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBUYWtlIHRoYXQgZWxlbWVudCwgb3BlbiBpdCB1cCwgdGhlbiBnbyB0aHJvdWdoIGl0cyBhbmNlc3RvcnMgdGlsbCB0aGV5IGFyZSBhbGwgb3BlbmVkXG4gICAgICAgIGxldCBvcGVuVXBFbGVtZW50OiBIVE1MRGl2RWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQgPSBkZWVwZXN0RWxlbWVudFxuICAgICAgICB3aGlsZSAob3BlblVwRWxlbWVudCkge1xuICAgICAgICAgIG9wZW5VcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm9wZW5cIilcbiAgICAgICAgICBvcGVuVXBFbGVtZW50ID0gb3BlblVwRWxlbWVudC5wYXJlbnRFbGVtZW50Py5jbG9zZXN0KFwiLmFzdC10cmVlLXN0YXJ0XCIpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBTY3JvbGwgYW5kIGZsYXNoIHRvIGxldCBmb2xrcyBzZWUgd2hhdCdzIGhhcHBlbmluZ1xuICAgICAgICBkZWVwZXN0RWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiBcIm5lYXJlc3RcIiwgYmVoYXZpb3I6IFwic21vb3RoXCIgfSlcbiAgICAgICAgdXRpbHMuZmxhc2hIVE1MRWxlbWVudChkZWVwZXN0RWxlbWVudClcbiAgICAgIH0pXG4gICAgfSxcbiAgICBtb2RlbENoYW5nZWREZWJvdW5jZTogc2FuZGJveCA9PiB7XG4gICAgICBjb25zdCBkcyA9IHV0aWxzLmNyZWF0ZURlc2lnblN5c3RlbShjb250YWluZXIpXG4gICAgICBkcy5jbGVhcigpXG4gICAgICBkcy50aXRsZShcIkFTVFwiKVxuXG4gICAgICBzYW5kYm94LmdldEFTVCgpLnRoZW4odHJlZSA9PiB7XG4gICAgICAgIGFzdCA9IGRzLmNyZWF0ZUFTVFRyZWUodHJlZSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkaWRVbm1vdW50OiAoKSA9PiB7XG4gICAgICBkaXNwb3NhYmxlICYmIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgfSxcbiAgfVxuXG4gIHJldHVybiBwbHVnaW5cbn1cbiJdfQ==