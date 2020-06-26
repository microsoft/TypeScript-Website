define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setEditorTheme = void 0;
    exports.setEditorTheme = (theme, editor) => {
        const newTheme = theme ? theme : localStorage ? localStorage.getItem('editor-theme') || 'light' : 'light';
        editor.setTheme(newTheme);
        document
            .querySelectorAll('a[id^=theme-]')
            .forEach(anchor => anchor.id === `theme-${newTheme}`
            ? anchor.classList.add('current-theme')
            : anchor.classList.remove('current-theme'));
        localStorage.setItem('editor-theme', newTheme);
        // Sets the theme on the body so CSS can change between themes
        document.body.classList.remove('light', 'dark', 'hc');
        // So dark and dark-hc can share CSS
        if (newTheme === 'dark-hc') {
            document.body.classList.add('dark');
            document.body.classList.add('hc');
        }
        else {
            document.body.classList.add(newTheme);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy90aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQWEsUUFBQSxjQUFjLEdBQUcsQ0FBQyxLQUE4QixFQUFFLE1BQTZDLEVBQUUsRUFBRTtRQUM5RyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRXpHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFekIsUUFBUTthQUNMLGdCQUFnQixDQUFDLGVBQWUsQ0FBQzthQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDaEIsTUFBTSxDQUFDLEVBQUUsS0FBSyxTQUFTLFFBQVEsRUFBRTtZQUMvQixDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FDN0MsQ0FBQTtRQUVILFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBRTlDLDhEQUE4RDtRQUM5RCxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUVyRCxvQ0FBb0M7UUFDcEMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDbEM7YUFBTTtZQUNMLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN0QztJQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzZXRFZGl0b3JUaGVtZSA9ICh0aGVtZTogJ2xpZ2h0JyB8ICdkYXJrJyB8ICdoYycsIGVkaXRvcjogdHlwZW9mIGltcG9ydCgnbW9uYWNvLWVkaXRvcicpLmVkaXRvcikgPT4ge1xuICBjb25zdCBuZXdUaGVtZSA9IHRoZW1lID8gdGhlbWUgOiBsb2NhbFN0b3JhZ2UgPyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWRpdG9yLXRoZW1lJykgfHwgJ2xpZ2h0JyA6ICdsaWdodCdcblxuICBlZGl0b3Iuc2V0VGhlbWUobmV3VGhlbWUpXG5cbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbCgnYVtpZF49dGhlbWUtXScpXG4gICAgLmZvckVhY2goYW5jaG9yID0+XG4gICAgICBhbmNob3IuaWQgPT09IGB0aGVtZS0ke25ld1RoZW1lfWBcbiAgICAgICAgPyBhbmNob3IuY2xhc3NMaXN0LmFkZCgnY3VycmVudC10aGVtZScpXG4gICAgICAgIDogYW5jaG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQtdGhlbWUnKVxuICAgIClcblxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZWRpdG9yLXRoZW1lJywgbmV3VGhlbWUpXG5cbiAgLy8gU2V0cyB0aGUgdGhlbWUgb24gdGhlIGJvZHkgc28gQ1NTIGNhbiBjaGFuZ2UgYmV0d2VlbiB0aGVtZXNcbiAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodCcsICdkYXJrJywgJ2hjJylcblxuICAvLyBTbyBkYXJrIGFuZCBkYXJrLWhjIGNhbiBzaGFyZSBDU1NcbiAgaWYgKG5ld1RoZW1lID09PSAnZGFyay1oYycpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaGMnKVxuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChuZXdUaGVtZSlcbiAgfVxufVxuIl19