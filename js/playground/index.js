define(["require", "exports", "./createElements", "./sidebar/runtime", "./exporter", "./createUI", "./getExample", "./monaco/ExampleHighlight", "./createConfigDropdown", "./sidebar/plugins", "./pluginUtils", "./sidebar/settings"], function (require, exports, createElements_1, runtime_1, exporter_1, createUI_1, getExample_1, ExampleHighlight_1, createConfigDropdown_1, plugins_1, pluginUtils_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupPlayground = void 0;
    exports.setupPlayground = (sandbox, monaco, config, i, react) => {
        const playgroundParent = sandbox.getDomNode().parentElement.parentElement.parentElement;
        const dragBar = createElements_1.createDragBar();
        playgroundParent.appendChild(dragBar);
        const sidebar = createElements_1.createSidebar();
        playgroundParent.appendChild(sidebar);
        const tabBar = createElements_1.createTabBar();
        sidebar.appendChild(tabBar);
        const container = createElements_1.createPluginContainer();
        sidebar.appendChild(container);
        const plugins = [];
        const tabs = [];
        // Let's things like the workbench hook into tab changes
        let didUpdateTab;
        const registerPlugin = (plugin) => {
            plugins.push(plugin);
            const tab = createElements_1.createTabForPlugin(plugin);
            tabs.push(tab);
            const tabClicked = e => {
                const previousPlugin = getCurrentPlugin();
                const newTab = e.target;
                const newPlugin = plugins.find(p => p.displayName == newTab.textContent);
                createElements_1.activatePlugin(newPlugin, previousPlugin, sandbox, tabBar, container);
                didUpdateTab && didUpdateTab(newPlugin, previousPlugin);
            };
            tabBar.appendChild(tab);
            tab.onclick = tabClicked;
        };
        const setDidUpdateTab = (func) => {
            didUpdateTab = func;
        };
        const getCurrentPlugin = () => {
            const selectedTab = tabs.find(t => t.classList.contains("active"));
            return plugins[tabs.indexOf(selectedTab)];
        };
        const defaultPlugins = config.plugins || settings_1.getPlaygroundPlugins();
        const utils = pluginUtils_1.createUtils(sandbox, react);
        const initialPlugins = defaultPlugins.map(f => f(i, utils));
        initialPlugins.forEach(p => registerPlugin(p));
        // Choose which should be selected
        const priorityPlugin = plugins.find(plugin => plugin.shouldBeSelected && plugin.shouldBeSelected());
        const selectedPlugin = priorityPlugin || plugins[0];
        const selectedTab = tabs[plugins.indexOf(selectedPlugin)];
        selectedTab.onclick({ target: selectedTab });
        let debouncingTimer = false;
        sandbox.editor.onDidChangeModelContent(_event => {
            const plugin = getCurrentPlugin();
            if (plugin.modelChanged)
                plugin.modelChanged(sandbox, sandbox.getModel(), container);
            // This needs to be last in the function
            if (debouncingTimer)
                return;
            debouncingTimer = true;
            setTimeout(() => {
                debouncingTimer = false;
                playgroundDebouncedMainFunction();
                // Only call the plugin function once every 0.3s
                if (plugin.modelChangedDebounce && plugin.displayName === getCurrentPlugin().displayName) {
                    plugin.modelChangedDebounce(sandbox, sandbox.getModel(), container);
                }
            }, 300);
        });
        // Sets the URL and storage of the sandbox string
        const playgroundDebouncedMainFunction = () => {
            const alwaysUpdateURL = !localStorage.getItem("disable-save-on-type");
            if (alwaysUpdateURL) {
                const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox);
                window.history.replaceState({}, "", newURL);
            }
            localStorage.setItem("sandbox-history", sandbox.getText());
        };
        // When any compiler flags are changed, trigger a potential change to the URL
        sandbox.setDidUpdateCompilerSettings(() => {
            playgroundDebouncedMainFunction();
            // @ts-ignore
            window.appInsights.trackEvent({ name: "Compiler Settings changed" });
            const model = sandbox.editor.getModel();
            const plugin = getCurrentPlugin();
            if (model && plugin.modelChanged)
                plugin.modelChanged(sandbox, model, container);
            if (model && plugin.modelChangedDebounce)
                plugin.modelChangedDebounce(sandbox, model, container);
        });
        // Setup working with the existing UI, once it's loaded
        // Versions of TypeScript
        // Set up the label for the dropdown
        const versionButton = document.querySelectorAll("#versions > a").item(0);
        versionButton.innerHTML = "v" + sandbox.ts.version + " <span class='caret'/>";
        versionButton.setAttribute("aria-label", `Select version of TypeScript, currently ${sandbox.ts.version}`);
        // Add the versions to the dropdown
        const versionsMenu = document.querySelectorAll("#versions > ul").item(0);
        // Enable all submenus
        document.querySelectorAll("nav ul li").forEach(e => e.classList.add("active"));
        const notWorkingInPlayground = ["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"];
        const allVersions = ["4.0.0-beta", ...sandbox.supportedVersions.filter(f => !notWorkingInPlayground.includes(f)), "Nightly"];
        allVersions.forEach((v) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = v;
            a.href = "#";
            if (v === "Nightly") {
                li.classList.add("nightly");
            }
            if (v.toLowerCase().includes("beta")) {
                li.classList.add("beta");
            }
            li.onclick = () => {
                const currentURL = sandbox.createURLQueryWithCompilerOptions(sandbox);
                const params = new URLSearchParams(currentURL.split("#")[0]);
                const version = v === "Nightly" ? "next" : v;
                params.set("ts", version);
                const hash = document.location.hash.length ? document.location.hash : "";
                const newURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}?${params}${hash}`;
                // @ts-ignore - it is allowed
                document.location = newURL;
            };
            li.appendChild(a);
            versionsMenu.appendChild(li);
        });
        // Support dropdowns
        document.querySelectorAll(".navbar-sub li.dropdown > a").forEach(link => {
            const a = link;
            a.onclick = _e => {
                if (a.parentElement.classList.contains("open")) {
                    document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"));
                    a.setAttribute("aria-expanded", "false");
                }
                else {
                    document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"));
                    a.parentElement.classList.toggle("open");
                    a.setAttribute("aria-expanded", "true");
                    const exampleContainer = a.closest("li").getElementsByTagName("ul").item(0);
                    const firstLabel = exampleContainer.querySelector("label");
                    if (firstLabel)
                        firstLabel.focus();
                    // Set exact height and widths for the popovers for the main playground navigation
                    const isPlaygroundSubmenu = !!a.closest("nav");
                    if (isPlaygroundSubmenu) {
                        const playgroundContainer = document.getElementById("playground-container");
                        exampleContainer.style.height = `calc(${playgroundContainer.getBoundingClientRect().height + 26}px - 4rem)`;
                        const sideBarWidth = document.querySelector(".playground-sidebar").offsetWidth;
                        exampleContainer.style.width = `calc(100% - ${sideBarWidth}px - 71px)`;
                        // All this is to make sure that tabbing stays inside the dropdown for tsconfig/examples
                        const buttons = exampleContainer.querySelectorAll("input");
                        const lastButton = buttons.item(buttons.length - 1);
                        if (lastButton) {
                            redirectTabPressTo(lastButton, exampleContainer, ".examples-close");
                        }
                        else {
                            const sections = document.querySelectorAll("ul.examples-dropdown .section-content");
                            sections.forEach(s => {
                                const buttons = s.querySelectorAll("a.example-link");
                                const lastButton = buttons.item(buttons.length - 1);
                                if (lastButton) {
                                    redirectTabPressTo(lastButton, exampleContainer, ".examples-close");
                                }
                            });
                        }
                    }
                }
            };
        });
        // Handle escape closing dropdowns etc
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = evt.key === "Escape" || evt.key === "Esc";
            }
            else {
                // @ts-ignore - this used to be the case
                isEscape = evt.keyCode === 27;
            }
            if (isEscape) {
                document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"));
                document.querySelectorAll(".navbar-sub li").forEach(i => i.setAttribute("aria-expanded", "false"));
            }
        };
        // Set up some key commands
        sandbox.editor.addAction({
            id: "copy-clipboard",
            label: "Save to clipboard",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
            contextMenuGroupId: "run",
            contextMenuOrder: 1.5,
            run: function (ed) {
                window.navigator.clipboard.writeText(location.href.toString()).then(() => ui.flashInfo(i("play_export_clipboard")), (e) => alert(e));
            },
        });
        sandbox.editor.addAction({
            id: "run-js",
            label: "Run the evaluated JavaScript for your TypeScript file",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            contextMenuGroupId: "run",
            contextMenuOrder: 1.5,
            run: function (ed) {
                const runButton = document.getElementById("run-button");
                runButton && runButton.onclick && runButton.onclick({});
            },
        });
        const runButton = document.getElementById("run-button");
        if (runButton) {
            runButton.onclick = () => {
                const run = sandbox.getRunnableJS();
                const runPlugin = plugins.find(p => p.id === "logs");
                createElements_1.activatePlugin(runPlugin, getCurrentPlugin(), sandbox, tabBar, container);
                runtime_1.runWithCustomLogs(run, i);
                const isJS = sandbox.config.useJavaScript;
                ui.flashInfo(i(isJS ? "play_run_js" : "play_run_ts"));
            };
        }
        // Handle the close buttons on the examples
        document.querySelectorAll("button.examples-close").forEach(b => {
            const button = b;
            button.onclick = (e) => {
                const button = e.target;
                const navLI = button.closest("li");
                navLI === null || navLI === void 0 ? void 0 : navLI.classList.remove("open");
            };
        });
        createElements_1.setupSidebarToggle();
        if (document.getElementById("config-container")) {
            createConfigDropdown_1.createConfigDropdown(sandbox, monaco);
            createConfigDropdown_1.updateConfigDropdownForCompilerOptions(sandbox, monaco);
        }
        if (document.getElementById("playground-settings")) {
            const settingsToggle = document.getElementById("playground-settings");
            settingsToggle.onclick = () => {
                const open = settingsToggle.parentElement.classList.contains("open");
                const sidebarTabs = document.querySelector(".playground-plugin-tabview");
                const sidebarContent = document.querySelector(".playground-plugin-container");
                let settingsContent = document.querySelector(".playground-settings-container");
                if (!settingsContent) {
                    settingsContent = document.createElement("div");
                    settingsContent.className = "playground-settings-container playground-plugin-container";
                    const settings = settings_1.settingsPlugin(i, utils);
                    settings.didMount && settings.didMount(sandbox, settingsContent);
                    document.querySelector(".playground-sidebar").appendChild(settingsContent);
                    // When the last tab item is hit, go back to the settings button
                    const labels = document.querySelectorAll(".playground-sidebar input");
                    const lastLabel = labels.item(labels.length - 1);
                    if (lastLabel) {
                        redirectTabPressTo(lastLabel, undefined, "#playground-settings");
                    }
                }
                if (open) {
                    sidebarTabs.style.display = "flex";
                    sidebarContent.style.display = "block";
                    settingsContent.style.display = "none";
                }
                else {
                    sidebarTabs.style.display = "none";
                    sidebarContent.style.display = "none";
                    settingsContent.style.display = "block";
                    document.querySelector(".playground-sidebar label").focus();
                }
                settingsToggle.parentElement.classList.toggle("open");
            };
        }
        // Support grabbing examples from the location hash
        if (location.hash.startsWith("#example")) {
            const exampleName = location.hash.replace("#example/", "").trim();
            sandbox.config.logger.log("Loading example:", exampleName);
            getExample_1.getExampleSourceCode(config.prefix, config.lang, exampleName).then(ex => {
                if (ex.example && ex.code) {
                    const { example, code } = ex;
                    // Update the localstorage showing that you've seen this page
                    if (localStorage) {
                        const seenText = localStorage.getItem("examples-seen") || "{}";
                        const seen = JSON.parse(seenText);
                        seen[example.id] = example.hash;
                        localStorage.setItem("examples-seen", JSON.stringify(seen));
                    }
                    // Set the menu to be the same section as this current example
                    // this happens behind the scene and isn't visible till you hover
                    // const sectionTitle = example.path[0]
                    // const allSectionTitles = document.getElementsByClassName('section-name')
                    // for (const title of allSectionTitles) {
                    //   if (title.textContent === sectionTitle) {
                    //     title.onclick({})
                    //   }
                    // }
                    const allLinks = document.querySelectorAll("example-link");
                    // @ts-ignore
                    for (const link of allLinks) {
                        if (link.textContent === example.title) {
                            link.classList.add("highlight");
                        }
                    }
                    document.title = "TypeScript Playground - " + example.title;
                    sandbox.setText(code);
                }
                else {
                    sandbox.setText("// There was an issue getting the example, bad URL? Check the console in the developer tools");
                }
            });
        }
        // Sets up a way to click between examples
        monaco.languages.registerLinkProvider(sandbox.language, new ExampleHighlight_1.ExampleHighlighter());
        const languageSelector = document.getElementById("language-selector");
        if (languageSelector) {
            const params = new URLSearchParams(location.search);
            languageSelector.options.selectedIndex = params.get("useJavaScript") ? 1 : 0;
            languageSelector.onchange = () => {
                const useJavaScript = languageSelector.value === "JavaScript";
                const query = sandbox.createURLQueryWithCompilerOptions(sandbox, {
                    useJavaScript: useJavaScript ? true : undefined,
                });
                const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`;
                // @ts-ignore
                document.location = fullURL;
            };
        }
        const ui = createUI_1.createUI();
        const exporter = exporter_1.createExporter(sandbox, monaco, ui);
        const playground = {
            exporter,
            ui,
            registerPlugin,
            plugins,
            getCurrentPlugin,
            tabs,
            setDidUpdateTab,
        };
        window.ts = sandbox.ts;
        window.sandbox = sandbox;
        window.playground = playground;
        console.log(`Using TypeScript ${window.ts.version}`);
        console.log("Available globals:");
        console.log("\twindow.ts", window.ts);
        console.log("\twindow.sandbox", window.sandbox);
        console.log("\twindow.playground", window.playground);
        console.log("\twindow.react", window.react);
        console.log("\twindow.reactDOM", window.reactDOM);
        /** A plugin */
        const activateExternalPlugin = (plugin, autoActivate) => {
            let readyPlugin;
            // Can either be a factory, or object
            if (typeof plugin === "function") {
                const utils = pluginUtils_1.createUtils(sandbox, react);
                readyPlugin = plugin(utils);
            }
            else {
                readyPlugin = plugin;
            }
            if (autoActivate) {
                console.log(readyPlugin);
            }
            playground.registerPlugin(readyPlugin);
            // Auto-select the dev plugin
            const pluginWantsFront = readyPlugin.shouldBeSelected && readyPlugin.shouldBeSelected();
            if (pluginWantsFront || autoActivate) {
                // Auto-select the dev plugin
                createElements_1.activatePlugin(readyPlugin, getCurrentPlugin(), sandbox, tabBar, container);
            }
        };
        // Dev mode plugin
        if (config.supportCustomPlugins && plugins_1.allowConnectingToLocalhost()) {
            window.exports = {};
            console.log("Connecting to dev plugin");
            try {
                // @ts-ignore
                const re = window.require;
                re(["local/index"], (devPlugin) => {
                    console.log("Set up dev plugin from localhost:5000");
                    try {
                        activateExternalPlugin(devPlugin, true);
                    }
                    catch (error) {
                        console.error(error);
                        setTimeout(() => {
                            ui.flashInfo("Error: Could not load dev plugin from localhost:5000");
                        }, 700);
                    }
                });
            }
            catch (error) {
                console.error("Problem loading up the dev plugin");
                console.error(error);
            }
        }
        const downloadPlugin = (plugin, autoEnable) => {
            try {
                // @ts-ignore
                const re = window.require;
                re([`unpkg/${plugin}@latest/dist/index`], (devPlugin) => {
                    activateExternalPlugin(devPlugin, autoEnable);
                });
            }
            catch (error) {
                console.error("Problem loading up the plugin:", plugin);
                console.error(error);
            }
        };
        if (config.supportCustomPlugins) {
            // Grab ones from localstorage
            plugins_1.activePlugins().forEach(p => downloadPlugin(p.module, false));
            // Offer to install one if 'install-plugin' is a query param
            const params = new URLSearchParams(location.search);
            const pluginToInstall = params.get("install-plugin");
            if (pluginToInstall) {
                const alreadyInstalled = plugins_1.activePlugins().find(p => p.module === pluginToInstall);
                if (!alreadyInstalled) {
                    const shouldDoIt = confirm("Would you like to install the third party plugin?\n\n" + pluginToInstall);
                    if (shouldDoIt) {
                        plugins_1.addCustomPlugin(pluginToInstall);
                        downloadPlugin(pluginToInstall, true);
                    }
                }
            }
        }
        if (location.hash.startsWith("#show-examples")) {
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("examples-button")) === null || _a === void 0 ? void 0 : _a.click();
            }, 100);
        }
        if (location.hash.startsWith("#show-whatisnew")) {
            setTimeout(() => {
                var _a;
                (_a = document.getElementById("whatisnew-button")) === null || _a === void 0 ? void 0 : _a.click();
            }, 100);
        }
        return playground;
    };
    const redirectTabPressTo = (element, container, query) => {
        // element.style.backgroundColor = "red"
        element.addEventListener("keydown", e => {
            if (e.keyCode === 9) {
                const host = container || document;
                const result = host.querySelector(query);
                if (!result)
                    throw new Error(`Expected to find a result for keydown`);
                result.focus();
                console.log(result);
                e.preventDefault();
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBc0VhLFFBQUEsZUFBZSxHQUFHLENBQzdCLE9BQWdCLEVBQ2hCLE1BQWMsRUFDZCxNQUF3QixFQUN4QixDQUEwQixFQUMxQixLQUFtQixFQUNuQixFQUFFO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsYUFBYyxDQUFDLGFBQWMsQ0FBQyxhQUFjLENBQUE7UUFDMUYsTUFBTSxPQUFPLEdBQUcsOEJBQWEsRUFBRSxDQUFBO1FBQy9CLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVyQyxNQUFNLE9BQU8sR0FBRyw4QkFBYSxFQUFFLENBQUE7UUFDL0IsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXJDLE1BQU0sTUFBTSxHQUFHLDZCQUFZLEVBQUUsQ0FBQTtRQUM3QixPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTNCLE1BQU0sU0FBUyxHQUFHLHNDQUFxQixFQUFFLENBQUE7UUFDekMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUU5QixNQUFNLE9BQU8sR0FBRyxFQUF3QixDQUFBO1FBQ3hDLE1BQU0sSUFBSSxHQUFHLEVBQXlCLENBQUE7UUFFdEMsd0RBQXdEO1FBQ3hELElBQUksWUFBaUcsQ0FBQTtRQUVyRyxNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQXdCLEVBQUUsRUFBRTtZQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRXBCLE1BQU0sR0FBRyxHQUFHLG1DQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFZCxNQUFNLFVBQVUsR0FBMkIs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LFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixNQUFNLElBQUksR0FBRyxTQUFTLElBQUksUUFBUSxDQUFBO2dCQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBUSxDQUFBO2dCQUMvQyxJQUFJLENBQUMsTUFBTTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7Z0JBQ3JFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNuQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7YUFDbkI7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgU2FuZGJveCA9IGltcG9ydChcInR5cGVzY3JpcHQtc2FuZGJveFwiKS5TYW5kYm94XG50eXBlIE1vbmFjbyA9IHR5cGVvZiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpXG5cbmRlY2xhcmUgY29uc3Qgd2luZG93OiBhbnlcblxuaW1wb3J0IHtcbiAgY3JlYXRlU2lkZWJhcixcbiAgY3JlYXRlVGFiRm9yUGx1Z2luLFxuICBjcmVhdGVUYWJCYXIsXG4gIGNyZWF0ZVBsdWdpbkNvbnRhaW5lcixcbiAgYWN0aXZhdGVQbHVnaW4sXG4gIGNyZWF0ZURyYWdCYXIsXG4gIHNldHVwU2lkZWJhclRvZ2dsZSxcbn0gZnJvbSBcIi4vY3JlYXRlRWxlbWVudHNcIlxuaW1wb3J0IHsgcnVuV2l0aEN1c3RvbUxvZ3MgfSBmcm9tIFwiLi9zaWRlYmFyL3J1bnRpbWVcIlxuaW1wb3J0IHsgY3JlYXRlRXhwb3J0ZXIgfSBmcm9tIFwiLi9leHBvcnRlclwiXG5pbXBvcnQgeyBjcmVhdGVVSSB9IGZyb20gXCIuL2NyZWF0ZVVJXCJcbmltcG9ydCB7IGdldEV4YW1wbGVTb3VyY2VDb2RlIH0gZnJvbSBcIi4vZ2V0RXhhbXBsZVwiXG5pbXBvcnQgeyBFeGFtcGxlSGlnaGxpZ2h0ZXIgfSBmcm9tIFwiLi9tb25hY28vRXhhbXBsZUhpZ2hsaWdodFwiXG5pbXBvcnQgeyBjcmVhdGVDb25maWdEcm9wZG93biwgdXBkYXRlQ29uZmlnRHJvcGRvd25Gb3JDb21waWxlck9wdGlvbnMgfSBmcm9tIFwiLi9jcmVhdGVDb25maWdEcm9wZG93blwiXG5pbXBvcnQgeyBhbGxvd0Nvbm5lY3RpbmdUb0xvY2FsaG9zdCwgYWN0aXZlUGx1Z2lucywgYWRkQ3VzdG9tUGx1Z2luIH0gZnJvbSBcIi4vc2lkZWJhci9wbHVnaW5zXCJcbmltcG9ydCB7IGNyZWF0ZVV0aWxzLCBQbHVnaW5VdGlscyB9IGZyb20gXCIuL3BsdWdpblV0aWxzXCJcbmltcG9ydCB0eXBlIFJlYWN0IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgeyBzZXR0aW5nc1BsdWdpbiwgZ2V0UGxheWdyb3VuZFBsdWdpbnMgfSBmcm9tIFwiLi9zaWRlYmFyL3NldHRpbmdzXCJcblxuZXhwb3J0IHsgUGx1Z2luVXRpbHMgfSBmcm9tIFwiLi9wbHVnaW5VdGlsc1wiXG5cbmV4cG9ydCB0eXBlIFBsdWdpbkZhY3RvcnkgPSB7XG4gIChpOiAoa2V5OiBzdHJpbmcsIGNvbXBvbmVudHM/OiBhbnkpID0+IHN0cmluZywgdXRpbHM6IFBsdWdpblV0aWxzKTogUGxheWdyb3VuZFBsdWdpblxufVxuXG4vKiogVGhlIGludGVyZmFjZSBvZiBhbGwgc2lkZWJhciBwbHVnaW5zICovXG5leHBvcnQgaW50ZXJmYWNlIFBsYXlncm91bmRQbHVnaW4ge1xuICAvKiogTm90IHB1YmxpYyBmYWNpbmcsIGJ1dCB1c2VkIGJ5IHRoZSBwbGF5Z3JvdW5kIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHBsdWdpbnMgKi9cbiAgaWQ6IHN0cmluZ1xuICAvKiogVG8gc2hvdyBpbiB0aGUgdGFicyAqL1xuICBkaXNwbGF5TmFtZTogc3RyaW5nXG4gIC8qKiBTaG91bGQgdGhpcyBwbHVnaW4gYmUgc2VsZWN0ZWQgd2hlbiB0aGUgcGx1Z2luIGlzIGZpcnN0IGxvYWRlZD8gTGV0cyB5b3UgY2hlY2sgZm9yIHF1ZXJ5IHZhcnMgZXRjIHRvIGxvYWQgYSBwYXJ0aWN1bGFyIHBsdWdpbiAqL1xuICBzaG91bGRCZVNlbGVjdGVkPzogKCkgPT4gYm9vbGVhblxuICAvKiogQmVmb3JlIHdlIHNob3cgdGhlIHRhYiwgdXNlIHRoaXMgdG8gc2V0IHVwIHlvdXIgSFRNTCAtIGl0IHdpbGwgYWxsIGJlIHJlbW92ZWQgYnkgdGhlIHBsYXlncm91bmQgd2hlbiBzb21lb25lIG5hdmlnYXRlcyBvZmYgdGhlIHRhYiAqL1xuICB3aWxsTW91bnQ/OiAoc2FuZGJveDogU2FuZGJveCwgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCkgPT4gdm9pZFxuICAvKiogQWZ0ZXIgd2Ugc2hvdyB0aGUgdGFiICovXG4gIGRpZE1vdW50PzogKHNhbmRib3g6IFNhbmRib3gsIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQpID0+IHZvaWRcbiAgLyoqIE1vZGVsIGNoYW5nZXMgd2hpbGUgdGhpcyBwbHVnaW4gaXMgYWN0aXZlbHkgc2VsZWN0ZWQgICovXG4gIG1vZGVsQ2hhbmdlZD86IChzYW5kYm94OiBTYW5kYm94LCBtb2RlbDogaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5lZGl0b3IuSVRleHRNb2RlbCwgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCkgPT4gdm9pZFxuICAvKiogRGVsYXllZCBtb2RlbCBjaGFuZ2VzIHdoaWxlIHRoaXMgcGx1Z2luIGlzIGFjdGl2ZWx5IHNlbGVjdGVkLCB1c2VmdWwgd2hlbiB5b3UgYXJlIHdvcmtpbmcgd2l0aCB0aGUgVFMgQVBJIGJlY2F1c2UgaXQgd29uJ3QgcnVuIG9uIGV2ZXJ5IGtleXByZXNzICovXG4gIG1vZGVsQ2hhbmdlZERlYm91bmNlPzogKFxuICAgIHNhbmRib3g6IFNhbmRib3gsXG4gICAgbW9kZWw6IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikuZWRpdG9yLklUZXh0TW9kZWwsXG4gICAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICApID0+IHZvaWRcbiAgLyoqIEJlZm9yZSB3ZSByZW1vdmUgdGhlIHRhYiAqL1xuICB3aWxsVW5tb3VudD86IChzYW5kYm94OiBTYW5kYm94LCBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50KSA9PiB2b2lkXG4gIC8qKiBBZnRlciB3ZSByZW1vdmUgdGhlIHRhYiAqL1xuICBkaWRVbm1vdW50PzogKHNhbmRib3g6IFNhbmRib3gsIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQpID0+IHZvaWRcbiAgLyoqIEFuIG9iamVjdCB5b3UgY2FuIHVzZSB0byBrZWVwIGRhdGEgYXJvdW5kIGluIHRoZSBzY29wZSBvZiB5b3VyIHBsdWdpbiBvYmplY3QgKi9cbiAgZGF0YT86IGFueVxufVxuXG5pbnRlcmZhY2UgUGxheWdyb3VuZENvbmZpZyB7XG4gIC8qKiBMYW5ndWFnZSBsaWtlIFwiZW5cIiAvIFwiamFcIiBldGMgKi9cbiAgbGFuZzogc3RyaW5nXG4gIC8qKiBTaXRlIHByZWZpeCwgbGlrZSBcInYyXCIgZHVyaW5nIHRoZSBwcmUtcmVsZWFzZSAqL1xuICBwcmVmaXg6IHN0cmluZ1xuICAvKiogT3B0aW9uYWwgcGx1Z2lucyBzbyB0aGF0IHdlIGNhbiByZS11c2UgdGhlIHBsYXlncm91bmQgd2l0aCBkaWZmZXJlbnQgc2lkZWJhcnMgKi9cbiAgcGx1Z2lucz86IFBsdWdpbkZhY3RvcnlbXVxuICAvKiogU2hvdWxkIHRoaXMgcGxheWdyb3VuZCBsb2FkIHVwIGN1c3RvbSBwbHVnaW5zIGZyb20gbG9jYWxTdG9yYWdlPyAqL1xuICBzdXBwb3J0Q3VzdG9tUGx1Z2luczogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3Qgc2V0dXBQbGF5Z3JvdW5kID0gKFxuICBzYW5kYm94OiBTYW5kYm94LFxuICBtb25hY286IE1vbmFjbyxcbiAgY29uZmlnOiBQbGF5Z3JvdW5kQ29uZmlnLFxuICBpOiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZyxcbiAgcmVhY3Q6IHR5cGVvZiBSZWFjdFxuKSA9PiB7XG4gIGNvbnN0IHBsYXlncm91bmRQYXJlbnQgPSBzYW5kYm94LmdldERvbU5vZGUoKS5wYXJlbnRFbGVtZW50IS5wYXJlbnRFbGVtZW50IS5wYXJlbnRFbGVtZW50IVxuICBjb25zdCBkcmFnQmFyID0gY3JlYXRlRHJhZ0JhcigpXG4gIHBsYXlncm91bmRQYXJlbnQuYXBwZW5kQ2hpbGQoZHJhZ0JhcilcblxuICBjb25zdCBzaWRlYmFyID0gY3JlYXRlU2lkZWJhcigpXG4gIHBsYXlncm91bmRQYXJlbnQuYXBwZW5kQ2hpbGQoc2lkZWJhcilcblxuICBjb25zdCB0YWJCYXIgPSBjcmVhdGVUYWJCYXIoKVxuICBzaWRlYmFyLmFwcGVuZENoaWxkKHRhYkJhcilcblxuICBjb25zdCBjb250YWluZXIgPSBjcmVhdGVQbHVnaW5Db250YWluZXIoKVxuICBzaWRlYmFyLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcblxuICBjb25zdCBwbHVnaW5zID0gW10gYXMgUGxheWdyb3VuZFBsdWdpbltdXG4gIGNvbnN0IHRhYnMgPSBbXSBhcyBIVE1MQnV0dG9uRWxlbWVudFtdXG5cbiAgLy8gTGV0J3MgdGhpbmdzIGxpa2UgdGhlIHdvcmtiZW5jaCBob29rIGludG8gdGFiIGNoYW5nZXNcbiAgbGV0IGRpZFVwZGF0ZVRhYjogKG5ld1BsdWdpbjogUGxheWdyb3VuZFBsdWdpbiwgcHJldmlvdXNQbHVnaW46IFBsYXlncm91bmRQbHVnaW4pID0+IHZvaWQgfCB1bmRlZmluZWRcblxuICBjb25zdCByZWdpc3RlclBsdWdpbiA9IChwbHVnaW46IFBsYXlncm91bmRQbHVnaW4pID0+IHtcbiAgICBwbHVnaW5zLnB1c2gocGx1Z2luKVxuXG4gICAgY29uc3QgdGFiID0gY3JlYXRlVGFiRm9yUGx1Z2luKHBsdWdpbilcblxuICAgIHRhYnMucHVzaCh0YWIpXG5cbiAgICBjb25zdCB0YWJDbGlja2VkOiBIVE1MRWxlbWVudFtcIm9uY2xpY2tcIl0gPSBlID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzUGx1Z2luID0gZ2V0Q3VycmVudFBsdWdpbigpXG4gICAgICBjb25zdCBuZXdUYWIgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuICAgICAgY29uc3QgbmV3UGx1Z2luID0gcGx1Z2lucy5maW5kKHAgPT4gcC5kaXNwbGF5TmFtZSA9PSBuZXdUYWIudGV4dENvbnRlbnQpIVxuICAgICAgYWN0aXZhdGVQbHVnaW4obmV3UGx1Z2luLCBwcmV2aW91c1BsdWdpbiwgc2FuZGJveCwgdGFiQmFyLCBjb250YWluZXIpXG4gICAgICBkaWRVcGRhdGVUYWIgJiYgZGlkVXBkYXRlVGFiKG5ld1BsdWdpbiwgcHJldmlvdXNQbHVnaW4pXG4gICAgfVxuXG4gICAgdGFiQmFyLmFwcGVuZENoaWxkKHRhYilcbiAgICB0YWIub25jbGljayA9IHRhYkNsaWNrZWRcbiAgfVxuXG4gIGNvbnN0IHNldERpZFVwZGF0ZVRhYiA9IChmdW5jOiAobmV3UGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luLCBwcmV2aW91c1BsdWdpbjogUGxheWdyb3VuZFBsdWdpbikgPT4gdm9pZCkgPT4ge1xuICAgIGRpZFVwZGF0ZVRhYiA9IGZ1bmNcbiAgfVxuXG4gIGNvbnN0IGdldEN1cnJlbnRQbHVnaW4gPSAoKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRUYWIgPSB0YWJzLmZpbmQodCA9PiB0LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkhXG4gICAgcmV0dXJuIHBsdWdpbnNbdGFicy5pbmRleE9mKHNlbGVjdGVkVGFiKV1cbiAgfVxuXG4gIGNvbnN0IGRlZmF1bHRQbHVnaW5zID0gY29uZmlnLnBsdWdpbnMgfHwgZ2V0UGxheWdyb3VuZFBsdWdpbnMoKVxuICBjb25zdCB1dGlscyA9IGNyZWF0ZVV0aWxzKHNhbmRib3gsIHJlYWN0KVxuICBjb25zdCBpbml0aWFsUGx1Z2lucyA9IGRlZmF1bHRQbHVnaW5zLm1hcChmID0+IGYoaSwgdXRpbHMpKVxuICBpbml0aWFsUGx1Z2lucy5mb3JFYWNoKHAgPT4gcmVnaXN0ZXJQbHVnaW4ocCkpXG5cbiAgLy8gQ2hvb3NlIHdoaWNoIHNob3VsZCBiZSBzZWxlY3RlZFxuICBjb25zdCBwcmlvcml0eVBsdWdpbiA9IHBsdWdpbnMuZmluZChwbHVnaW4gPT4gcGx1Z2luLnNob3VsZEJlU2VsZWN0ZWQgJiYgcGx1Z2luLnNob3VsZEJlU2VsZWN0ZWQoKSlcbiAgY29uc3Qgc2VsZWN0ZWRQbHVnaW4gPSBwcmlvcml0eVBsdWdpbiB8fCBwbHVnaW5zWzBdXG4gIGNvbnN0IHNlbGVjdGVkVGFiID0gdGFic1twbHVnaW5zLmluZGV4T2Yoc2VsZWN0ZWRQbHVnaW4pXSFcbiAgc2VsZWN0ZWRUYWIub25jbGljayEoeyB0YXJnZXQ6IHNlbGVjdGVkVGFiIH0gYXMgYW55KVxuXG4gIGxldCBkZWJvdW5jaW5nVGltZXIgPSBmYWxzZVxuICBzYW5kYm94LmVkaXRvci5vbkRpZENoYW5nZU1vZGVsQ29udGVudChfZXZlbnQgPT4ge1xuICAgIGNvbnN0IHBsdWdpbiA9IGdldEN1cnJlbnRQbHVnaW4oKVxuICAgIGlmIChwbHVnaW4ubW9kZWxDaGFuZ2VkKSBwbHVnaW4ubW9kZWxDaGFuZ2VkKHNhbmRib3gsIHNhbmRib3guZ2V0TW9kZWwoKSwgY29udGFpbmVyKVxuXG4gICAgLy8gVGhpcyBuZWVkcyB0byBiZSBsYXN0IGluIHRoZSBmdW5jdGlvblxuICAgIGlmIChkZWJvdW5jaW5nVGltZXIpIHJldHVyblxuICAgIGRlYm91bmNpbmdUaW1lciA9IHRydWVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlYm91bmNpbmdUaW1lciA9IGZhbHNlXG4gICAgICBwbGF5Z3JvdW5kRGVib3VuY2VkTWFpbkZ1bmN0aW9uKClcblxuICAgICAgLy8gT25seSBjYWxsIHRoZSBwbHVnaW4gZnVuY3Rpb24gb25jZSBldmVyeSAwLjNzXG4gICAgICBpZiAocGx1Z2luLm1vZGVsQ2hhbmdlZERlYm91bmNlICYmIHBsdWdpbi5kaXNwbGF5TmFtZSA9PT0gZ2V0Q3VycmVudFBsdWdpbigpLmRpc3BsYXlOYW1lKSB7XG4gICAgICAgIHBsdWdpbi5tb2RlbENoYW5nZWREZWJvdW5jZShzYW5kYm94LCBzYW5kYm94LmdldE1vZGVsKCksIGNvbnRhaW5lcilcbiAgICAgIH1cbiAgICB9LCAzMDApXG4gIH0pXG5cbiAgLy8gU2V0cyB0aGUgVVJMIGFuZCBzdG9yYWdlIG9mIHRoZSBzYW5kYm94IHN0cmluZ1xuICBjb25zdCBwbGF5Z3JvdW5kRGVib3VuY2VkTWFpbkZ1bmN0aW9uID0gKCkgPT4ge1xuICAgIGNvbnN0IGFsd2F5c1VwZGF0ZVVSTCA9ICFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpc2FibGUtc2F2ZS1vbi10eXBlXCIpXG4gICAgaWYgKGFsd2F5c1VwZGF0ZVVSTCkge1xuICAgICAgY29uc3QgbmV3VVJMID0gc2FuZGJveC5jcmVhdGVVUkxRdWVyeVdpdGhDb21waWxlck9wdGlvbnMoc2FuZGJveClcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgXCJcIiwgbmV3VVJMKVxuICAgIH1cblxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2FuZGJveC1oaXN0b3J5XCIsIHNhbmRib3guZ2V0VGV4dCgpKVxuICB9XG5cbiAgLy8gV2hlbiBhbnkgY29tcGlsZXIgZmxhZ3MgYXJlIGNoYW5nZWQsIHRyaWdnZXIgYSBwb3RlbnRpYWwgY2hhbmdlIHRvIHRoZSBVUkxcbiAgc2FuZGJveC5zZXREaWRVcGRhdGVDb21waWxlclNldHRpbmdzKCgpID0+IHtcbiAgICBwbGF5Z3JvdW5kRGVib3VuY2VkTWFpbkZ1bmN0aW9uKClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2luZG93LmFwcEluc2lnaHRzLnRyYWNrRXZlbnQoeyBuYW1lOiBcIkNvbXBpbGVyIFNldHRpbmdzIGNoYW5nZWRcIiB9KVxuXG4gICAgY29uc3QgbW9kZWwgPSBzYW5kYm94LmVkaXRvci5nZXRNb2RlbCgpXG4gICAgY29uc3QgcGx1Z2luID0gZ2V0Q3VycmVudFBsdWdpbigpXG4gICAgaWYgKG1vZGVsICYmIHBsdWdpbi5tb2RlbENoYW5nZWQpIHBsdWdpbi5tb2RlbENoYW5nZWQoc2FuZGJveCwgbW9kZWwsIGNvbnRhaW5lcilcbiAgICBpZiAobW9kZWwgJiYgcGx1Z2luLm1vZGVsQ2hhbmdlZERlYm91bmNlKSBwbHVnaW4ubW9kZWxDaGFuZ2VkRGVib3VuY2Uoc2FuZGJveCwgbW9kZWwsIGNvbnRhaW5lcilcbiAgfSlcblxuICAvLyBTZXR1cCB3b3JraW5nIHdpdGggdGhlIGV4aXN0aW5nIFVJLCBvbmNlIGl0J3MgbG9hZGVkXG5cbiAgLy8gVmVyc2lvbnMgb2YgVHlwZVNjcmlwdFxuXG4gIC8vIFNldCB1cCB0aGUgbGFiZWwgZm9yIHRoZSBkcm9wZG93blxuICBjb25zdCB2ZXJzaW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiN2ZXJzaW9ucyA+IGFcIikuaXRlbSgwKVxuICB2ZXJzaW9uQnV0dG9uLmlubmVySFRNTCA9IFwidlwiICsgc2FuZGJveC50cy52ZXJzaW9uICsgXCIgPHNwYW4gY2xhc3M9J2NhcmV0Jy8+XCJcbiAgdmVyc2lvbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGBTZWxlY3QgdmVyc2lvbiBvZiBUeXBlU2NyaXB0LCBjdXJyZW50bHkgJHtzYW5kYm94LnRzLnZlcnNpb259YClcblxuICAvLyBBZGQgdGhlIHZlcnNpb25zIHRvIHRoZSBkcm9wZG93blxuICBjb25zdCB2ZXJzaW9uc01lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3ZlcnNpb25zID4gdWxcIikuaXRlbSgwKVxuXG4gIC8vIEVuYWJsZSBhbGwgc3VibWVudXNcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIm5hdiB1bCBsaVwiKS5mb3JFYWNoKGUgPT4gZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpKVxuXG4gIGNvbnN0IG5vdFdvcmtpbmdJblBsYXlncm91bmQgPSBbXCIzLjEuNlwiLCBcIjMuMC4xXCIsIFwiMi44LjFcIiwgXCIyLjcuMlwiLCBcIjIuNC4xXCJdXG5cbiAgY29uc3QgYWxsVmVyc2lvbnMgPSBbXCI0LjAuMC1iZXRhXCIsIC4uLnNhbmRib3guc3VwcG9ydGVkVmVyc2lvbnMuZmlsdGVyKGYgPT4gIW5vdFdvcmtpbmdJblBsYXlncm91bmQuaW5jbHVkZXMoZikpLCBcIk5pZ2h0bHlcIl1cblxuICBhbGxWZXJzaW9ucy5mb3JFYWNoKCh2OiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgIGEudGV4dENvbnRlbnQgPSB2XG4gICAgYS5ocmVmID0gXCIjXCJcblxuICAgIGlmICh2ID09PSBcIk5pZ2h0bHlcIikge1xuICAgICAgbGkuY2xhc3NMaXN0LmFkZChcIm5pZ2h0bHlcIilcbiAgICB9XG5cbiAgICBpZiAodi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwiYmV0YVwiKSkge1xuICAgICAgbGkuY2xhc3NMaXN0LmFkZChcImJldGFcIilcbiAgICB9XG5cbiAgICBsaS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFVSTCA9IHNhbmRib3guY3JlYXRlVVJMUXVlcnlXaXRoQ29tcGlsZXJPcHRpb25zKHNhbmRib3gpXG4gICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGN1cnJlbnRVUkwuc3BsaXQoXCIjXCIpWzBdKVxuICAgICAgY29uc3QgdmVyc2lvbiA9IHYgPT09IFwiTmlnaHRseVwiID8gXCJuZXh0XCIgOiB2XG4gICAgICBwYXJhbXMuc2V0KFwidHNcIiwgdmVyc2lvbilcblxuICAgICAgY29uc3QgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2gubGVuZ3RoID8gZG9jdW1lbnQubG9jYXRpb24uaGFzaCA6IFwiXCJcbiAgICAgIGNvbnN0IG5ld1VSTCA9IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vJHtkb2N1bWVudC5sb2NhdGlvbi5ob3N0fSR7ZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWV9PyR7cGFyYW1zfSR7aGFzaH1gXG5cbiAgICAgIC8vIEB0cy1pZ25vcmUgLSBpdCBpcyBhbGxvd2VkXG4gICAgICBkb2N1bWVudC5sb2NhdGlvbiA9IG5ld1VSTFxuICAgIH1cblxuICAgIGxpLmFwcGVuZENoaWxkKGEpXG4gICAgdmVyc2lvbnNNZW51LmFwcGVuZENoaWxkKGxpKVxuICB9KVxuXG4gIC8vIFN1cHBvcnQgZHJvcGRvd25zXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2YmFyLXN1YiBsaS5kcm9wZG93biA+IGFcIikuZm9yRWFjaChsaW5rID0+IHtcbiAgICBjb25zdCBhID0gbGluayBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgIGEub25jbGljayA9IF9lID0+IHtcbiAgICAgIGlmIChhLnBhcmVudEVsZW1lbnQhLmNsYXNzTGlzdC5jb250YWlucyhcIm9wZW5cIikpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYXZiYXItc3ViIGxpLm9wZW5cIikuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcIm9wZW5cIikpXG4gICAgICAgIGEuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmJhci1zdWIgbGkub3BlblwiKS5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwib3BlblwiKSlcbiAgICAgICAgYS5wYXJlbnRFbGVtZW50IS5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKVxuICAgICAgICBhLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpXG5cbiAgICAgICAgY29uc3QgZXhhbXBsZUNvbnRhaW5lciA9IGEuY2xvc2VzdChcImxpXCIpIS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVsXCIpLml0ZW0oMCkhXG5cbiAgICAgICAgY29uc3QgZmlyc3RMYWJlbCA9IGV4YW1wbGVDb250YWluZXIucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIGlmIChmaXJzdExhYmVsKSBmaXJzdExhYmVsLmZvY3VzKClcblxuICAgICAgICAvLyBTZXQgZXhhY3QgaGVpZ2h0IGFuZCB3aWR0aHMgZm9yIHRoZSBwb3BvdmVycyBmb3IgdGhlIG1haW4gcGxheWdyb3VuZCBuYXZpZ2F0aW9uXG4gICAgICAgIGNvbnN0IGlzUGxheWdyb3VuZFN1Ym1lbnUgPSAhIWEuY2xvc2VzdChcIm5hdlwiKVxuICAgICAgICBpZiAoaXNQbGF5Z3JvdW5kU3VibWVudSkge1xuICAgICAgICAgIGNvbnN0IHBsYXlncm91bmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlncm91bmQtY29udGFpbmVyXCIpIVxuICAgICAgICAgIGV4YW1wbGVDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYGNhbGMoJHtwbGF5Z3JvdW5kQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIDI2fXB4IC0gNHJlbSlgXG5cbiAgICAgICAgICBjb25zdCBzaWRlQmFyV2lkdGggPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXJcIikgYXMgYW55KS5vZmZzZXRXaWR0aFxuICAgICAgICAgIGV4YW1wbGVDb250YWluZXIuc3R5bGUud2lkdGggPSBgY2FsYygxMDAlIC0gJHtzaWRlQmFyV2lkdGh9cHggLSA3MXB4KWBcblxuICAgICAgICAgIC8vIEFsbCB0aGlzIGlzIHRvIG1ha2Ugc3VyZSB0aGF0IHRhYmJpbmcgc3RheXMgaW5zaWRlIHRoZSBkcm9wZG93biBmb3IgdHNjb25maWcvZXhhbXBsZXNcbiAgICAgICAgICBjb25zdCBidXR0b25zID0gZXhhbXBsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilcbiAgICAgICAgICBjb25zdCBsYXN0QnV0dG9uID0gYnV0dG9ucy5pdGVtKGJ1dHRvbnMubGVuZ3RoIC0gMSkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICBpZiAobGFzdEJ1dHRvbikge1xuICAgICAgICAgICAgcmVkaXJlY3RUYWJQcmVzc1RvKGxhc3RCdXR0b24sIGV4YW1wbGVDb250YWluZXIsIFwiLmV4YW1wbGVzLWNsb3NlXCIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInVsLmV4YW1wbGVzLWRyb3Bkb3duIC5zZWN0aW9uLWNvbnRlbnRcIilcbiAgICAgICAgICAgIHNlY3Rpb25zLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJhLmV4YW1wbGUtbGlua1wiKVxuICAgICAgICAgICAgICBjb25zdCBsYXN0QnV0dG9uID0gYnV0dG9ucy5pdGVtKGJ1dHRvbnMubGVuZ3RoIC0gMSkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgICAgaWYgKGxhc3RCdXR0b24pIHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRhYlByZXNzVG8obGFzdEJ1dHRvbiwgZXhhbXBsZUNvbnRhaW5lciwgXCIuZXhhbXBsZXMtY2xvc2VcIilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLy8gSGFuZGxlIGVzY2FwZSBjbG9zaW5nIGRyb3Bkb3ducyBldGNcbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnRcbiAgICB2YXIgaXNFc2NhcGUgPSBmYWxzZVxuICAgIGlmIChcImtleVwiIGluIGV2dCkge1xuICAgICAgaXNFc2NhcGUgPSBldnQua2V5ID09PSBcIkVzY2FwZVwiIHx8IGV2dC5rZXkgPT09IFwiRXNjXCJcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQHRzLWlnbm9yZSAtIHRoaXMgdXNlZCB0byBiZSB0aGUgY2FzZVxuICAgICAgaXNFc2NhcGUgPSBldnQua2V5Q29kZSA9PT0gMjdcbiAgICB9XG4gICAgaWYgKGlzRXNjYXBlKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmJhci1zdWIgbGkub3BlblwiKS5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwib3BlblwiKSlcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2YmFyLXN1YiBsaVwiKS5mb3JFYWNoKGkgPT4gaS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIikpXG4gICAgfVxuICB9XG5cbiAgLy8gU2V0IHVwIHNvbWUga2V5IGNvbW1hbmRzXG4gIHNhbmRib3guZWRpdG9yLmFkZEFjdGlvbih7XG4gICAgaWQ6IFwiY29weS1jbGlwYm9hcmRcIixcbiAgICBsYWJlbDogXCJTYXZlIHRvIGNsaXBib2FyZFwiLFxuICAgIGtleWJpbmRpbmdzOiBbbW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvLktleUNvZGUuS0VZX1NdLFxuXG4gICAgY29udGV4dE1lbnVHcm91cElkOiBcInJ1blwiLFxuICAgIGNvbnRleHRNZW51T3JkZXI6IDEuNSxcblxuICAgIHJ1bjogZnVuY3Rpb24gKGVkKSB7XG4gICAgICB3aW5kb3cubmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobG9jYXRpb24uaHJlZi50b1N0cmluZygpKS50aGVuKFxuICAgICAgICAoKSA9PiB1aS5mbGFzaEluZm8oaShcInBsYXlfZXhwb3J0X2NsaXBib2FyZFwiKSksXG4gICAgICAgIChlOiBhbnkpID0+IGFsZXJ0KGUpXG4gICAgICApXG4gICAgfSxcbiAgfSlcblxuICBzYW5kYm94LmVkaXRvci5hZGRBY3Rpb24oe1xuICAgIGlkOiBcInJ1bi1qc1wiLFxuICAgIGxhYmVsOiBcIlJ1biB0aGUgZXZhbHVhdGVkIEphdmFTY3JpcHQgZm9yIHlvdXIgVHlwZVNjcmlwdCBmaWxlXCIsXG4gICAga2V5YmluZGluZ3M6IFttb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY28uS2V5Q29kZS5FbnRlcl0sXG5cbiAgICBjb250ZXh0TWVudUdyb3VwSWQ6IFwicnVuXCIsXG4gICAgY29udGV4dE1lbnVPcmRlcjogMS41LFxuXG4gICAgcnVuOiBmdW5jdGlvbiAoZWQpIHtcbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuLWJ1dHRvblwiKVxuICAgICAgcnVuQnV0dG9uICYmIHJ1bkJ1dHRvbi5vbmNsaWNrICYmIHJ1bkJ1dHRvbi5vbmNsaWNrKHt9IGFzIGFueSlcbiAgICB9LFxuICB9KVxuXG4gIGNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuLWJ1dHRvblwiKVxuICBpZiAocnVuQnV0dG9uKSB7XG4gICAgcnVuQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBydW4gPSBzYW5kYm94LmdldFJ1bm5hYmxlSlMoKVxuICAgICAgY29uc3QgcnVuUGx1Z2luID0gcGx1Z2lucy5maW5kKHAgPT4gcC5pZCA9PT0gXCJsb2dzXCIpIVxuICAgICAgYWN0aXZhdGVQbHVnaW4ocnVuUGx1Z2luLCBnZXRDdXJyZW50UGx1Z2luKCksIHNhbmRib3gsIHRhYkJhciwgY29udGFpbmVyKVxuXG4gICAgICBydW5XaXRoQ3VzdG9tTG9ncyhydW4sIGkpXG5cbiAgICAgIGNvbnN0IGlzSlMgPSBzYW5kYm94LmNvbmZpZy51c2VKYXZhU2NyaXB0XG4gICAgICB1aS5mbGFzaEluZm8oaShpc0pTID8gXCJwbGF5X3J1bl9qc1wiIDogXCJwbGF5X3J1bl90c1wiKSlcbiAgICB9XG4gIH1cblxuICAvLyBIYW5kbGUgdGhlIGNsb3NlIGJ1dHRvbnMgb24gdGhlIGV4YW1wbGVzXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b24uZXhhbXBsZXMtY2xvc2VcIikuZm9yRWFjaChiID0+IHtcbiAgICBjb25zdCBidXR0b24gPSBiIGFzIEhUTUxCdXR0b25FbGVtZW50XG4gICAgYnV0dG9uLm9uY2xpY2sgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBidXR0b24gPSBlLnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudFxuICAgICAgY29uc3QgbmF2TEkgPSBidXR0b24uY2xvc2VzdChcImxpXCIpXG4gICAgICBuYXZMST8uY2xhc3NMaXN0LnJlbW92ZShcIm9wZW5cIilcbiAgICB9XG4gIH0pXG5cbiAgc2V0dXBTaWRlYmFyVG9nZ2xlKClcblxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maWctY29udGFpbmVyXCIpKSB7XG4gICAgY3JlYXRlQ29uZmlnRHJvcGRvd24oc2FuZGJveCwgbW9uYWNvKVxuICAgIHVwZGF0ZUNvbmZpZ0Ryb3Bkb3duRm9yQ29tcGlsZXJPcHRpb25zKHNhbmRib3gsIG1vbmFjbylcbiAgfVxuXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlncm91bmQtc2V0dGluZ3NcIikpIHtcbiAgICBjb25zdCBzZXR0aW5nc1RvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWdyb3VuZC1zZXR0aW5nc1wiKSFcblxuICAgIHNldHRpbmdzVG9nZ2xlLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvcGVuID0gc2V0dGluZ3NUb2dnbGUucGFyZW50RWxlbWVudCEuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKVxuICAgICAgY29uc3Qgc2lkZWJhclRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXlncm91bmQtcGx1Z2luLXRhYnZpZXdcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICAgIGNvbnN0IHNpZGViYXJDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXBsdWdpbi1jb250YWluZXJcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICAgIGxldCBzZXR0aW5nc0NvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXlncm91bmQtc2V0dGluZ3MtY29udGFpbmVyXCIpIGFzIEhUTUxEaXZFbGVtZW50XG5cbiAgICAgIGlmICghc2V0dGluZ3NDb250ZW50KSB7XG4gICAgICAgIHNldHRpbmdzQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgc2V0dGluZ3NDb250ZW50LmNsYXNzTmFtZSA9IFwicGxheWdyb3VuZC1zZXR0aW5ncy1jb250YWluZXIgcGxheWdyb3VuZC1wbHVnaW4tY29udGFpbmVyXCJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBzZXR0aW5nc1BsdWdpbihpLCB1dGlscylcbiAgICAgICAgc2V0dGluZ3MuZGlkTW91bnQgJiYgc2V0dGluZ3MuZGlkTW91bnQoc2FuZGJveCwgc2V0dGluZ3NDb250ZW50KVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXlncm91bmQtc2lkZWJhclwiKSEuYXBwZW5kQ2hpbGQoc2V0dGluZ3NDb250ZW50KVxuXG4gICAgICAgIC8vIFdoZW4gdGhlIGxhc3QgdGFiIGl0ZW0gaXMgaGl0LCBnbyBiYWNrIHRvIHRoZSBzZXR0aW5ncyBidXR0b25cbiAgICAgICAgY29uc3QgbGFiZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGF5Z3JvdW5kLXNpZGViYXIgaW5wdXRcIilcbiAgICAgICAgY29uc3QgbGFzdExhYmVsID0gbGFiZWxzLml0ZW0obGFiZWxzLmxlbmd0aCAtIDEpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIGlmIChsYXN0TGFiZWwpIHtcbiAgICAgICAgICByZWRpcmVjdFRhYlByZXNzVG8obGFzdExhYmVsLCB1bmRlZmluZWQsIFwiI3BsYXlncm91bmQtc2V0dGluZ3NcIilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3Blbikge1xuICAgICAgICBzaWRlYmFyVGFicy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcbiAgICAgICAgc2lkZWJhckNvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICBzZXR0aW5nc0NvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaWRlYmFyVGFicy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICAgICAgc2lkZWJhckNvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgIHNldHRpbmdzQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgICAgIDsoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXIgbGFiZWxcIikgYXMgYW55KS5mb2N1cygpXG4gICAgICB9XG4gICAgICBzZXR0aW5nc1RvZ2dsZS5wYXJlbnRFbGVtZW50IS5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKVxuICAgIH1cbiAgfVxuXG4gIC8vIFN1cHBvcnQgZ3JhYmJpbmcgZXhhbXBsZXMgZnJvbSB0aGUgbG9jYXRpb24gaGFzaFxuICBpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKFwiI2V4YW1wbGVcIikpIHtcbiAgICBjb25zdCBleGFtcGxlTmFtZSA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZShcIiNleGFtcGxlL1wiLCBcIlwiKS50cmltKClcbiAgICBzYW5kYm94LmNvbmZpZy5sb2dnZXIubG9nKFwiTG9hZGluZyBleGFtcGxlOlwiLCBleGFtcGxlTmFtZSlcbiAgICBnZXRFeGFtcGxlU291cmNlQ29kZShjb25maWcucHJlZml4LCBjb25maWcubGFuZywgZXhhbXBsZU5hbWUpLnRoZW4oZXggPT4ge1xuICAgICAgaWYgKGV4LmV4YW1wbGUgJiYgZXguY29kZSkge1xuICAgICAgICBjb25zdCB7IGV4YW1wbGUsIGNvZGUgfSA9IGV4XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBsb2NhbHN0b3JhZ2Ugc2hvd2luZyB0aGF0IHlvdSd2ZSBzZWVuIHRoaXMgcGFnZVxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgY29uc3Qgc2VlblRleHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImV4YW1wbGVzLXNlZW5cIikgfHwgXCJ7fVwiXG4gICAgICAgICAgY29uc3Qgc2VlbiA9IEpTT04ucGFyc2Uoc2VlblRleHQpXG4gICAgICAgICAgc2VlbltleGFtcGxlLmlkXSA9IGV4YW1wbGUuaGFzaFxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZXhhbXBsZXMtc2VlblwiLCBKU09OLnN0cmluZ2lmeShzZWVuKSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGUgbWVudSB0byBiZSB0aGUgc2FtZSBzZWN0aW9uIGFzIHRoaXMgY3VycmVudCBleGFtcGxlXG4gICAgICAgIC8vIHRoaXMgaGFwcGVucyBiZWhpbmQgdGhlIHNjZW5lIGFuZCBpc24ndCB2aXNpYmxlIHRpbGwgeW91IGhvdmVyXG4gICAgICAgIC8vIGNvbnN0IHNlY3Rpb25UaXRsZSA9IGV4YW1wbGUucGF0aFswXVxuICAgICAgICAvLyBjb25zdCBhbGxTZWN0aW9uVGl0bGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VjdGlvbi1uYW1lJylcbiAgICAgICAgLy8gZm9yIChjb25zdCB0aXRsZSBvZiBhbGxTZWN0aW9uVGl0bGVzKSB7XG4gICAgICAgIC8vICAgaWYgKHRpdGxlLnRleHRDb250ZW50ID09PSBzZWN0aW9uVGl0bGUpIHtcbiAgICAgICAgLy8gICAgIHRpdGxlLm9uY2xpY2soe30pXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgYWxsTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiZXhhbXBsZS1saW5rXCIpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yIChjb25zdCBsaW5rIG9mIGFsbExpbmtzKSB7XG4gICAgICAgICAgaWYgKGxpbmsudGV4dENvbnRlbnQgPT09IGV4YW1wbGUudGl0bGUpIHtcbiAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodFwiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gXCJUeXBlU2NyaXB0IFBsYXlncm91bmQgLSBcIiArIGV4YW1wbGUudGl0bGVcbiAgICAgICAgc2FuZGJveC5zZXRUZXh0KGNvZGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYW5kYm94LnNldFRleHQoXCIvLyBUaGVyZSB3YXMgYW4gaXNzdWUgZ2V0dGluZyB0aGUgZXhhbXBsZSwgYmFkIFVSTD8gQ2hlY2sgdGhlIGNvbnNvbGUgaW4gdGhlIGRldmVsb3BlciB0b29sc1wiKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBTZXRzIHVwIGEgd2F5IHRvIGNsaWNrIGJldHdlZW4gZXhhbXBsZXNcbiAgbW9uYWNvLmxhbmd1YWdlcy5yZWdpc3RlckxpbmtQcm92aWRlcihzYW5kYm94Lmxhbmd1YWdlLCBuZXcgRXhhbXBsZUhpZ2hsaWdodGVyKCkpXG5cbiAgY29uc3QgbGFuZ3VhZ2VTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFuZ3VhZ2Utc2VsZWN0b3JcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnRcbiAgaWYgKGxhbmd1YWdlU2VsZWN0b3IpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaClcbiAgICBsYW5ndWFnZVNlbGVjdG9yLm9wdGlvbnMuc2VsZWN0ZWRJbmRleCA9IHBhcmFtcy5nZXQoXCJ1c2VKYXZhU2NyaXB0XCIpID8gMSA6IDBcblxuICAgIGxhbmd1YWdlU2VsZWN0b3Iub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VKYXZhU2NyaXB0ID0gbGFuZ3VhZ2VTZWxlY3Rvci52YWx1ZSA9PT0gXCJKYXZhU2NyaXB0XCJcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gc2FuZGJveC5jcmVhdGVVUkxRdWVyeVdpdGhDb21waWxlck9wdGlvbnMoc2FuZGJveCwge1xuICAgICAgICB1c2VKYXZhU2NyaXB0OiB1c2VKYXZhU2NyaXB0ID8gdHJ1ZSA6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBmdWxsVVJMID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly8ke2RvY3VtZW50LmxvY2F0aW9uLmhvc3R9JHtkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZX0ke3F1ZXJ5fWBcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uID0gZnVsbFVSTFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVpID0gY3JlYXRlVUkoKVxuICBjb25zdCBleHBvcnRlciA9IGNyZWF0ZUV4cG9ydGVyKHNhbmRib3gsIG1vbmFjbywgdWkpXG5cbiAgY29uc3QgcGxheWdyb3VuZCA9IHtcbiAgICBleHBvcnRlcixcbiAgICB1aSxcbiAgICByZWdpc3RlclBsdWdpbixcbiAgICBwbHVnaW5zLFxuICAgIGdldEN1cnJlbnRQbHVnaW4sXG4gICAgdGFicyxcbiAgICBzZXREaWRVcGRhdGVUYWIsXG4gIH1cblxuICB3aW5kb3cudHMgPSBzYW5kYm94LnRzXG4gIHdpbmRvdy5zYW5kYm94ID0gc2FuZGJveFxuICB3aW5kb3cucGxheWdyb3VuZCA9IHBsYXlncm91bmRcblxuICBjb25zb2xlLmxvZyhgVXNpbmcgVHlwZVNjcmlwdCAke3dpbmRvdy50cy52ZXJzaW9ufWApXG5cbiAgY29uc29sZS5sb2coXCJBdmFpbGFibGUgZ2xvYmFsczpcIilcbiAgY29uc29sZS5sb2coXCJcXHR3aW5kb3cudHNcIiwgd2luZG93LnRzKVxuICBjb25zb2xlLmxvZyhcIlxcdHdpbmRvdy5zYW5kYm94XCIsIHdpbmRvdy5zYW5kYm94KVxuICBjb25zb2xlLmxvZyhcIlxcdHdpbmRvdy5wbGF5Z3JvdW5kXCIsIHdpbmRvdy5wbGF5Z3JvdW5kKVxuICBjb25zb2xlLmxvZyhcIlxcdHdpbmRvdy5yZWFjdFwiLCB3aW5kb3cucmVhY3QpXG4gIGNvbnNvbGUubG9nKFwiXFx0d2luZG93LnJlYWN0RE9NXCIsIHdpbmRvdy5yZWFjdERPTSlcblxuICAvKiogQSBwbHVnaW4gKi9cbiAgY29uc3QgYWN0aXZhdGVFeHRlcm5hbFBsdWdpbiA9IChcbiAgICBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gfCAoKHV0aWxzOiBQbHVnaW5VdGlscykgPT4gUGxheWdyb3VuZFBsdWdpbiksXG4gICAgYXV0b0FjdGl2YXRlOiBib29sZWFuXG4gICkgPT4ge1xuICAgIGxldCByZWFkeVBsdWdpbjogUGxheWdyb3VuZFBsdWdpblxuICAgIC8vIENhbiBlaXRoZXIgYmUgYSBmYWN0b3J5LCBvciBvYmplY3RcbiAgICBpZiAodHlwZW9mIHBsdWdpbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBjb25zdCB1dGlscyA9IGNyZWF0ZVV0aWxzKHNhbmRib3gsIHJlYWN0KVxuICAgICAgcmVhZHlQbHVnaW4gPSBwbHVnaW4odXRpbHMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWR5UGx1Z2luID0gcGx1Z2luXG4gICAgfVxuXG4gICAgaWYgKGF1dG9BY3RpdmF0ZSkge1xuICAgICAgY29uc29sZS5sb2cocmVhZHlQbHVnaW4pXG4gICAgfVxuXG4gICAgcGxheWdyb3VuZC5yZWdpc3RlclBsdWdpbihyZWFkeVBsdWdpbilcblxuICAgIC8vIEF1dG8tc2VsZWN0IHRoZSBkZXYgcGx1Z2luXG4gICAgY29uc3QgcGx1Z2luV2FudHNGcm9udCA9IHJlYWR5UGx1Z2luLnNob3VsZEJlU2VsZWN0ZWQgJiYgcmVhZHlQbHVnaW4uc2hvdWxkQmVTZWxlY3RlZCgpXG5cbiAgICBpZiAocGx1Z2luV2FudHNGcm9udCB8fCBhdXRvQWN0aXZhdGUpIHtcbiAgICAgIC8vIEF1dG8tc2VsZWN0IHRoZSBkZXYgcGx1Z2luXG4gICAgICBhY3RpdmF0ZVBsdWdpbihyZWFkeVBsdWdpbiwgZ2V0Q3VycmVudFBsdWdpbigpLCBzYW5kYm94LCB0YWJCYXIsIGNvbnRhaW5lcilcbiAgICB9XG4gIH1cblxuICAvLyBEZXYgbW9kZSBwbHVnaW5cbiAgaWYgKGNvbmZpZy5zdXBwb3J0Q3VzdG9tUGx1Z2lucyAmJiBhbGxvd0Nvbm5lY3RpbmdUb0xvY2FsaG9zdCgpKSB7XG4gICAgd2luZG93LmV4cG9ydHMgPSB7fVxuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZyB0byBkZXYgcGx1Z2luXCIpXG4gICAgdHJ5IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IHJlID0gd2luZG93LnJlcXVpcmVcbiAgICAgIHJlKFtcImxvY2FsL2luZGV4XCJdLCAoZGV2UGx1Z2luOiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZXQgdXAgZGV2IHBsdWdpbiBmcm9tIGxvY2FsaG9zdDo1MDAwXCIpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aXZhdGVFeHRlcm5hbFBsdWdpbihkZXZQbHVnaW4sIHRydWUpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHVpLmZsYXNoSW5mbyhcIkVycm9yOiBDb3VsZCBub3QgbG9hZCBkZXYgcGx1Z2luIGZyb20gbG9jYWxob3N0OjUwMDBcIilcbiAgICAgICAgICB9LCA3MDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9ibGVtIGxvYWRpbmcgdXAgdGhlIGRldiBwbHVnaW5cIilcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgZG93bmxvYWRQbHVnaW4gPSAocGx1Z2luOiBzdHJpbmcsIGF1dG9FbmFibGU6IGJvb2xlYW4pID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgcmUgPSB3aW5kb3cucmVxdWlyZVxuICAgICAgcmUoW2B1bnBrZy8ke3BsdWdpbn1AbGF0ZXN0L2Rpc3QvaW5kZXhgXSwgKGRldlBsdWdpbjogUGxheWdyb3VuZFBsdWdpbikgPT4ge1xuICAgICAgICBhY3RpdmF0ZUV4dGVybmFsUGx1Z2luKGRldlBsdWdpbiwgYXV0b0VuYWJsZSlcbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJQcm9ibGVtIGxvYWRpbmcgdXAgdGhlIHBsdWdpbjpcIiwgcGx1Z2luKVxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLnN1cHBvcnRDdXN0b21QbHVnaW5zKSB7XG4gICAgLy8gR3JhYiBvbmVzIGZyb20gbG9jYWxzdG9yYWdlXG4gICAgYWN0aXZlUGx1Z2lucygpLmZvckVhY2gocCA9PiBkb3dubG9hZFBsdWdpbihwLm1vZHVsZSwgZmFsc2UpKVxuXG4gICAgLy8gT2ZmZXIgdG8gaW5zdGFsbCBvbmUgaWYgJ2luc3RhbGwtcGx1Z2luJyBpcyBhIHF1ZXJ5IHBhcmFtXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpXG4gICAgY29uc3QgcGx1Z2luVG9JbnN0YWxsID0gcGFyYW1zLmdldChcImluc3RhbGwtcGx1Z2luXCIpXG4gICAgaWYgKHBsdWdpblRvSW5zdGFsbCkge1xuICAgICAgY29uc3QgYWxyZWFkeUluc3RhbGxlZCA9IGFjdGl2ZVBsdWdpbnMoKS5maW5kKHAgPT4gcC5tb2R1bGUgPT09IHBsdWdpblRvSW5zdGFsbClcbiAgICAgIGlmICghYWxyZWFkeUluc3RhbGxlZCkge1xuICAgICAgICBjb25zdCBzaG91bGREb0l0ID0gY29uZmlybShcIldvdWxkIHlvdSBsaWtlIHRvIGluc3RhbGwgdGhlIHRoaXJkIHBhcnR5IHBsdWdpbj9cXG5cXG5cIiArIHBsdWdpblRvSW5zdGFsbClcbiAgICAgICAgaWYgKHNob3VsZERvSXQpIHtcbiAgICAgICAgICBhZGRDdXN0b21QbHVnaW4ocGx1Z2luVG9JbnN0YWxsKVxuICAgICAgICAgIGRvd25sb2FkUGx1Z2luKHBsdWdpblRvSW5zdGFsbCwgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoXCIjc2hvdy1leGFtcGxlc1wiKSkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJleGFtcGxlcy1idXR0b25cIik/LmNsaWNrKClcbiAgICB9LCAxMDApXG4gIH1cblxuICBpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKFwiI3Nob3ctd2hhdGlzbmV3XCIpKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndoYXRpc25ldy1idXR0b25cIik/LmNsaWNrKClcbiAgICB9LCAxMDApXG4gIH1cblxuICByZXR1cm4gcGxheWdyb3VuZFxufVxuXG5leHBvcnQgdHlwZSBQbGF5Z3JvdW5kID0gUmV0dXJuVHlwZTx0eXBlb2Ygc2V0dXBQbGF5Z3JvdW5kPlxuXG5jb25zdCByZWRpcmVjdFRhYlByZXNzVG8gPSAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQsIHF1ZXJ5OiBzdHJpbmcpID0+IHtcbiAgLy8gZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJlZFwiXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xuICAgICAgY29uc3QgaG9zdCA9IGNvbnRhaW5lciB8fCBkb2N1bWVudFxuICAgICAgY29uc3QgcmVzdWx0ID0gaG9zdC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSBhcyBhbnlcbiAgICAgIGlmICghcmVzdWx0KSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRvIGZpbmQgYSByZXN1bHQgZm9yIGtleWRvd25gKVxuICAgICAgcmVzdWx0LmZvY3VzKClcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgfSlcbn1cbiJdfQ==