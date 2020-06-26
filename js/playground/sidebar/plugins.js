define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.optionsPlugin = exports.addCustomPlugin = exports.activePlugins = exports.allowConnectingToLocalhost = void 0;
    const pluginRegistry = [
        {
            module: "typescript-playground-presentation-mode",
            display: "Presentation Mode",
            blurb: "Create presentations inside the TypeScript playground, seamlessly jump between slides and live-code.",
            repo: "https://github.com/orta/playground-slides/#readme",
            author: {
                name: "Orta",
                href: "https://orta.io",
            },
        },
        {
            module: "playground-collaborate",
            display: "Collaborate",
            blurb: "Create rooms to inspect code together.",
            repo: "https://github.com/orta/playground-collaborate/#readme",
            author: {
                name: "Orta",
                href: "https://orta.io",
            },
        },
    ];
    /** Whether the playground should actively reach out to an existing plugin */
    exports.allowConnectingToLocalhost = () => {
        return !!localStorage.getItem("compiler-setting-connect-dev-plugin");
    };
    exports.activePlugins = () => {
        const existing = customPlugins().map(module => ({ module }));
        return existing.concat(pluginRegistry.filter(p => !!localStorage.getItem("plugin-" + p.module)));
    };
    const removeCustomPlugins = (mod) => {
        const newPlugins = customPlugins().filter(p => p !== mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
    };
    exports.addCustomPlugin = (mod) => {
        const newPlugins = customPlugins();
        newPlugins.push(mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
        // @ts-ignore
        window.appInsights &&
            // @ts-ignore
            window.appInsights.trackEvent({ name: "Added Custom Module", properties: { id: mod } });
    };
    const customPlugins = () => {
        return JSON.parse(localStorage.getItem("custom-plugins-playground") || "[]");
    };
    exports.optionsPlugin = (i, utils) => {
        const plugin = {
            id: "plugins",
            displayName: i("play_sidebar_plugins"),
            // shouldBeSelected: () => true, // uncomment to make this the first tab on reloads
            willMount: (_sandbox, container) => {
                const ds = utils.createDesignSystem(container);
                ds.subtitle(i("play_sidebar_plugins_options_external"));
                const pluginsOL = document.createElement("ol");
                pluginsOL.className = "playground-plugins";
                pluginRegistry.forEach(plugin => {
                    const settingButton = createPlugin(plugin);
                    pluginsOL.appendChild(settingButton);
                });
                container.appendChild(pluginsOL);
                const warning = document.createElement("p");
                warning.className = "warning";
                warning.textContent = i("play_sidebar_plugins_options_external_warning");
                container.appendChild(warning);
                ds.subtitle(i("play_sidebar_plugins_options_modules"));
                const customModulesOL = document.createElement("ol");
                customModulesOL.className = "custom-modules";
                const updateCustomModules = () => {
                    while (customModulesOL.firstChild) {
                        customModulesOL.removeChild(customModulesOL.firstChild);
                    }
                    customPlugins().forEach(module => {
                        const li = document.createElement("li");
                        li.innerHTML = module;
                        const a = document.createElement("a");
                        a.href = "#";
                        a.textContent = "X";
                        a.onclick = () => {
                            removeCustomPlugins(module);
                            updateCustomModules();
                            ds.declareRestartRequired(i);
                            return false;
                        };
                        li.appendChild(a);
                        customModulesOL.appendChild(li);
                    });
                };
                updateCustomModules();
                container.appendChild(customModulesOL);
                const inputForm = createNewModuleInputForm(updateCustomModules, i);
                container.appendChild(inputForm);
                ds.subtitle(i("play_sidebar_plugins_plugin_dev"));
                const pluginsDevOL = document.createElement("ol");
                pluginsDevOL.className = "playground-options";
                const connectToDev = ds.localStorageOption({
                    display: i("play_sidebar_plugins_plugin_dev_option"),
                    blurb: i("play_sidebar_plugins_plugin_dev_copy"),
                    flag: "compiler-setting-connect-dev-plugin",
                    onchange: () => {
                        ds.declareRestartRequired(i);
                    },
                });
                pluginsDevOL.appendChild(connectToDev);
                container.appendChild(pluginsDevOL);
            },
        };
        const createPlugin = (plugin) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const label = document.createElement("label");
            const top = `<span>${plugin.display}</span> by <a href='${plugin.author.href}'>${plugin.author.name}</a><br/>${plugin.blurb}`;
            const bottom = `<a href='https://www.npmjs.com/package/${plugin.module}'>npm</a> | <a href="${plugin.repo}">repo</a>`;
            label.innerHTML = `${top}<br/>${bottom}`;
            const key = "plugin-" + plugin.module;
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = key;
            input.checked = !!localStorage.getItem(key);
            input.onchange = () => {
                const ds = utils.createDesignSystem(div);
                ds.declareRestartRequired(i);
                if (input.checked) {
                    // @ts-ignore
                    window.appInsights &&
                        // @ts-ignore
                        window.appInsights.trackEvent({ name: "Added Registry Plugin", properties: { id: key } });
                    localStorage.setItem(key, "true");
                }
                else {
                    localStorage.removeItem(key);
                }
            };
            label.htmlFor = input.id;
            div.appendChild(input);
            div.appendChild(label);
            li.appendChild(div);
            return li;
        };
        const createNewModuleInputForm = (updateOL, i) => {
            const form = document.createElement("form");
            const newModuleInput = document.createElement("input");
            newModuleInput.type = "text";
            newModuleInput.placeholder = i("play_sidebar_plugins_options_modules_placeholder");
            form.appendChild(newModuleInput);
            form.onsubmit = e => {
                const ds = utils.createDesignSystem(form);
                ds.declareRestartRequired(i);
                exports.addCustomPlugin(newModuleInput.value);
                e.stopPropagation();
                updateOL();
                return false;
            };
            return form;
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvcGx1Z2lucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBRUEsTUFBTSxjQUFjLEdBQUc7UUFDckI7WUFDRSxNQUFNLEVBQUUseUNBQXlDO1lBQ2pELE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsS0FBSyxFQUFFLHNHQUFzRztZQUM3RyxJQUFJLEVBQUUsbURBQW1EO1lBQ3pELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsaUJBQWlCO2FBQ3hCO1NBQ0Y7UUFDRDtZQUNFLE1BQU0sRUFBRSx3QkFBd0I7WUFDaEMsT0FBTyxFQUFFLGFBQWE7WUFDdEIsS0FBSyxFQUFFLHdDQUF3QztZQUMvQyxJQUFJLEVBQUUsd0RBQXdEO1lBQzlELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsaUJBQWlCO2FBQ3hCO1NBQ0Y7S0FDRixDQUFBO0lBRUQsNkVBQTZFO0lBQ2hFLFFBQUEsMEJBQTBCLEdBQUcsR0FBRyxFQUFFO1FBQzdDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQTtJQUN0RSxDQUFDLENBQUE7SUFFWSxRQUFBLGFBQWEsR0FBRyxHQUFHLEVBQUU7UUFDaEMsTUFBTSxRQUFRLEdBQUcsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM1RCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lB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QVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFM0MsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN0RCxjQUFjLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQTtZQUM1QixjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO1lBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7WUFFaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDbEIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUN6QyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRTVCLHVCQUFlLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNyQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBQ25CLFFBQVEsRUFBRSxDQUFBO2dCQUNWLE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQyxDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRQbHVnaW4sIFBsdWdpbkZhY3RvcnkgfSBmcm9tIFwiLi5cIlxuXG5jb25zdCBwbHVnaW5SZWdpc3RyeSA9IFtcbiAge1xuICAgIG1vZHVsZTogXCJ0eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGVcIixcbiAgICBkaXNwbGF5OiBcIlByZXNlbnRhdGlvbiBNb2RlXCIsXG4gICAgYmx1cmI6IFwiQ3JlYXRlIHByZXNlbnRhdGlvbnMgaW5zaWRlIHRoZSBUeXBlU2NyaXB0IHBsYXlncm91bmQsIHNlYW1sZXNzbHkganVtcCBiZXR3ZWVuIHNsaWRlcyBhbmQgbGl2ZS1jb2RlLlwiLFxuICAgIHJlcG86IFwiaHR0cHM6Ly9naXRodWIuY29tL29ydGEvcGxheWdyb3VuZC1zbGlkZXMvI3JlYWRtZVwiLFxuICAgIGF1dGhvcjoge1xuICAgICAgbmFtZTogXCJPcnRhXCIsXG4gICAgICBocmVmOiBcImh0dHBzOi8vb3J0YS5pb1wiLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBtb2R1bGU6IFwicGxheWdyb3VuZC1jb2xsYWJvcmF0ZVwiLFxuICAgIGRpc3BsYXk6IFwiQ29sbGFib3JhdGVcIixcbiAgICBibHVyYjogXCJDcmVhdGUgcm9vbXMgdG8gaW5zcGVjdCBjb2RlIHRvZ2V0aGVyLlwiLFxuICAgIHJlcG86IFwiaHR0cHM6Ly9naXRodWIuY29tL29ydGEvcGxheWdyb3VuZC1jb2xsYWJvcmF0ZS8jcmVhZG1lXCIsXG4gICAgYXV0aG9yOiB7XG4gICAgICBuYW1lOiBcIk9ydGFcIixcbiAgICAgIGhyZWY6IFwiaHR0cHM6Ly9vcnRhLmlvXCIsXG4gICAgfSxcbiAgfSxcbl1cblxuLyoqIFdoZXRoZXIgdGhlIHBsYXlncm91bmQgc2hvdWxkIGFjdGl2ZWx5IHJlYWNoIG91dCB0byBhbiBleGlzdGluZyBwbHVnaW4gKi9cbmV4cG9ydCBjb25zdCBhbGxvd0Nvbm5lY3RpbmdUb0xvY2FsaG9zdCA9ICgpID0+IHtcbiAgcmV0dXJuICEhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjb21waWxlci1zZXR0aW5nLWNvbm5lY3QtZGV2LXBsdWdpblwiKVxufVxuXG5leHBvcnQgY29uc3QgYWN0aXZlUGx1Z2lucyA9ICgpID0+IHtcbiAgY29uc3QgZXhpc3RpbmcgPSBjdXN0b21QbHVnaW5zKCkubWFwKG1vZHVsZSA9PiAoeyBtb2R1bGUgfSkpXG4gIHJldHVybiBleGlzdGluZy5jb25jYXQocGx1Z2luUmVnaXN0cnkuZmlsdGVyKHAgPT4gISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsdWdpbi1cIiArIHAubW9kdWxlKSkpXG59XG5cbmNvbnN0IHJlbW92ZUN1c3RvbVBsdWdpbnMgPSAobW9kOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgbmV3UGx1Z2lucyA9IGN1c3RvbVBsdWdpbnMoKS5maWx0ZXIocCA9PiBwICE9PSBtb2QpXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VzdG9tLXBsdWdpbnMtcGxheWdyb3VuZFwiLCBKU09OLnN0cmluZ2lmeShuZXdQbHVnaW5zKSlcbn1cblxuZXhwb3J0IGNvbnN0IGFkZEN1c3RvbVBsdWdpbiA9IChtb2Q6IHN0cmluZykgPT4ge1xuICBjb25zdCBuZXdQbHVnaW5zID0gY3VzdG9tUGx1Z2lucygpXG4gIG5ld1BsdWdpbnMucHVzaChtb2QpXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VzdG9tLXBsdWdpbnMtcGxheWdyb3VuZFwiLCBKU09OLnN0cmluZ2lmeShuZXdQbHVnaW5zKSlcbiAgLy8gQHRzLWlnbm9yZVxuICB3aW5kb3cuYXBwSW5zaWdodHMgJiZcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2luZG93LmFwcEluc2lnaHRzLnRyYWNrRXZlbnQoeyBuYW1lOiBcIkFkZGVkIEN1c3RvbSBNb2R1bGVcIiwgcHJvcGVydGllczogeyBpZDogbW9kIH0gfSlcbn1cblxuY29uc3QgY3VzdG9tUGx1Z2lucyA9ICgpOiBzdHJpbmdbXSA9PiB7XG4gIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY3VzdG9tLXBsdWdpbnMtcGxheWdyb3VuZFwiKSB8fCBcIltdXCIpXG59XG5cbmV4cG9ydCBjb25zdCBvcHRpb25zUGx1Z2luOiBQbHVnaW5GYWN0b3J5ID0gKGksIHV0aWxzKSA9PiB7XG4gIGNvbnN0IHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbiA9IHtcbiAgICBpZDogXCJwbHVnaW5zXCIsXG4gICAgZGlzcGxheU5hbWU6IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc1wiKSxcbiAgICAvLyBzaG91bGRCZVNlbGVjdGVkOiAoKSA9PiB0cnVlLCAvLyB1bmNvbW1lbnQgdG8gbWFrZSB0aGlzIHRoZSBmaXJzdCB0YWIgb24gcmVsb2Fkc1xuICAgIHdpbGxNb3VudDogKF9zYW5kYm94LCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcblxuICAgICAgZHMuc3VidGl0bGUoaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX29wdGlvbnNfZXh0ZXJuYWxcIikpXG5cbiAgICAgIGNvbnN0IHBsdWdpbnNPTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgcGx1Z2luc09MLmNsYXNzTmFtZSA9IFwicGxheWdyb3VuZC1wbHVnaW5zXCJcbiAgICAgIHBsdWdpblJlZ2lzdHJ5LmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ0J1dHRvbiA9IGNyZWF0ZVBsdWdpbihwbHVnaW4pXG4gICAgICAgIHBsdWdpbnNPTC5hcHBlbmRDaGlsZChzZXR0aW5nQnV0dG9uKVxuICAgICAgfSlcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwbHVnaW5zT0wpXG5cbiAgICAgIGNvbnN0IHdhcm5pbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxuICAgICAgd2FybmluZy5jbGFzc05hbWUgPSBcIndhcm5pbmdcIlxuICAgICAgd2FybmluZy50ZXh0Q29udGVudCA9IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19vcHRpb25zX2V4dGVybmFsX3dhcm5pbmdcIilcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3YXJuaW5nKVxuXG4gICAgICBkcy5zdWJ0aXRsZShpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfb3B0aW9uc19tb2R1bGVzXCIpKVxuXG4gICAgICBjb25zdCBjdXN0b21Nb2R1bGVzT0wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib2xcIilcbiAgICAgIGN1c3RvbU1vZHVsZXNPTC5jbGFzc05hbWUgPSBcImN1c3RvbS1tb2R1bGVzXCJcblxuICAgICAgY29uc3QgdXBkYXRlQ3VzdG9tTW9kdWxlcyA9ICgpID0+IHtcbiAgICAgICAgd2hpbGUgKGN1c3RvbU1vZHVsZXNPTC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgY3VzdG9tTW9kdWxlc09MLnJlbW92ZUNoaWxkKGN1c3RvbU1vZHVsZXNPTC5maXJzdENoaWxkKVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbVBsdWdpbnMoKS5mb3JFYWNoKG1vZHVsZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgICBsaS5pbm5lckhUTUwgPSBtb2R1bGVcbiAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICAgICAgICBhLmhyZWYgPSBcIiNcIlxuICAgICAgICAgIGEudGV4dENvbnRlbnQgPSBcIlhcIlxuICAgICAgICAgIGEub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUN1c3RvbVBsdWdpbnMobW9kdWxlKVxuICAgICAgICAgICAgdXBkYXRlQ3VzdG9tTW9kdWxlcygpXG4gICAgICAgICAgICBkcy5kZWNsYXJlUmVzdGFydFJlcXVpcmVkKGkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoYSlcblxuICAgICAgICAgIGN1c3RvbU1vZHVsZXNPTC5hcHBlbmRDaGlsZChsaSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHVwZGF0ZUN1c3RvbU1vZHVsZXMoKVxuXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY3VzdG9tTW9kdWxlc09MKVxuICAgICAgY29uc3QgaW5wdXRGb3JtID0gY3JlYXRlTmV3TW9kdWxlSW5wdXRGb3JtKHVwZGF0ZUN1c3RvbU1vZHVsZXMsIGkpXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaW5wdXRGb3JtKVxuXG4gICAgICBkcy5zdWJ0aXRsZShpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfcGx1Z2luX2RldlwiKSlcblxuICAgICAgY29uc3QgcGx1Z2luc0Rldk9MID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9sXCIpXG4gICAgICBwbHVnaW5zRGV2T0wuY2xhc3NOYW1lID0gXCJwbGF5Z3JvdW5kLW9wdGlvbnNcIlxuXG4gICAgICBjb25zdCBjb25uZWN0VG9EZXYgPSBkcy5sb2NhbFN0b3JhZ2VPcHRpb24oe1xuICAgICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfcGx1Z2luX2Rldl9vcHRpb25cIiksXG4gICAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfcGx1Z2luX2Rldl9jb3B5XCIpLFxuICAgICAgICBmbGFnOiBcImNvbXBpbGVyLXNldHRpbmctY29ubmVjdC1kZXYtcGx1Z2luXCIsXG4gICAgICAgIG9uY2hhbmdlOiAoKSA9PiB7XG4gICAgICAgICAgZHMuZGVjbGFyZVJlc3RhcnRSZXF1aXJlZChpKVxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcGx1Z2luc0Rldk9MLmFwcGVuZENoaWxkKGNvbm5lY3RUb0RldilcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwbHVnaW5zRGV2T0wpXG4gICAgfSxcbiAgfVxuXG4gIGNvbnN0IGNyZWF0ZVBsdWdpbiA9IChwbHVnaW46IHR5cGVvZiBwbHVnaW5SZWdpc3RyeVswXSkgPT4ge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIilcblxuICAgIGNvbnN0IHRvcCA9IGA8c3Bhbj4ke3BsdWdpbi5kaXNwbGF5fTwvc3Bhbj4gYnkgPGEgaHJlZj0nJHtwbHVnaW4uYXV0aG9yLmhyZWZ9Jz4ke3BsdWdpbi5hdXRob3IubmFtZX08L2E+PGJyLz4ke3BsdWdpbi5ibHVyYn1gXG4gICAgY29uc3QgYm90dG9tID0gYDxhIGhyZWY9J2h0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlLyR7cGx1Z2luLm1vZHVsZX0nPm5wbTwvYT4gfCA8YSBocmVmPVwiJHtwbHVnaW4ucmVwb31cIj5yZXBvPC9hPmBcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBgJHt0b3B9PGJyLz4ke2JvdHRvbX1gXG5cbiAgICBjb25zdCBrZXkgPSBcInBsdWdpbi1cIiArIHBsdWdpbi5tb2R1bGVcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCJcbiAgICBpbnB1dC5pZCA9IGtleVxuICAgIGlucHV0LmNoZWNrZWQgPSAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcblxuICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc3QgZHMgPSB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0oZGl2KVxuICAgICAgZHMuZGVjbGFyZVJlc3RhcnRSZXF1aXJlZChpKVxuICAgICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cuYXBwSW5zaWdodHMgJiZcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgd2luZG93LmFwcEluc2lnaHRzLnRyYWNrRXZlbnQoeyBuYW1lOiBcIkFkZGVkIFJlZ2lzdHJ5IFBsdWdpblwiLCBwcm9wZXJ0aWVzOiB7IGlkOiBrZXkgfSB9KVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIFwidHJ1ZVwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIGxhYmVsLmh0bWxGb3IgPSBpbnB1dC5pZFxuXG4gICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KVxuICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbClcbiAgICBsaS5hcHBlbmRDaGlsZChkaXYpXG4gICAgcmV0dXJuIGxpXG4gIH1cblxuICBjb25zdCBjcmVhdGVOZXdNb2R1bGVJbnB1dEZvcm0gPSAodXBkYXRlT0w6IEZ1bmN0aW9uLCBpOiBhbnkpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIilcblxuICAgIGNvbnN0IG5ld01vZHVsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgbmV3TW9kdWxlSW5wdXQudHlwZSA9IFwidGV4dFwiXG4gICAgbmV3TW9kdWxlSW5wdXQucGxhY2Vob2xkZXIgPSBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfb3B0aW9uc19tb2R1bGVzX3BsYWNlaG9sZGVyXCIpXG4gICAgZm9ybS5hcHBlbmRDaGlsZChuZXdNb2R1bGVJbnB1dClcblxuICAgIGZvcm0ub25zdWJtaXQgPSBlID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGZvcm0pXG4gICAgICBkcy5kZWNsYXJlUmVzdGFydFJlcXVpcmVkKGkpXG5cbiAgICAgIGFkZEN1c3RvbVBsdWdpbihuZXdNb2R1bGVJbnB1dC52YWx1ZSlcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHVwZGF0ZU9MKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG4iXX0=