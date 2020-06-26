var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./vendor/lzstring.min"], function (require, exports, lzstring_min_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInitialCode = void 0;
    lzstring_min_1 = __importDefault(lzstring_min_1);
    /**
     * Grabs the sourcecode for an example from the query hash or local storage
     * @param fallback if nothing is found return this
     * @param location DI'd copy of document.location
     */
    exports.getInitialCode = (fallback, location) => {
        // Old school support
        if (location.hash.startsWith('#src')) {
            const code = location.hash.replace('#src=', '').trim();
            return decodeURIComponent(code);
        }
        // New school support
        if (location.hash.startsWith('#code')) {
            const code = location.hash.replace('#code/', '').trim();
            let userCode = lzstring_min_1.default.decompressFromEncodedURIComponent(code);
            // Fallback incase there is an extra level of decoding:
            // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
            if (!userCode)
                userCode = lzstring_min_1.default.decompressFromEncodedURIComponent(decodeURIComponent(code));
            return userCode;
        }
        // Local copy fallback
        if (localStorage.getItem('sandbox-history')) {
            return localStorage.getItem('sandbox-history');
        }
        return fallback;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SW5pdGlhbENvZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zYW5kYm94L3NyYy9nZXRJbml0aWFsQ29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUVBOzs7O09BSUc7SUFDVSxRQUFBLGNBQWMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsUUFBa0IsRUFBRSxFQUFFO1FBQ3JFLHFCQUFxQjtRQUNyQixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUN0RCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2hDO1FBRUQscUJBQXFCO1FBQ3JCLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3ZELElBQUksUUFBUSxHQUFHLHNCQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDL0QsdURBQXVEO1lBQ3ZELHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsUUFBUTtnQkFBRSxRQUFRLEdBQUcsc0JBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQzlGLE9BQU8sUUFBUSxDQUFBO1NBQ2hCO1FBRUQsc0JBQXNCO1FBQ3RCLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBRSxDQUFBO1NBQ2hEO1FBRUQsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGx6c3RyaW5nIGZyb20gJy4vdmVuZG9yL2x6c3RyaW5nLm1pbidcblxuLyoqXG4gKiBHcmFicyB0aGUgc291cmNlY29kZSBmb3IgYW4gZXhhbXBsZSBmcm9tIHRoZSBxdWVyeSBoYXNoIG9yIGxvY2FsIHN0b3JhZ2VcbiAqIEBwYXJhbSBmYWxsYmFjayBpZiBub3RoaW5nIGlzIGZvdW5kIHJldHVybiB0aGlzXG4gKiBAcGFyYW0gbG9jYXRpb24gREknZCBjb3B5IG9mIGRvY3VtZW50LmxvY2F0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRJbml0aWFsQ29kZSA9IChmYWxsYmFjazogc3RyaW5nLCBsb2NhdGlvbjogTG9jYXRpb24pID0+IHtcbiAgLy8gT2xkIHNjaG9vbCBzdXBwb3J0XG4gIGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoJyNzcmMnKSkge1xuICAgIGNvbnN0IGNvZGUgPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyNzcmM9JywgJycpLnRyaW0oKVxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoY29kZSlcbiAgfVxuXG4gIC8vIE5ldyBzY2hvb2wgc3VwcG9ydFxuICBpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKCcjY29kZScpKSB7XG4gICAgY29uc3QgY29kZSA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnI2NvZGUvJywgJycpLnRyaW0oKVxuICAgIGxldCB1c2VyQ29kZSA9IGx6c3RyaW5nLmRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudChjb2RlKVxuICAgIC8vIEZhbGxiYWNrIGluY2FzZSB0aGVyZSBpcyBhbiBleHRyYSBsZXZlbCBvZiBkZWNvZGluZzpcbiAgICAvLyBodHRwczovL2dpdHRlci5pbS9NaWNyb3NvZnQvVHlwZVNjcmlwdD9hdD01ZGM0NzhhYjljMzk4MjE1MDlmZjE4OWFcbiAgICBpZiAoIXVzZXJDb2RlKSB1c2VyQ29kZSA9IGx6c3RyaW5nLmRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQoY29kZSkpXG4gICAgcmV0dXJuIHVzZXJDb2RlXG4gIH1cblxuICAvLyBMb2NhbCBjb3B5IGZhbGxiYWNrXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2FuZGJveC1oaXN0b3J5JykpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhbmRib3gtaGlzdG9yeScpIVxuICB9XG5cbiAgcmV0dXJuIGZhbGxiYWNrXG59XG4iXX0=