var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../localizeWithFallback"], function (require, exports, localizeWithFallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showErrors = void 0;
    exports.showErrors = (i, utils) => {
        const plugin = {
            id: "errors",
            displayName: i("play_sidebar_errors"),
            modelChangedDebounce: (sandbox, model, container) => __awaiter(void 0, void 0, void 0, function* () {
                const ds = utils.createDesignSystem(container);
                sandbox.getWorkerProcess().then(worker => {
                    worker.getSemanticDiagnostics(model.uri.toString()).then(diags => {
                        // @ts-ignore
                        const playground = window.playground;
                        // TODO: We should update a badge with the number of labels or something
                        if (playground.getCurrentPlugin().id !== "errors")
                            return;
                        // Bail early if there's nothing to show
                        if (!diags.length) {
                            ds.showEmptyScreen(localizeWithFallback_1.localize("play_sidebar_errors_no_errors", "No errors"));
                            return;
                        }
                        // Clean any potential empty screens
                        ds.clear();
                        ds.listDiags(model, diags);
                    });
                });
            }),
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvc2hvd0Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBR2EsUUFBQSxVQUFVLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BELE1BQU0sTUFBTSxHQUFxQjtZQUMvQixFQUFFLEVBQUUsUUFBUTtZQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUM7WUFDckMsb0JBQW9CLEVBQUUsQ0FBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUN4RCxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBRTlDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDdkMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQy9ELGFBQWE7d0JBQ2IsTUFBTSxVQUFVLEdBQWUsTUFBTSxDQUFDLFVBQVUsQ0FBQTt3QkFFaEQsd0VBQXdFO3dCQUN4RSxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsS0FBSyxRQUFROzRCQUFFLE9BQU07d0JBRXpELHdDQUF3Qzt3QkFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ2pCLEVBQUUsQ0FBQyxlQUFlLENBQUMsK0JBQVEsQ0FBQywrQkFBK0IsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBOzRCQUMxRSxPQUFNO3lCQUNQO3dCQUVELG9DQUFvQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFBO3dCQUNWLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO29CQUM1QixDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQTtTQUNGLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRQbHVnaW4sIFBsdWdpbkZhY3RvcnksIFBsYXlncm91bmQgfSBmcm9tIFwiLi5cIlxuaW1wb3J0IHsgbG9jYWxpemUgfSBmcm9tIFwiLi4vbG9jYWxpemVXaXRoRmFsbGJhY2tcIlxuXG5leHBvcnQgY29uc3Qgc2hvd0Vycm9yczogUGx1Z2luRmFjdG9yeSA9IChpLCB1dGlscykgPT4ge1xuICBjb25zdCBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gPSB7XG4gICAgaWQ6IFwiZXJyb3JzXCIsXG4gICAgZGlzcGxheU5hbWU6IGkoXCJwbGF5X3NpZGViYXJfZXJyb3JzXCIpLFxuICAgIG1vZGVsQ2hhbmdlZERlYm91bmNlOiBhc3luYyAoc2FuZGJveCwgbW9kZWwsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgY29uc3QgZHMgPSB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0oY29udGFpbmVyKVxuXG4gICAgICBzYW5kYm94LmdldFdvcmtlclByb2Nlc3MoKS50aGVuKHdvcmtlciA9PiB7XG4gICAgICAgIHdvcmtlci5nZXRTZW1hbnRpY0RpYWdub3N0aWNzKG1vZGVsLnVyaS50b1N0cmluZygpKS50aGVuKGRpYWdzID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29uc3QgcGxheWdyb3VuZDogUGxheWdyb3VuZCA9IHdpbmRvdy5wbGF5Z3JvdW5kXG5cbiAgICAgICAgICAvLyBUT0RPOiBXZSBzaG91bGQgdXBkYXRlIGEgYmFkZ2Ugd2l0aCB0aGUgbnVtYmVyIG9mIGxhYmVscyBvciBzb21ldGhpbmdcbiAgICAgICAgICBpZiAocGxheWdyb3VuZC5nZXRDdXJyZW50UGx1Z2luKCkuaWQgIT09IFwiZXJyb3JzXCIpIHJldHVyblxuXG4gICAgICAgICAgLy8gQmFpbCBlYXJseSBpZiB0aGVyZSdzIG5vdGhpbmcgdG8gc2hvd1xuICAgICAgICAgIGlmICghZGlhZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBkcy5zaG93RW1wdHlTY3JlZW4obG9jYWxpemUoXCJwbGF5X3NpZGViYXJfZXJyb3JzX25vX2Vycm9yc1wiLCBcIk5vIGVycm9yc1wiKSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENsZWFuIGFueSBwb3RlbnRpYWwgZW1wdHkgc2NyZWVuc1xuICAgICAgICAgIGRzLmNsZWFyKClcbiAgICAgICAgICBkcy5saXN0RGlhZ3MobW9kZWwsIGRpYWdzKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19