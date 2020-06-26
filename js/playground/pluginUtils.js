define(["require", "exports", "./ds/createDesignSystem"], function (require, exports, createDesignSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createUtils = void 0;
    /** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
    exports.createUtils = (sb, react) => {
        const sandbox = sb;
        const requireURL = (path) => {
            // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
            const isDev = document.location.host.includes("localhost");
            const prefix = isDev ? "local/" : "unpkg/typescript-playground-presentation-mode/dist/";
            return prefix + path;
        };
        const el = (str, elementType, container) => {
            const el = document.createElement(elementType);
            el.innerHTML = str;
            container.appendChild(el);
            return el;
        };
        const flashHTMLElement = (element) => {
            element.classList.add("briefly-highlight");
            setTimeout(() => element.classList.remove("briefly-highlight"), 1000);
        };
        return {
            /** Use this to make a few dumb element generation funcs */
            el,
            /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
            requireURL,
            /** The Gatsby copy of React */
            react,
            /**
             * The playground plugin design system. Calling any of the functions will append the
             * element to the container you pass into the first param, and return the HTMLElement
             */
            createDesignSystem: createDesignSystem_1.createDesignSystem(sandbox),
            /** Flashes a HTML Element */
            flashHTMLElement,
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9wbHVnaW5VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBSUEsNEdBQTRHO0lBQy9GLFFBQUEsV0FBVyxHQUFHLENBQUMsRUFBTyxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMxRCxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUE7UUFFM0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUNsQyx3SkFBd0o7WUFDeEosTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzFELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxxREFBcUQsQ0FBQTtZQUN2RixPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsV0FBbUIsRUFBRSxTQUFrQixFQUFFLEVBQUU7WUFDbEUsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUM5QyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQTtZQUNsQixTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3pCLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQyxDQUFBO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQW9CLEVBQUUsRUFBRTtZQUNoRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQzFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3ZFLENBQUMsQ0FBQTtRQUVELE9BQU87WUFDTCwyREFBMkQ7WUFDM0QsRUFBRTtZQUNGLHFHQUFxRztZQUNyRyxVQUFVO1lBQ1YsK0JBQStCO1lBQy9CLEtBQUs7WUFDTDs7O2VBR0c7WUFDSCxrQkFBa0IsRUFBRSx1Q0FBa0IsQ0FBQyxPQUFPLENBQUM7WUFDL0MsNkJBQTZCO1lBQzdCLGdCQUFnQjtTQUNqQixDQUFBO0lBQ0gsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTYW5kYm94IH0gZnJvbSBcInR5cGVzY3JpcHQtc2FuZGJveFwiXG5pbXBvcnQgdHlwZSBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgY3JlYXRlRGVzaWduU3lzdGVtIH0gZnJvbSBcIi4vZHMvY3JlYXRlRGVzaWduU3lzdGVtXCJcblxuLyoqIENyZWF0ZXMgYSBzZXQgb2YgdXRpbCBmdW5jdGlvbnMgd2hpY2ggaXMgZXhwb3NlZCB0byBQbHVnaW5zIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGJ1aWxkIGNvbnNpc3RlbnQgVUlzICovXG5leHBvcnQgY29uc3QgY3JlYXRlVXRpbHMgPSAoc2I6IGFueSwgcmVhY3Q6IHR5cGVvZiBSZWFjdCkgPT4ge1xuICBjb25zdCBzYW5kYm94OiBTYW5kYm94ID0gc2JcblxuICBjb25zdCByZXF1aXJlVVJMID0gKHBhdGg6IHN0cmluZykgPT4ge1xuICAgIC8vIGh0dHBzOi8vdW5wa2cuY29tL2Jyb3dzZS90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGVAMC4wLjEvZGlzdC94LmpzID0+IHVucGtnL2Jyb3dzZS90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGVAMC4wLjEvZGlzdC94XG4gICAgY29uc3QgaXNEZXYgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0LmluY2x1ZGVzKFwibG9jYWxob3N0XCIpXG4gICAgY29uc3QgcHJlZml4ID0gaXNEZXYgPyBcImxvY2FsL1wiIDogXCJ1bnBrZy90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGUvZGlzdC9cIlxuICAgIHJldHVybiBwcmVmaXggKyBwYXRoXG4gIH1cblxuICBjb25zdCBlbCA9IChzdHI6IHN0cmluZywgZWxlbWVudFR5cGU6IHN0cmluZywgY29udGFpbmVyOiBFbGVtZW50KSA9PiB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnRUeXBlKVxuICAgIGVsLmlubmVySFRNTCA9IHN0clxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbClcbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIGNvbnN0IGZsYXNoSFRNTEVsZW1lbnQgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJicmllZmx5LWhpZ2hsaWdodFwiKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYnJpZWZseS1oaWdobGlnaHRcIiksIDEwMDApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKiBVc2UgdGhpcyB0byBtYWtlIGEgZmV3IGR1bWIgZWxlbWVudCBnZW5lcmF0aW9uIGZ1bmNzICovXG4gICAgZWwsXG4gICAgLyoqIEdldCBhIHJlbGF0aXZlIFVSTCBmb3Igc29tZXRoaW5nIGluIHlvdXIgZGlzdCBmb2xkZXIgZGVwZW5kaW5nIG9uIGlmIHlvdSdyZSBpbiBkZXYgbW9kZSBvciBub3QgKi9cbiAgICByZXF1aXJlVVJMLFxuICAgIC8qKiBUaGUgR2F0c2J5IGNvcHkgb2YgUmVhY3QgKi9cbiAgICByZWFjdCxcbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWdyb3VuZCBwbHVnaW4gZGVzaWduIHN5c3RlbS4gQ2FsbGluZyBhbnkgb2YgdGhlIGZ1bmN0aW9ucyB3aWxsIGFwcGVuZCB0aGVcbiAgICAgKiBlbGVtZW50IHRvIHRoZSBjb250YWluZXIgeW91IHBhc3MgaW50byB0aGUgZmlyc3QgcGFyYW0sIGFuZCByZXR1cm4gdGhlIEhUTUxFbGVtZW50XG4gICAgICovXG4gICAgY3JlYXRlRGVzaWduU3lzdGVtOiBjcmVhdGVEZXNpZ25TeXN0ZW0oc2FuZGJveCksXG4gICAgLyoqIEZsYXNoZXMgYSBIVE1MIEVsZW1lbnQgKi9cbiAgICBmbGFzaEhUTUxFbGVtZW50LFxuICB9XG59XG5cbmV4cG9ydCB0eXBlIFBsdWdpblV0aWxzID0gUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlVXRpbHM+XG4iXX0=