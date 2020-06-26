define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compiledJSPlugin = void 0;
    exports.compiledJSPlugin = (i, utils) => {
        let codeElement;
        const plugin = {
            id: "js",
            displayName: i("play_sidebar_js"),
            willMount: (_, container) => {
                const { code } = utils.createDesignSystem(container);
                codeElement = code("");
            },
            modelChangedDebounce: (sandbox, model) => {
                sandbox.getRunnableJS().then(js => {
                    sandbox.monaco.editor.colorize(js, "javascript", {}).then(coloredJS => {
                        codeElement.innerHTML = coloredJS;
                    });
                });
            },
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0pTLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvc2lkZWJhci9zaG93SlMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUVhLFFBQUEsZ0JBQWdCLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFELElBQUksV0FBd0IsQ0FBQTtRQUU1QixNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLElBQUk7WUFDUixXQUFXLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDcEQsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN4QixDQUFDO1lBQ0Qsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3ZDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDcEUsV0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7b0JBQ25DLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRQbHVnaW4sIFBsdWdpbkZhY3RvcnkgfSBmcm9tIFwiLi5cIlxuXG5leHBvcnQgY29uc3QgY29tcGlsZWRKU1BsdWdpbjogUGx1Z2luRmFjdG9yeSA9IChpLCB1dGlscykgPT4ge1xuICBsZXQgY29kZUVsZW1lbnQ6IEhUTUxFbGVtZW50XG5cbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcImpzXCIsXG4gICAgZGlzcGxheU5hbWU6IGkoXCJwbGF5X3NpZGViYXJfanNcIiksXG4gICAgd2lsbE1vdW50OiAoXywgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb25zdCB7IGNvZGUgfSA9IHV0aWxzLmNyZWF0ZURlc2lnblN5c3RlbShjb250YWluZXIpXG4gICAgICBjb2RlRWxlbWVudCA9IGNvZGUoXCJcIilcbiAgICB9LFxuICAgIG1vZGVsQ2hhbmdlZERlYm91bmNlOiAoc2FuZGJveCwgbW9kZWwpID0+IHtcbiAgICAgIHNhbmRib3guZ2V0UnVubmFibGVKUygpLnRoZW4oanMgPT4ge1xuICAgICAgICBzYW5kYm94Lm1vbmFjby5lZGl0b3IuY29sb3JpemUoanMsIFwiamF2YXNjcmlwdFwiLCB7fSkudGhlbihjb2xvcmVkSlMgPT4ge1xuICAgICAgICAgIGNvZGVFbGVtZW50LmlubmVySFRNTCA9IGNvbG9yZWRKU1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19