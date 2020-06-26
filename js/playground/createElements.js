define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.activatePlugin = exports.createTabForPlugin = exports.createPluginContainer = exports.createTabBar = exports.setupSidebarToggle = exports.createSidebar = exports.sidebarHidden = exports.createDragBar = void 0;
    exports.createDragBar = () => {
        const sidebar = document.createElement("div");
        sidebar.className = "playground-dragbar";
        let left, right;
        const drag = (e) => {
            if (left && right) {
                // Get how far right the mouse is from the right
                const rightX = right.getBoundingClientRect().right;
                const offset = rightX - e.pageX;
                const screenClampLeft = window.innerWidth - 320;
                const clampedOffset = Math.min(Math.max(offset, 280), screenClampLeft);
                // Set the widths
                left.style.width = `calc(100% - ${clampedOffset}px)`;
                right.style.width = `${clampedOffset}px`;
                right.style.flexBasis = `${clampedOffset}px`;
                right.style.maxWidth = `${clampedOffset}px`;
                // Save the x coordinate of the
                if (window.localStorage) {
                    window.localStorage.setItem("dragbar-x", "" + clampedOffset);
                    window.localStorage.setItem("dragbar-window-width", "" + window.innerWidth);
                }
                // @ts-ignore - I know what I'm doing
                window.sandbox.editor.layout();
                // Don't allow selection
                e.stopPropagation();
                e.cancelBubble = true;
            }
        };
        sidebar.addEventListener("mousedown", e => {
            var _a;
            left = document.getElementById("editor-container");
            right = (_a = sidebar.parentElement) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("playground-sidebar").item(0);
            // Handle dragging all over the screen
            document.addEventListener("mousemove", drag);
            // Remove it when you lt go anywhere
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", drag);
                document.body.style.userSelect = "auto";
            });
            // Don't allow the drag to select text accidentally
            document.body.style.userSelect = "none";
            e.stopPropagation();
            e.cancelBubble = true;
        });
        return sidebar;
    };
    exports.sidebarHidden = () => !!window.localStorage.getItem("sidebar-hidden");
    exports.createSidebar = () => {
        const sidebar = document.createElement("div");
        sidebar.className = "playground-sidebar";
        // Start with the sidebar hidden on small screens
        const isTinyScreen = window.innerWidth < 800;
        // This is independent of the sizing below so that you keep the same sized sidebar
        if (isTinyScreen || exports.sidebarHidden()) {
            sidebar.style.display = "none";
        }
        if (window.localStorage && window.localStorage.getItem("dragbar-x")) {
            // Don't restore the x pos if the window isn't the same size
            if (window.innerWidth === Number(window.localStorage.getItem("dragbar-window-width"))) {
                // Set the dragger to the previous x pos
                let width = window.localStorage.getItem("dragbar-x");
                if (isTinyScreen) {
                    width = String(Math.min(Number(width), 280));
                }
                sidebar.style.width = `${width}px`;
                sidebar.style.flexBasis = `${width}px`;
                sidebar.style.maxWidth = `${width}px`;
                const left = document.getElementById("editor-container");
                left.style.width = `calc(100% - ${width}px)`;
            }
        }
        return sidebar;
    };
    const toggleIconWhenOpen = "&#x21E5;";
    const toggleIconWhenClosed = "&#x21E4;";
    exports.setupSidebarToggle = () => {
        const toggle = document.getElementById("sidebar-toggle");
        const updateToggle = () => {
            const sidebar = window.document.querySelector(".playground-sidebar");
            const sidebarShowing = sidebar.style.display !== "none";
            toggle.innerHTML = sidebarShowing ? toggleIconWhenOpen : toggleIconWhenClosed;
            toggle.setAttribute("aria-label", sidebarShowing ? "Hide Sidebar" : "Show Sidebar");
        };
        toggle.onclick = () => {
            const sidebar = window.document.querySelector(".playground-sidebar");
            const newState = sidebar.style.display !== "none";
            if (newState) {
                localStorage.setItem("sidebar-hidden", "true");
                sidebar.style.display = "none";
            }
            else {
                localStorage.removeItem("sidebar-hidden");
                sidebar.style.display = "block";
            }
            updateToggle();
            // @ts-ignore - I know what I'm doing
            window.sandbox.editor.layout();
            return false;
        };
        // Ensure its set up at the start
        updateToggle();
    };
    exports.createTabBar = () => {
        const tabBar = document.createElement("div");
        tabBar.classList.add("playground-plugin-tabview");
        tabBar.id = "playground-plugin-tabbar";
        tabBar.setAttribute("aria-label", "Tabs for plugins");
        /** Support left/right in the tab bar for accessibility */
        let tabFocus = 0;
        tabBar.addEventListener("keydown", e => {
            const tabs = document.querySelectorAll('.playground-plugin-tabview [role="tab"]');
            // Move right
            if (e.keyCode === 39 || e.keyCode === 37) {
                tabs[tabFocus].setAttribute("tabindex", "-1");
                if (e.keyCode === 39) {
                    tabFocus++;
                    // If we're at the end, go to the start
                    if (tabFocus >= tabs.length) {
                        tabFocus = 0;
                    }
                    // Move left
                }
                else if (e.keyCode === 37) {
                    tabFocus--;
                    // If we're at the start, move to the end
                    if (tabFocus < 0) {
                        tabFocus = tabs.length - 1;
                    }
                }
                tabs[tabFocus].setAttribute("tabindex", "0");
                tabs[tabFocus].focus();
            }
        });
        return tabBar;
    };
    exports.createPluginContainer = () => {
        const container = document.createElement("div");
        container.setAttribute("role", "tabpanel");
        container.classList.add("playground-plugin-container");
        return container;
    };
    exports.createTabForPlugin = (plugin) => {
        const element = document.createElement("button");
        element.setAttribute("role", "tab");
        element.textContent = plugin.displayName;
        return element;
    };
    exports.activatePlugin = (plugin, previousPlugin, sandbox, tabBar, container) => {
        let newPluginTab, oldPluginTab;
        // @ts-ignore - This works at runtime
        for (const tab of tabBar.children) {
            if (tab.textContent === plugin.displayName)
                newPluginTab = tab;
            if (previousPlugin && tab.textContent === previousPlugin.displayName)
                oldPluginTab = tab;
        }
        // @ts-ignore
        if (!newPluginTab)
            throw new Error("Could not get a tab for the plugin: " + plugin.displayName);
        // Tell the old plugin it's getting the boot
        // @ts-ignore
        if (previousPlugin && oldPluginTab) {
            if (previousPlugin.willUnmount)
                previousPlugin.willUnmount(sandbox, container);
            oldPluginTab.classList.remove("active");
            oldPluginTab.setAttribute("aria-selected", "false");
            oldPluginTab.setAttribute("tabindex", "-1");
        }
        // Wipe the sidebar
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Start booting up the new plugin
        newPluginTab.classList.add("active");
        newPluginTab.setAttribute("aria-selected", "true");
        newPluginTab.setAttribute("tabindex", "0");
        // Tell the new plugin to start doing some work
        if (plugin.willMount)
            plugin.willMount(sandbox, container);
        if (plugin.modelChanged)
            plugin.modelChanged(sandbox, sandbox.getModel(), container);
        if (plugin.modelChangedDebounce)
            plugin.modelChangedDebounce(sandbox, sandbox.getModel(), container);
        if (plugin.didMount)
            plugin.didMount(sandbox, container);
        // Let the previous plugin do any slow work after it's all done
        if (previousPlugin && previousPlugin.didUnmount)
            previousPlugin.didUnmount(sandbox, container);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9jcmVhdGVFbGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBSWEsUUFBQSxhQUFhLEdBQUcsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0MsT0FBTyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQTtRQUV4QyxJQUFJLElBQWlCLEVBQUUsS0FBa0IsQ0FBQTtRQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQzdCLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDakIsZ0RBQWdEO2dCQUNoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUE7Z0JBQ2xELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO2dCQUMvQixNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTtnQkFDL0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQTtnQkFFdEUsaUJBQWlCO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxlQUFlLGFBQWEsS0FBSyxDQUFBO2dCQUNwRCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLGFBQWEsSUFBSSxDQUFBO2dCQUN4QyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLGFBQWEsSUFBSSxDQUFBO2dCQUM1QyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLGFBQWEsSUFBSSxDQUFBO2dCQUUzQywr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QUFDLENBQUE7U0FDNUM7UUFFRCxtQkFBbUI7UUFDbkIsT0FBTyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQzNCLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQzVDO1FBRUQsa0NBQWtDO1FBQ2xDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3BDLFlBQVksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELFlBQVksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBRTFDLCtDQUErQztRQUMvQyxJQUFJLE1BQU0sQ0FBQyxTQUFTO1lBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDMUQsSUFBSSxNQUFNLENBQUMsWUFBWTtZQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUNwRixJQUFJLE1BQU0sQ0FBQyxvQkFBb0I7WUFBRSxNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUNwRyxJQUFJLE1BQU0sQ0FBQyxRQUFRO1lBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFFeEQsK0RBQStEO1FBQy9ELElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxVQUFVO1lBQUUsY0FBYyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDaEcsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiB9IGZyb20gXCIuXCJcblxudHlwZSBTYW5kYm94ID0gaW1wb3J0KFwidHlwZXNjcmlwdC1zYW5kYm94XCIpLlNhbmRib3hcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZURyYWdCYXIgPSAoKSA9PiB7XG4gIGNvbnN0IHNpZGViYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gIHNpZGViYXIuY2xhc3NOYW1lID0gXCJwbGF5Z3JvdW5kLWRyYWdiYXJcIlxuXG4gIGxldCBsZWZ0OiBIVE1MRWxlbWVudCwgcmlnaHQ6IEhUTUxFbGVtZW50XG4gIGNvbnN0IGRyYWcgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChsZWZ0ICYmIHJpZ2h0KSB7XG4gICAgICAvLyBHZXQgaG93IGZhciByaWdodCB0aGUgbW91c2UgaXMgZnJvbSB0aGUgcmlnaHRcbiAgICAgIGNvbnN0IHJpZ2h0WCA9IHJpZ2h0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0XG4gICAgICBjb25zdCBvZmZzZXQgPSByaWdodFggLSBlLnBhZ2VYXG4gICAgICBjb25zdCBzY3JlZW5DbGFtcExlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDMyMFxuICAgICAgY29uc3QgY2xhbXBlZE9mZnNldCA9IE1hdGgubWluKE1hdGgubWF4KG9mZnNldCwgMjgwKSwgc2NyZWVuQ2xhbXBMZWZ0KVxuXG4gICAgICAvLyBTZXQgdGhlIHdpZHRoc1xuICAgICAgbGVmdC5zdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgLSAke2NsYW1wZWRPZmZzZXR9cHgpYFxuICAgICAgcmlnaHQuc3R5bGUud2lkdGggPSBgJHtjbGFtcGVkT2Zmc2V0fXB4YFxuICAgICAgcmlnaHQuc3R5bGUuZmxleEJhc2lzID0gYCR7Y2xhbXBlZE9mZnNldH1weGBcbiAgICAgIHJpZ2h0LnN0eWxlLm1heFdpZHRoID0gYCR7Y2xhbXBlZE9mZnNldH1weGBcblxuICAgICAgLy8gU2F2ZSB0aGUgeCBjb29yZGluYXRlIG9mIHRoZVxuICAgICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJhZ2Jhci14XCIsIFwiXCIgKyBjbGFtcGVkT2Zmc2V0KVxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmFnYmFyLXdpbmRvdy13aWR0aFwiLCBcIlwiICsgd2luZG93LmlubmVyV2lkdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIEB0cy1pZ25vcmUgLSBJIGtub3cgd2hhdCBJJ20gZG9pbmdcbiAgICAgIHdpbmRvdy5zYW5kYm94LmVkaXRvci5sYXlvdXQoKVxuXG4gICAgICAvLyBEb24ndCBhbGxvdyBzZWxlY3Rpb25cbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHNpZGViYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICBsZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3ItY29udGFpbmVyXCIpIVxuICAgIHJpZ2h0ID0gc2lkZWJhci5wYXJlbnRFbGVtZW50Py5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWdyb3VuZC1zaWRlYmFyXCIpLml0ZW0oMCkhIGFzIGFueVxuICAgIC8vIEhhbmRsZSBkcmFnZ2luZyBhbGwgb3ZlciB0aGUgc2NyZWVuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnKVxuICAgIC8vIFJlbW92ZSBpdCB3aGVuIHlvdSBsdCBnbyBhbnl3aGVyZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZylcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwiYXV0b1wiXG4gICAgfSlcblxuICAgIC8vIERvbid0IGFsbG93IHRoZSBkcmFnIHRvIHNlbGVjdCB0ZXh0IGFjY2lkZW50YWxseVxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICB9KVxuXG4gIHJldHVybiBzaWRlYmFyXG59XG5cbmV4cG9ydCBjb25zdCBzaWRlYmFySGlkZGVuID0gKCkgPT4gISF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaWRlYmFyLWhpZGRlblwiKVxuXG5leHBvcnQgY29uc3QgY3JlYXRlU2lkZWJhciA9ICgpID0+IHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgc2lkZWJhci5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtc2lkZWJhclwiXG5cbiAgLy8gU3RhcnQgd2l0aCB0aGUgc2lkZWJhciBoaWRkZW4gb24gc21hbGwgc2NyZWVuc1xuICBjb25zdCBpc1RpbnlTY3JlZW4gPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMFxuXG4gIC8vIFRoaXMgaXMgaW5kZXBlbmRlbnQgb2YgdGhlIHNpemluZyBiZWxvdyBzbyB0aGF0IHlvdSBrZWVwIHRoZSBzYW1lIHNpemVkIHNpZGViYXJcbiAgaWYgKGlzVGlueVNjcmVlbiB8fCBzaWRlYmFySGlkZGVuKCkpIHtcbiAgICBzaWRlYmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICB9XG5cbiAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UgJiYgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJhZ2Jhci14XCIpKSB7XG4gICAgLy8gRG9uJ3QgcmVzdG9yZSB0aGUgeCBwb3MgaWYgdGhlIHdpbmRvdyBpc24ndCB0aGUgc2FtZSBzaXplXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID09PSBOdW1iZXIod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJhZ2Jhci13aW5kb3ctd2lkdGhcIikpKSB7XG4gICAgICAvLyBTZXQgdGhlIGRyYWdnZXIgdG8gdGhlIHByZXZpb3VzIHggcG9zXG4gICAgICBsZXQgd2lkdGggPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmFnYmFyLXhcIilcblxuICAgICAgaWYgKGlzVGlueVNjcmVlbikge1xuICAgICAgICB3aWR0aCA9IFN0cmluZyhNYXRoLm1pbihOdW1iZXIod2lkdGgpLCAyODApKVxuICAgICAgfVxuXG4gICAgICBzaWRlYmFyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgXG4gICAgICBzaWRlYmFyLnN0eWxlLmZsZXhCYXNpcyA9IGAke3dpZHRofXB4YFxuICAgICAgc2lkZWJhci5zdHlsZS5tYXhXaWR0aCA9IGAke3dpZHRofXB4YFxuXG4gICAgICBjb25zdCBsZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3ItY29udGFpbmVyXCIpIVxuICAgICAgbGVmdC5zdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgLSAke3dpZHRofXB4KWBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2lkZWJhclxufVxuXG5jb25zdCB0b2dnbGVJY29uV2hlbk9wZW4gPSBcIiYjeDIxRTU7XCJcbmNvbnN0IHRvZ2dsZUljb25XaGVuQ2xvc2VkID0gXCImI3gyMUU0O1wiXG5cbmV4cG9ydCBjb25zdCBzZXR1cFNpZGViYXJUb2dnbGUgPSAoKSA9PiB7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10b2dnbGVcIikhXG5cbiAgY29uc3QgdXBkYXRlVG9nZ2xlID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXJcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBjb25zdCBzaWRlYmFyU2hvd2luZyA9IHNpZGViYXIuc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCJcblxuICAgIHRvZ2dsZS5pbm5lckhUTUwgPSBzaWRlYmFyU2hvd2luZyA/IHRvZ2dsZUljb25XaGVuT3BlbiA6IHRvZ2dsZUljb25XaGVuQ2xvc2VkXG4gICAgdG9nZ2xlLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgc2lkZWJhclNob3dpbmcgPyBcIkhpZGUgU2lkZWJhclwiIDogXCJTaG93IFNpZGViYXJcIilcbiAgfVxuXG4gIHRvZ2dsZS5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXJcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHNpZGViYXIuc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCJcblxuICAgIGlmIChuZXdTdGF0ZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaWRlYmFyLWhpZGRlblwiLCBcInRydWVcIilcbiAgICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwic2lkZWJhci1oaWRkZW5cIilcbiAgICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgIH1cblxuICAgIHVwZGF0ZVRvZ2dsZSgpXG5cbiAgICAvLyBAdHMtaWdub3JlIC0gSSBrbm93IHdoYXQgSSdtIGRvaW5nXG4gICAgd2luZG93LnNhbmRib3guZWRpdG9yLmxheW91dCgpXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEVuc3VyZSBpdHMgc2V0IHVwIGF0IHRoZSBzdGFydFxuICB1cGRhdGVUb2dnbGUoKVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlVGFiQmFyID0gKCkgPT4ge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gIHRhYkJhci5jbGFzc0xpc3QuYWRkKFwicGxheWdyb3VuZC1wbHVnaW4tdGFidmlld1wiKVxuICB0YWJCYXIuaWQgPSBcInBsYXlncm91bmQtcGx1Z2luLXRhYmJhclwiXG4gIHRhYkJhci5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVGFicyBmb3IgcGx1Z2luc1wiKVxuXG4gIC8qKiBTdXBwb3J0IGxlZnQvcmlnaHQgaW4gdGhlIHRhYiBiYXIgZm9yIGFjY2Vzc2liaWxpdHkgKi9cbiAgbGV0IHRhYkZvY3VzID0gMDtcbiAgdGFiQmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgIGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWdyb3VuZC1wbHVnaW4tdGFidmlldyBbcm9sZT1cInRhYlwiXScpXG4gICAgLy8gTW92ZSByaWdodFxuICAgIGlmIChlLmtleUNvZGUgPT09IDM5IHx8IGUua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHRhYnNbdGFiRm9jdXNdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAzOSkge1xuICAgICAgICB0YWJGb2N1cysrO1xuICAgICAgICAvLyBJZiB3ZSdyZSBhdCB0aGUgZW5kLCBnbyB0byB0aGUgc3RhcnRcbiAgICAgICAgaWYgKHRhYkZvY3VzID49IHRhYnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGFiRm9jdXMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1vdmUgbGVmdFxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XG4gICAgICAgIHRhYkZvY3VzLS07XG4gICAgICAgIC8vIElmIHdlJ3JlIGF0IHRoZSBzdGFydCwgbW92ZSB0byB0aGUgZW5kXG4gICAgICAgIGlmICh0YWJGb2N1cyA8IDApIHtcbiAgICAgICAgICB0YWJGb2N1cyA9IHRhYnMubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0YWJzW3RhYkZvY3VzXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAodGFic1t0YWJGb2N1c10gYXMgYW55KS5mb2N1cygpO1xuICAgIH1cbiAgfSlcblxuICByZXR1cm4gdGFiQmFyXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQbHVnaW5Db250YWluZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJwYW5lbFwiKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYXlncm91bmQtcGx1Z2luLWNvbnRhaW5lclwiKVxuICByZXR1cm4gY29udGFpbmVyXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUYWJGb3JQbHVnaW4gPSAocGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKVxuICBlbGVtZW50LnRleHRDb250ZW50ID0gcGx1Z2luLmRpc3BsYXlOYW1lXG4gIHJldHVybiBlbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZVBsdWdpbiA9IChcbiAgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luLFxuICBwcmV2aW91c1BsdWdpbjogUGxheWdyb3VuZFBsdWdpbiB8IHVuZGVmaW5lZCxcbiAgc2FuZGJveDogU2FuZGJveCxcbiAgdGFiQmFyOiBIVE1MRGl2RWxlbWVudCxcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuKSA9PiB7XG4gIGxldCBuZXdQbHVnaW5UYWI6IEVsZW1lbnQsIG9sZFBsdWdpblRhYjogRWxlbWVudFxuICAvLyBAdHMtaWdub3JlIC0gVGhpcyB3b3JrcyBhdCBydW50aW1lXG4gIGZvciAoY29uc3QgdGFiIG9mIHRhYkJhci5jaGlsZHJlbikge1xuICAgIGlmICh0YWIudGV4dENvbnRlbnQgPT09IHBsdWdpbi5kaXNwbGF5TmFtZSkgbmV3UGx1Z2luVGFiID0gdGFiXG4gICAgaWYgKHByZXZpb3VzUGx1Z2luICYmIHRhYi50ZXh0Q29udGVudCA9PT0gcHJldmlvdXNQbHVnaW4uZGlzcGxheU5hbWUpIG9sZFBsdWdpblRhYiA9IHRhYlxuICB9XG5cbiAgLy8gQHRzLWlnbm9yZVxuICBpZiAoIW5ld1BsdWdpblRhYikgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGdldCBhIHRhYiBmb3IgdGhlIHBsdWdpbjogXCIgKyBwbHVnaW4uZGlzcGxheU5hbWUpXG5cbiAgLy8gVGVsbCB0aGUgb2xkIHBsdWdpbiBpdCdzIGdldHRpbmcgdGhlIGJvb3RcbiAgLy8gQHRzLWlnbm9yZVxuICBpZiAocHJldmlvdXNQbHVnaW4gJiYgb2xkUGx1Z2luVGFiKSB7XG4gICAgaWYgKHByZXZpb3VzUGx1Z2luLndpbGxVbm1vdW50KSBwcmV2aW91c1BsdWdpbi53aWxsVW5tb3VudChzYW5kYm94LCBjb250YWluZXIpXG4gICAgb2xkUGx1Z2luVGFiLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIilcbiAgICBvbGRQbHVnaW5UYWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBcImZhbHNlXCIpXG4gICAgb2xkUGx1Z2luVGFiLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIilcbiAgfVxuXG4gIC8vIFdpcGUgdGhlIHNpZGViYXJcbiAgd2hpbGUgKGNvbnRhaW5lci5maXJzdENoaWxkKSB7XG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5maXJzdENoaWxkKVxuICB9XG5cbiAgLy8gU3RhcnQgYm9vdGluZyB1cCB0aGUgbmV3IHBsdWdpblxuICBuZXdQbHVnaW5UYWIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKVxuICBuZXdQbHVnaW5UYWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBcInRydWVcIilcbiAgbmV3UGx1Z2luVGFiLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKVxuXG4gIC8vIFRlbGwgdGhlIG5ldyBwbHVnaW4gdG8gc3RhcnQgZG9pbmcgc29tZSB3b3JrXG4gIGlmIChwbHVnaW4ud2lsbE1vdW50KSBwbHVnaW4ud2lsbE1vdW50KHNhbmRib3gsIGNvbnRhaW5lcilcbiAgaWYgKHBsdWdpbi5tb2RlbENoYW5nZWQpIHBsdWdpbi5tb2RlbENoYW5nZWQoc2FuZGJveCwgc2FuZGJveC5nZXRNb2RlbCgpLCBjb250YWluZXIpXG4gIGlmIChwbHVnaW4ubW9kZWxDaGFuZ2VkRGVib3VuY2UpIHBsdWdpbi5tb2RlbENoYW5nZWREZWJvdW5jZShzYW5kYm94LCBzYW5kYm94LmdldE1vZGVsKCksIGNvbnRhaW5lcilcbiAgaWYgKHBsdWdpbi5kaWRNb3VudCkgcGx1Z2luLmRpZE1vdW50KHNhbmRib3gsIGNvbnRhaW5lcilcblxuICAvLyBMZXQgdGhlIHByZXZpb3VzIHBsdWdpbiBkbyBhbnkgc2xvdyB3b3JrIGFmdGVyIGl0J3MgYWxsIGRvbmVcbiAgaWYgKHByZXZpb3VzUGx1Z2luICYmIHByZXZpb3VzUGx1Z2luLmRpZFVubW91bnQpIHByZXZpb3VzUGx1Z2luLmRpZFVubW91bnQoc2FuZGJveCwgY29udGFpbmVyKVxufVxuIl19