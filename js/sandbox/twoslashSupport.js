define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsePrimitive = exports.extractTwoSlashComplierOptions = void 0;
    const booleanConfigRegexp = /^\/\/\s?@(\w+)$/;
    // https://regex101.com/r/8B2Wwh/1
    const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/;
    /**
     * This is a port of the twoslash bit which grabs compiler options
     * from the source code
     */
    exports.extractTwoSlashComplierOptions = (ts) => (code) => {
        const codeLines = code.split('\n');
        const options = {};
        codeLines.forEach((line) => {
            let match;
            if ((match = booleanConfigRegexp.exec(line))) {
                options[match[1]] = true;
                setOption(match[1], 'true', options, ts);
            }
            else if ((match = valuedConfigRegexp.exec(line))) {
                setOption(match[1], match[2], options, ts);
            }
        });
        return options;
    };
    function setOption(name, value, opts, ts) {
        // @ts-ignore - optionDeclarations is not public API
        for (const opt of ts.optionDeclarations) {
            if (opt.name.toLowerCase() === name.toLowerCase()) {
                switch (opt.type) {
                    case 'number':
                    case 'string':
                    case 'boolean':
                        opts[opt.name] = parsePrimitive(value, opt.type);
                        break;
                    case 'list':
                        opts[opt.name] = value.split(',').map((v) => parsePrimitive(v, opt.element.type));
                        break;
                    default:
                        opts[opt.name] = opt.type.get(value.toLowerCase());
                        if (opts[opt.name] === undefined) {
                            const keys = Array.from(opt.type.keys());
                            throw new Error(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(',')}`);
                        }
                        break;
                }
                return;
            }
        }
        // Skip the note of errors
        if (name !== 'errors') {
            throw new Error(`No compiler setting named '${name}' exists!`);
        }
    }
    function parsePrimitive(value, type) {
        switch (type) {
            case 'number':
                return +value;
            case 'string':
                return value;
            case 'boolean':
                return value.toLowerCase() === 'true' || value.length === 0;
        }
        console.log(`Unknown primitive type ${type} with - ${value}`);
    }
    exports.parsePrimitive = parsePrimitive;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdvc2xhc2hTdXBwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvdHdvc2xhc2hTdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQSxNQUFNLG1CQUFtQixHQUFHLGlCQUFpQixDQUFBO0lBRTdDLGtDQUFrQztJQUNsQyxNQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUFBO0lBTXBEOzs7T0FHRztJQUVVLFFBQUEsOEJBQThCLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDekUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsQyxNQUFNLE9BQU8sR0FBRyxFQUFTLENBQUE7UUFFekIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3pCLElBQUksS0FBSyxDQUFBO1lBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDNUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTtnQkFDeEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2FBQ3pDO2lCQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTthQUMzQztRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQyxDQUFBO0lBRUQsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxJQUFxQixFQUFFLEVBQU07UUFDM0Usb0RBQW9EO1FBQ3BELEtBQUssTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ2pELFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDaEIsS0FBSyxRQUFRLENBQUM7b0JBQ2QsS0FBSyxRQUFRLENBQUM7b0JBQ2QsS0FBSyxTQUFTO3dCQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBQ2hELE1BQUs7b0JBRVAsS0FBSyxNQUFNO3dCQUNULElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQVEsQ0FBQyxJQUFjLENBQUMsQ0FBQyxDQUFBO3dCQUM1RixNQUFLO29CQUVQO3dCQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7d0JBRWxELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7NEJBQ2hDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQVMsQ0FBQyxDQUFBOzRCQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixLQUFLLFFBQVEsR0FBRyxDQUFDLElBQUkscUJBQXFCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO3lCQUM3Rjt3QkFDRCxNQUFLO2lCQUNSO2dCQUNELE9BQU07YUFDUDtTQUNGO1FBRUQsMEJBQTBCO1FBQzFCLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixJQUFJLFdBQVcsQ0FBQyxDQUFBO1NBQy9EO0lBQ0gsQ0FBQztJQUVELFNBQWdCLGNBQWMsQ0FBQyxLQUFhLEVBQUUsSUFBWTtRQUN4RCxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsS0FBSyxDQUFBO1lBQ2YsS0FBSyxRQUFRO2dCQUNYLE9BQU8sS0FBSyxDQUFBO1lBQ2QsS0FBSyxTQUFTO2dCQUNaLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtTQUM5RDtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLElBQUksV0FBVyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFWRCx3Q0FVQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGJvb2xlYW5Db25maWdSZWdleHAgPSAvXlxcL1xcL1xccz9AKFxcdyspJC9cblxuLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci84QjJXd2gvMVxuY29uc3QgdmFsdWVkQ29uZmlnUmVnZXhwID0gL15cXC9cXC9cXHM/QChcXHcrKTpcXHM/KC4rKSQvXG5cbnR5cGUgU2FuZGJveCA9IFJldHVyblR5cGU8dHlwZW9mIGltcG9ydCgnLicpLmNyZWF0ZVR5cGVTY3JpcHRTYW5kYm94PlxudHlwZSBUUyA9IHR5cGVvZiBpbXBvcnQoJ3R5cGVzY3JpcHQnKVxudHlwZSBDb21waWxlck9wdGlvbnMgPSBpbXBvcnQoJ3R5cGVzY3JpcHQnKS5Db21waWxlck9wdGlvbnNcblxuLyoqXG4gKiBUaGlzIGlzIGEgcG9ydCBvZiB0aGUgdHdvc2xhc2ggYml0IHdoaWNoIGdyYWJzIGNvbXBpbGVyIG9wdGlvbnNcbiAqIGZyb20gdGhlIHNvdXJjZSBjb2RlXG4gKi9cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RUd29TbGFzaENvbXBsaWVyT3B0aW9ucyA9ICh0czogVFMpID0+IChjb2RlOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgY29kZUxpbmVzID0gY29kZS5zcGxpdCgnXFxuJylcbiAgY29uc3Qgb3B0aW9ucyA9IHt9IGFzIGFueVxuXG4gIGNvZGVMaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgbGV0IG1hdGNoXG4gICAgaWYgKChtYXRjaCA9IGJvb2xlYW5Db25maWdSZWdleHAuZXhlYyhsaW5lKSkpIHtcbiAgICAgIG9wdGlvbnNbbWF0Y2hbMV1dID0gdHJ1ZVxuICAgICAgc2V0T3B0aW9uKG1hdGNoWzFdLCAndHJ1ZScsIG9wdGlvbnMsIHRzKVxuICAgIH0gZWxzZSBpZiAoKG1hdGNoID0gdmFsdWVkQ29uZmlnUmVnZXhwLmV4ZWMobGluZSkpKSB7XG4gICAgICBzZXRPcHRpb24obWF0Y2hbMV0sIG1hdGNoWzJdLCBvcHRpb25zLCB0cylcbiAgICB9XG4gIH0pXG4gIHJldHVybiBvcHRpb25zXG59XG5cbmZ1bmN0aW9uIHNldE9wdGlvbihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG9wdHM6IENvbXBpbGVyT3B0aW9ucywgdHM6IFRTKSB7XG4gIC8vIEB0cy1pZ25vcmUgLSBvcHRpb25EZWNsYXJhdGlvbnMgaXMgbm90IHB1YmxpYyBBUElcbiAgZm9yIChjb25zdCBvcHQgb2YgdHMub3B0aW9uRGVjbGFyYXRpb25zKSB7XG4gICAgaWYgKG9wdC5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgc3dpdGNoIChvcHQudHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICBvcHRzW29wdC5uYW1lXSA9IHBhcnNlUHJpbWl0aXZlKHZhbHVlLCBvcHQudHlwZSlcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIG9wdHNbb3B0Lm5hbWVdID0gdmFsdWUuc3BsaXQoJywnKS5tYXAoKHYpID0+IHBhcnNlUHJpbWl0aXZlKHYsIG9wdC5lbGVtZW50IS50eXBlIGFzIHN0cmluZykpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG9wdHNbb3B0Lm5hbWVdID0gb3B0LnR5cGUuZ2V0KHZhbHVlLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICBpZiAob3B0c1tvcHQubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IEFycmF5LmZyb20ob3B0LnR5cGUua2V5cygpIGFzIGFueSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSAke3ZhbHVlfSBmb3IgJHtvcHQubmFtZX0uIEFsbG93ZWQgdmFsdWVzOiAke2tleXMuam9pbignLCcpfWApXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cblxuICAvLyBTa2lwIHRoZSBub3RlIG9mIGVycm9yc1xuICBpZiAobmFtZSAhPT0gJ2Vycm9ycycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNvbXBpbGVyIHNldHRpbmcgbmFtZWQgJyR7bmFtZX0nIGV4aXN0cyFgKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByaW1pdGl2ZSh2YWx1ZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpOiBhbnkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuICt2YWx1ZVxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScgfHwgdmFsdWUubGVuZ3RoID09PSAwXG4gIH1cbiAgY29uc29sZS5sb2coYFVua25vd24gcHJpbWl0aXZlIHR5cGUgJHt0eXBlfSB3aXRoIC0gJHt2YWx1ZX1gKVxufVxuIl19