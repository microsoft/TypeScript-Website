define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localize = void 0;
    /** contains the ts-ignore, and the global window manipulation  */
    exports.localize = (key, fallback) => 
    // @ts-ignore
    'i' in window ? window.i(key) : fallback;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVXaXRoRmFsbGJhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9sb2NhbGl6ZVdpdGhGYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQUEsa0VBQWtFO0lBQ3JELFFBQUEsUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUN4RCxhQUFhO0lBQ2IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIGNvbnRhaW5zIHRoZSB0cy1pZ25vcmUsIGFuZCB0aGUgZ2xvYmFsIHdpbmRvdyBtYW5pcHVsYXRpb24gICovXG5leHBvcnQgY29uc3QgbG9jYWxpemUgPSAoa2V5OiBzdHJpbmcsIGZhbGxiYWNrOiBzdHJpbmcpID0+XG4gIC8vIEB0cy1pZ25vcmVcbiAgJ2knIGluIHdpbmRvdyA/IHdpbmRvdy5pKGtleSkgOiBmYWxsYmFja1xuIl19