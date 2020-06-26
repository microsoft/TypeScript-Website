define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDesignSystem = void 0;
    const el = (str, elementType, container) => {
        const el = document.createElement(elementType);
        el.innerHTML = str;
        container.appendChild(el);
        return el;
    };
    // The Playground Plugin design system
    exports.createDesignSystem = (sandbox) => {
        const ts = sandbox.ts;
        return (container) => {
            const clear = () => {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            };
            let decorations = [];
            let decorationLock = false;
            /** Lets a HTML Element hover to highlight code in the editor  */
            const addEditorHoverToElement = (element, pos, config) => {
                element.onmouseenter = () => {
                    if (!decorationLock) {
                        const model = sandbox.getModel();
                        const start = model.getPositionAt(pos.start);
                        const end = model.getPositionAt(pos.end);
                        decorations = sandbox.editor.deltaDecorations(decorations, [
                            {
                                range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                options: { inlineClassName: "highlight-" + config.type },
                            },
                        ]);
                    }
                };
                element.onmouseleave = () => {
                    if (!decorationLock) {
                        sandbox.editor.deltaDecorations(decorations, []);
                    }
                };
            };
            const declareRestartRequired = (i) => {
                if (document.getElementById("restart-required"))
                    return;
                const localize = i || window.i;
                const li = document.createElement("li");
                li.classList.add("disabled");
                li.id = "restart-required";
                const a = document.createElement("a");
                a.style.color = "#c63131";
                a.textContent = localize("play_sidebar_options_restart_required");
                const nav = document.getElementsByClassName("navbar-right")[0];
                li.appendChild(a);
                nav.insertBefore(li, nav.firstChild);
            };
            const localStorageOption = (setting) => {
                // Think about this as being something which you want enabled by default and can suppress whether
                // it should do something.
                const invertedLogic = setting.emptyImpliesEnabled;
                const li = document.createElement("li");
                const label = document.createElement("label");
                const split = setting.oneline ? "" : "<br/>";
                label.innerHTML = `<span>${setting.display}</span>${split}${setting.blurb}`;
                const key = setting.flag;
                const input = document.createElement("input");
                input.type = "checkbox";
                input.id = key;
                input.checked = invertedLogic ? !localStorage.getItem(key) : !!localStorage.getItem(key);
                input.onchange = () => {
                    if (input.checked) {
                        if (!invertedLogic)
                            localStorage.setItem(key, "true");
                        else
                            localStorage.removeItem(key);
                    }
                    else {
                        if (invertedLogic)
                            localStorage.setItem(key, "true");
                        else
                            localStorage.removeItem(key);
                    }
                    if (setting.onchange) {
                        setting.onchange(!!localStorage.getItem(key));
                    }
                    if (setting.requireRestart) {
                        declareRestartRequired();
                    }
                };
                label.htmlFor = input.id;
                li.appendChild(input);
                li.appendChild(label);
                container.appendChild(li);
                return li;
            };
            const button = (settings) => {
                const join = document.createElement("input");
                join.type = "button";
                join.value = settings.label;
                if (settings.onclick) {
                    join.onclick = settings.onclick;
                }
                container.appendChild(join);
                return join;
            };
            const code = (code) => {
                const createCodePre = document.createElement("pre");
                const codeElement = document.createElement("code");
                codeElement.innerHTML = code;
                createCodePre.appendChild(codeElement);
                container.appendChild(createCodePre);
                return codeElement;
            };
            const showEmptyScreen = (message) => {
                clear();
                const noErrorsMessage = document.createElement("div");
                noErrorsMessage.id = "empty-message-container";
                const messageDiv = document.createElement("div");
                messageDiv.textContent = message;
                messageDiv.classList.add("empty-plugin-message");
                noErrorsMessage.appendChild(messageDiv);
                container.appendChild(noErrorsMessage);
                return noErrorsMessage;
            };
            const createTabBar = () => {
                const tabBar = document.createElement("div");
                tabBar.classList.add("playground-plugin-tabview");
                /** Support left/right in the tab bar for accessibility */
                let tabFocus = 0;
                tabBar.addEventListener("keydown", e => {
                    const tabs = tabBar.querySelectorAll('[role="tab"]');
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
                container.appendChild(tabBar);
                return tabBar;
            };
            const createTabButton = (text) => {
                const element = document.createElement("button");
                element.setAttribute("role", "tab");
                element.textContent = text;
                return element;
            };
            const listDiags = (model, diags) => {
                const errorUL = document.createElement("ul");
                errorUL.className = "compiler-diagnostics";
                container.appendChild(errorUL);
                diags.forEach(diag => {
                    const li = document.createElement("li");
                    li.classList.add("diagnostic");
                    switch (diag.category) {
                        case 0:
                            li.classList.add("warning");
                            break;
                        case 1:
                            li.classList.add("error");
                            break;
                        case 2:
                            li.classList.add("suggestion");
                            break;
                        case 3:
                            li.classList.add("message");
                            break;
                    }
                    if (typeof diag === "string") {
                        li.textContent = diag;
                    }
                    else {
                        li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, "\n");
                    }
                    errorUL.appendChild(li);
                    if (diag.start && diag.length) {
                        addEditorHoverToElement(li, { start: diag.start, end: diag.start + diag.length }, { type: "error" });
                    }
                    li.onclick = () => {
                        if (diag.start && diag.length) {
                            const start = model.getPositionAt(diag.start);
                            sandbox.editor.revealLine(start.lineNumber);
                            const end = model.getPositionAt(diag.start + diag.length);
                            decorations = sandbox.editor.deltaDecorations(decorations, [
                                {
                                    range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                    options: { inlineClassName: "error-highlight", isWholeLine: true },
                                },
                            ]);
                            decorationLock = true;
                            setTimeout(() => {
                                decorationLock = false;
                                sandbox.editor.deltaDecorations(decorations, []);
                            }, 300);
                        }
                    };
                });
                return errorUL;
            };
            const showOptionList = (options, style) => {
                const ol = document.createElement("ol");
                ol.className = style.style === "separated" ? "playground-options" : "playground-options tight";
                options.forEach(option => {
                    if (style.style === "rows")
                        option.oneline = true;
                    if (style.requireRestart)
                        option.requireRestart = true;
                    const settingButton = localStorageOption(option);
                    ol.appendChild(settingButton);
                });
                container.appendChild(ol);
            };
            const createASTTree = (node) => {
                const div = document.createElement("div");
                div.className = "ast";
                const infoForNode = (node) => {
                    const name = ts.SyntaxKind[node.kind];
                    return {
                        name,
                    };
                };
                const renderLiteralField = (key, value, info) => {
                    const li = document.createElement("li");
                    const typeofSpan = `ast-node-${typeof value}`;
                    let suffix = "";
                    if (key === "kind") {
                        suffix = ` (SyntaxKind.${info.name})`;
                    }
                    li.innerHTML = `${key}: <span class='${typeofSpan}'>${value}</span>${suffix}`;
                    return li;
                };
                const renderSingleChild = (key, value, depth) => {
                    const li = document.createElement("li");
                    li.innerHTML = `${key}: `;
                    renderItem(li, value, depth + 1);
                    return li;
                };
                const renderManyChildren = (key, nodes, depth) => {
                    const childers = document.createElement("div");
                    childers.classList.add("ast-children");
                    const li = document.createElement("li");
                    li.innerHTML = `${key}: [<br/>`;
                    childers.appendChild(li);
                    nodes.forEach(node => {
                        renderItem(childers, node, depth + 1);
                    });
                    const liEnd = document.createElement("li");
                    liEnd.innerHTML += "]";
                    childers.appendChild(liEnd);
                    return childers;
                };
                const renderItem = (parentElement, node, depth) => {
                    const itemDiv = document.createElement("div");
                    parentElement.appendChild(itemDiv);
                    itemDiv.className = "ast-tree-start";
                    itemDiv.attributes.setNamedItem;
                    // @ts-expect-error
                    itemDiv.dataset.pos = node.pos;
                    // @ts-expect-error
                    itemDiv.dataset.end = node.end;
                    // @ts-expect-error
                    itemDiv.dataset.depth = depth;
                    if (depth === 0)
                        itemDiv.classList.add("open");
                    const info = infoForNode(node);
                    const a = document.createElement("a");
                    a.classList.add("node-name");
                    a.textContent = info.name;
                    itemDiv.appendChild(a);
                    a.onclick = _ => a.parentElement.classList.toggle("open");
                    addEditorHoverToElement(a, { start: node.pos, end: node.end }, { type: "info" });
                    const properties = document.createElement("ul");
                    properties.className = "ast-tree";
                    itemDiv.appendChild(properties);
                    Object.keys(node).forEach(field => {
                        if (typeof field === "function")
                            return;
                        if (field === "parent" || field === "flowNode")
                            return;
                        const value = node[field];
                        if (typeof value === "object" && Array.isArray(value) && value[0] && "pos" in value[0] && "end" in value[0]) {
                            //  Is an array of Nodes
                            properties.appendChild(renderManyChildren(field, value, depth));
                        }
                        else if (typeof value === "object" && "pos" in value && "end" in value) {
                            // Is a single child property
                            properties.appendChild(renderSingleChild(field, value, depth));
                        }
                        else {
                            properties.appendChild(renderLiteralField(field, value, info));
                        }
                    });
                };
                renderItem(div, node, 0);
                container.append(div);
                return div;
            };
            const createTextInput = (config) => {
                const form = document.createElement("form");
                const textbox = document.createElement("input");
                textbox.id = config.id;
                textbox.placeholder = config.placeholder;
                textbox.autocomplete = "off";
                textbox.autocapitalize = "off";
                textbox.spellcheck = false;
                // @ts-ignore
                textbox.autocorrect = "off";
                const localStorageKey = "playground-input-" + config.id;
                if (config.value) {
                    textbox.value = config.value;
                }
                else if (config.keepValueAcrossReloads) {
                    const storedQuery = localStorage.getItem(localStorageKey);
                    if (storedQuery)
                        textbox.value = storedQuery;
                }
                if (config.isEnabled) {
                    const enabled = config.isEnabled(textbox);
                    textbox.classList.add(enabled ? "good" : "bad");
                }
                else {
                    textbox.classList.add("good");
                }
                const textUpdate = (e) => {
                    const href = e.target.value.trim();
                    if (config.keepValueAcrossReloads) {
                        localStorage.setItem(localStorageKey, href);
                    }
                    if (config.onChanged)
                        config.onChanged(e.target.value, textbox);
                };
                textbox.style.width = "90%";
                textbox.style.height = "2rem";
                textbox.addEventListener("input", textUpdate);
                // Suppress the enter key
                textbox.onkeydown = (evt) => {
                    if (evt.keyCode == 13) {
                        return false;
                    }
                };
                form.appendChild(textbox);
                container.appendChild(form);
                return form;
            };
            return {
                /** Clear the sidebar */
                clear,
                /** Present code in a pre > code  */
                code,
                /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
                title: (title) => el(title, "h3", container),
                /** Used to denote sections, give info etc */
                subtitle: (subtitle) => el(subtitle, "h4", container),
                /** Used to show a paragraph */
                p: (subtitle) => el(subtitle, "p", container),
                /** When you can't do something, or have nothing to show */
                showEmptyScreen,
                /**
                 * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
                 * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
                 */
                listDiags,
                /** Shows a single option in local storage (adds an li to the container BTW) */
                localStorageOption,
                /** Uses localStorageOption to create a list of options */
                showOptionList,
                /** Shows a full-width text input */
                createTextInput,
                /** Renders an AST tree */
                createASTTree,
                /** Creates an input button */
                button,
                /** Used to re-create a UI like the tab bar at the top of the plugins section */
                createTabBar,
                /** Used with createTabBar to add buttons */
                createTabButton,
                /** A general "restart your browser" message  */
                declareRestartRequired,
            };
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVzaWduU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvZHMvY3JlYXRlRGVzaWduU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFtQkEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsV0FBbUIsRUFBRSxTQUFrQixFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM5QyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQTtRQUNsQixTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3pCLE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQyxDQUFBO0lBRUQsc0NBQXNDO0lBQ3pCLFFBQUEsa0JBQWtCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDckQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQTtRQUVyQixPQUFPLENBQUMsU0FBa0IsRUFBRSxFQUFFO1lBQzVCLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtnQkFDakIsT0FBTyxTQUFTLENBQUMsVUFBVSxFQUFFO29CQUMzQixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtpQkFDNUM7WUFDSCxDQUFDLENBQUE7WUFDRCxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUE7WUFDOUIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFBO1lBRTFCLGlFQUFpRTtZQUNqRSxNQUFNLHVCQUF1QixHQUFHLENBQzlCLE9BQW9CLEVBQ3BCLEdBQW1DLEVBQ25DLE1BQWtDLEVBQ2xDLEVBQUU7Z0JBQ0YsT0FBTyxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ25CLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0bGFuZy1vcmcvc3RhdGljL2pzL3NhbmRib3hcIlxuaW1wb3J0IHR5cGUgeyBEaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uLCBOb2RlIH0gZnJvbSBcInR5cGVzY3JpcHRcIlxuXG5leHBvcnQgdHlwZSBMb2NhbFN0b3JhZ2VPcHRpb24gPSB7XG4gIGJsdXJiOiBzdHJpbmdcbiAgZmxhZzogc3RyaW5nXG4gIGRpc3BsYXk6IHN0cmluZ1xuXG4gIGVtcHR5SW1wbGllc0VuYWJsZWQ/OiB0cnVlXG4gIG9uZWxpbmU/OiB0cnVlXG4gIHJlcXVpcmVSZXN0YXJ0PzogdHJ1ZVxuICBvbmNoYW5nZT86IChuZXdWYWx1ZTogYm9vbGVhbikgPT4gdm9pZFxufVxuXG5leHBvcnQgdHlwZSBPcHRpb25zTGlzdENvbmZpZyA9IHtcbiAgc3R5bGU6IFwic2VwYXJhdGVkXCIgfCBcInJvd3NcIlxuICByZXF1aXJlUmVzdGFydD86IHRydWVcbn1cblxuY29uc3QgZWwgPSAoc3RyOiBzdHJpbmcsIGVsZW1lbnRUeXBlOiBzdHJpbmcsIGNvbnRhaW5lcjogRWxlbWVudCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpXG4gIGVsLmlubmVySFRNTCA9IHN0clxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbFxufVxuXG4vLyBUaGUgUGxheWdyb3VuZCBQbHVnaW4gZGVzaWduIHN5c3RlbVxuZXhwb3J0IGNvbnN0IGNyZWF0ZURlc2lnblN5c3RlbSA9IChzYW5kYm94OiBTYW5kYm94KSA9PiB7XG4gIGNvbnN0IHRzID0gc2FuZGJveC50c1xuXG4gIHJldHVybiAoY29udGFpbmVyOiBFbGVtZW50KSA9PiB7XG4gICAgY29uc3QgY2xlYXIgPSAoKSA9PiB7XG4gICAgICB3aGlsZSAoY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5maXJzdENoaWxkKVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZGVjb3JhdGlvbnM6IHN0cmluZ1tdID0gW11cbiAgICBsZXQgZGVjb3JhdGlvbkxvY2sgPSBmYWxzZVxuXG4gICAgLyoqIExldHMgYSBIVE1MIEVsZW1lbnQgaG92ZXIgdG8gaGlnaGxpZ2h0IGNvZGUgaW4gdGhlIGVkaXRvciAgKi9cbiAgICBjb25zdCBhZGRFZGl0b3JIb3ZlclRvRWxlbWVudCA9IChcbiAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgcG9zOiB7IHN0YXJ0OiBudW1iZXI7IGVuZDogbnVtYmVyIH0sXG4gICAgICBjb25maWc6IHsgdHlwZTogXCJlcnJvclwiIHwgXCJpbmZvXCIgfVxuICAgICkgPT4ge1xuICAgICAgZWxlbWVudC5vbm1vdXNlZW50ZXIgPSAoKSA9PiB7XG4gICAgICAgIGlmICghZGVjb3JhdGlvbkxvY2spIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHNhbmRib3guZ2V0TW9kZWwoKVxuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbW9kZWwuZ2V0UG9zaXRpb25BdChwb3Muc3RhcnQpXG4gICAgICAgICAgY29uc3QgZW5kID0gbW9kZWwuZ2V0UG9zaXRpb25BdChwb3MuZW5kKVxuICAgICAgICAgIGRlY29yYXRpb25zID0gc2FuZGJveC5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhkZWNvcmF0aW9ucywgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYW5nZTogbmV3IHNhbmRib3gubW9uYWNvLlJhbmdlKHN0YXJ0LmxpbmVOdW1iZXIsIHN0YXJ0LmNvbHVtbiwgZW5kLmxpbmVOdW1iZXIsIGVuZC5jb2x1bW4pLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7IGlubGluZUNsYXNzTmFtZTogXCJoaWdobGlnaHQtXCIgKyBjb25maWcudHlwZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQub25tb3VzZWxlYXZlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWRlY29yYXRpb25Mb2NrKSB7XG4gICAgICAgICAgc2FuZGJveC5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhkZWNvcmF0aW9ucywgW10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkZWNsYXJlUmVzdGFydFJlcXVpcmVkID0gKGk/OiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGFydC1yZXF1aXJlZFwiKSkgcmV0dXJuXG4gICAgICBjb25zdCBsb2NhbGl6ZSA9IGkgfHwgKHdpbmRvdyBhcyBhbnkpLmlcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICBsaS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIilcbiAgICAgIGxpLmlkID0gXCJyZXN0YXJ0LXJlcXVpcmVkXCJcbiAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgICAgYS5zdHlsZS5jb2xvciA9IFwiI2M2MzEzMVwiXG4gICAgICBhLnRleHRDb250ZW50ID0gbG9jYWxpemUoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19yZXN0YXJ0X3JlcXVpcmVkXCIpXG5cbiAgICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYXZiYXItcmlnaHRcIilbMF1cbiAgICAgIGxpLmFwcGVuZENoaWxkKGEpXG4gICAgICBuYXYuaW5zZXJ0QmVmb3JlKGxpLCBuYXYuZmlyc3RDaGlsZClcbiAgICB9XG5cbiAgICBjb25zdCBsb2NhbFN0b3JhZ2VPcHRpb24gPSAoc2V0dGluZzogTG9jYWxTdG9yYWdlT3B0aW9uKSA9PiB7XG4gICAgICAvLyBUaGluayBhYm91dCB0aGlzIGFzIGJlaW5nIHNvbWV0aGluZyB3aGljaCB5b3Ugd2FudCBlbmFibGVkIGJ5IGRlZmF1bHQgYW5kIGNhbiBzdXBwcmVzcyB3aGV0aGVyXG4gICAgICAvLyBpdCBzaG91bGQgZG8gc29tZXRoaW5nLlxuICAgICAgY29uc3QgaW52ZXJ0ZWRMb2dpYyA9IHNldHRpbmcuZW1wdHlJbXBsaWVzRW5hYmxlZFxuXG4gICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIilcbiAgICAgIGNvbnN0IHNwbGl0ID0gc2V0dGluZy5vbmVsaW5lID8gXCJcIiA6IFwiPGJyLz5cIlxuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gYDxzcGFuPiR7c2V0dGluZy5kaXNwbGF5fTwvc3Bhbj4ke3NwbGl0fSR7c2V0dGluZy5ibHVyYn1gXG5cbiAgICAgIGNvbnN0IGtleSA9IHNldHRpbmcuZmxhZ1xuICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCJcbiAgICAgIGlucHV0LmlkID0ga2V5XG5cbiAgICAgIGlucHV0LmNoZWNrZWQgPSBpbnZlcnRlZExvZ2ljID8gIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkgOiAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcblxuICAgICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgaWYgKCFpbnZlcnRlZExvZ2ljKSBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIFwidHJ1ZVwiKVxuICAgICAgICAgIGVsc2UgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbnZlcnRlZExvZ2ljKSBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIFwidHJ1ZVwiKVxuICAgICAgICAgIGVsc2UgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldHRpbmcub25jaGFuZ2UpIHtcbiAgICAgICAgICBzZXR0aW5nLm9uY2hhbmdlKCEhbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZy5yZXF1aXJlUmVzdGFydCkge1xuICAgICAgICAgIGRlY2xhcmVSZXN0YXJ0UmVxdWlyZWQoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxhYmVsLmh0bWxGb3IgPSBpbnB1dC5pZFxuXG4gICAgICBsaS5hcHBlbmRDaGlsZChpbnB1dClcbiAgICAgIGxpLmFwcGVuZENoaWxkKGxhYmVsKVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuICAgICAgcmV0dXJuIGxpXG4gICAgfVxuXG4gICAgY29uc3QgYnV0dG9uID0gKHNldHRpbmdzOiB7IGxhYmVsOiBzdHJpbmc7IG9uY2xpY2s/OiAoZXY6IE1vdXNlRXZlbnQpID0+IHZvaWQgfSkgPT4ge1xuICAgICAgY29uc3Qgam9pbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgam9pbi50eXBlID0gXCJidXR0b25cIlxuICAgICAgam9pbi52YWx1ZSA9IHNldHRpbmdzLmxhYmVsXG4gICAgICBpZiAoc2V0dGluZ3Mub25jbGljaykge1xuICAgICAgICBqb2luLm9uY2xpY2sgPSBzZXR0aW5ncy5vbmNsaWNrXG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChqb2luKVxuICAgICAgcmV0dXJuIGpvaW5cbiAgICB9XG5cbiAgICBjb25zdCBjb2RlID0gKGNvZGU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgY3JlYXRlQ29kZVByZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIilcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNvZGVcIilcblxuICAgICAgY29kZUVsZW1lbnQuaW5uZXJIVE1MID0gY29kZVxuXG4gICAgICBjcmVhdGVDb2RlUHJlLmFwcGVuZENoaWxkKGNvZGVFbGVtZW50KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUNvZGVQcmUpXG5cbiAgICAgIHJldHVybiBjb2RlRWxlbWVudFxuICAgIH1cblxuICAgIGNvbnN0IHNob3dFbXB0eVNjcmVlbiA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNsZWFyKClcblxuICAgICAgY29uc3Qgbm9FcnJvcnNNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgbm9FcnJvcnNNZXNzYWdlLmlkID0gXCJlbXB0eS1tZXNzYWdlLWNvbnRhaW5lclwiXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBtZXNzYWdlRGl2LnRleHRDb250ZW50ID0gbWVzc2FnZVxuICAgICAgbWVzc2FnZURpdi5jbGFzc0xpc3QuYWRkKFwiZW1wdHktcGx1Z2luLW1lc3NhZ2VcIilcbiAgICAgIG5vRXJyb3JzTWVzc2FnZS5hcHBlbmRDaGlsZChtZXNzYWdlRGl2KVxuXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9FcnJvcnNNZXNzYWdlKVxuICAgICAgcmV0dXJuIG5vRXJyb3JzTWVzc2FnZVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVRhYkJhciA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIHRhYkJhci5jbGFzc0xpc3QuYWRkKFwicGxheWdyb3VuZC1wbHVnaW4tdGFidmlld1wiKVxuXG4gICAgICAvKiogU3VwcG9ydCBsZWZ0L3JpZ2h0IGluIHRoZSB0YWIgYmFyIGZvciBhY2Nlc3NpYmlsaXR5ICovXG4gICAgICBsZXQgdGFiRm9jdXMgPSAwXG4gICAgICB0YWJCYXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSB0YWJCYXIucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJcIl0nKVxuICAgICAgICAvLyBNb3ZlIHJpZ2h0XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM5IHx8IGUua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgICAgICB0YWJzW3RhYkZvY3VzXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpXG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgICAgICAgIHRhYkZvY3VzKytcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIGF0IHRoZSBlbmQsIGdvIHRvIHRoZSBzdGFydFxuICAgICAgICAgICAgaWYgKHRhYkZvY3VzID49IHRhYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRhYkZvY3VzID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTW92ZSBsZWZ0XG4gICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XG4gICAgICAgICAgICB0YWJGb2N1cy0tXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBhdCB0aGUgc3RhcnQsIG1vdmUgdG8gdGhlIGVuZFxuICAgICAgICAgICAgaWYgKHRhYkZvY3VzIDwgMCkge1xuICAgICAgICAgICAgICB0YWJGb2N1cyA9IHRhYnMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhYnNbdGFiRm9jdXNdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKVxuICAgICAgICAgIDsodGFic1t0YWJGb2N1c10gYXMgYW55KS5mb2N1cygpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWJCYXIpXG4gICAgICByZXR1cm4gdGFiQmFyXG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlVGFiQnV0dG9uID0gKHRleHQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKVxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHRcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdERpYWdzID0gKG1vZGVsOiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLmVkaXRvci5JVGV4dE1vZGVsLCBkaWFnczogRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbltdKSA9PiB7XG4gICAgICBjb25zdCBlcnJvclVMID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpXG4gICAgICBlcnJvclVMLmNsYXNzTmFtZSA9IFwiY29tcGlsZXItZGlhZ25vc3RpY3NcIlxuXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZXJyb3JVTClcblxuICAgICAgZGlhZ3MuZm9yRWFjaChkaWFnID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcImRpYWdub3N0aWNcIilcbiAgICAgICAgc3dpdGNoIChkaWFnLmNhdGVnb3J5KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJzdWdnZXN0aW9uXCIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJtZXNzYWdlXCIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkaWFnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgbGkudGV4dENvbnRlbnQgPSBkaWFnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGkudGV4dENvbnRlbnQgPSBzYW5kYm94LnRzLmZsYXR0ZW5EaWFnbm9zdGljTWVzc2FnZVRleHQoZGlhZy5tZXNzYWdlVGV4dCwgXCJcXG5cIilcbiAgICAgICAgfVxuICAgICAgICBlcnJvclVMLmFwcGVuZENoaWxkKGxpKVxuXG4gICAgICAgIGlmIChkaWFnLnN0YXJ0ICYmIGRpYWcubGVuZ3RoKSB7XG4gICAgICAgICAgYWRkRWRpdG9ySG92ZXJUb0VsZW1lbnQobGksIHsgc3RhcnQ6IGRpYWcuc3RhcnQsIGVuZDogZGlhZy5zdGFydCArIGRpYWcubGVuZ3RoIH0sIHsgdHlwZTogXCJlcnJvclwiIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsaS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChkaWFnLnN0YXJ0ICYmIGRpYWcubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IG1vZGVsLmdldFBvc2l0aW9uQXQoZGlhZy5zdGFydClcbiAgICAgICAgICAgIHNhbmRib3guZWRpdG9yLnJldmVhbExpbmUoc3RhcnQubGluZU51bWJlcilcblxuICAgICAgICAgICAgY29uc3QgZW5kID0gbW9kZWwuZ2V0UG9zaXRpb25BdChkaWFnLnN0YXJ0ICsgZGlhZy5sZW5ndGgpXG4gICAgICAgICAgICBkZWNvcmF0aW9ucyA9IHNhbmRib3guZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoZGVjb3JhdGlvbnMsIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlOiBuZXcgc2FuZGJveC5tb25hY28uUmFuZ2Uoc3RhcnQubGluZU51bWJlciwgc3RhcnQuY29sdW1uLCBlbmQubGluZU51bWJlciwgZW5kLmNvbHVtbiksXG4gICAgICAgICAgICAgICAgb3B0aW9uczogeyBpbmxpbmVDbGFzc05hbWU6IFwiZXJyb3ItaGlnaGxpZ2h0XCIsIGlzV2hvbGVMaW5lOiB0cnVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICBkZWNvcmF0aW9uTG9jayA9IHRydWVcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBkZWNvcmF0aW9uTG9jayA9IGZhbHNlXG4gICAgICAgICAgICAgIHNhbmRib3guZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoZGVjb3JhdGlvbnMsIFtdKVxuICAgICAgICAgICAgfSwgMzAwKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBlcnJvclVMXG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd09wdGlvbkxpc3QgPSAob3B0aW9uczogTG9jYWxTdG9yYWdlT3B0aW9uW10sIHN0eWxlOiBPcHRpb25zTGlzdENvbmZpZykgPT4ge1xuICAgICAgY29uc3Qgb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib2xcIilcbiAgICAgIG9sLmNsYXNzTmFtZSA9IHN0eWxlLnN0eWxlID09PSBcInNlcGFyYXRlZFwiID8gXCJwbGF5Z3JvdW5kLW9wdGlvbnNcIiA6IFwicGxheWdyb3VuZC1vcHRpb25zIHRpZ2h0XCJcblxuICAgICAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgIGlmIChzdHlsZS5zdHlsZSA9PT0gXCJyb3dzXCIpIG9wdGlvbi5vbmVsaW5lID0gdHJ1ZVxuICAgICAgICBpZiAoc3R5bGUucmVxdWlyZVJlc3RhcnQpIG9wdGlvbi5yZXF1aXJlUmVzdGFydCA9IHRydWVcblxuICAgICAgICBjb25zdCBzZXR0aW5nQnV0dG9uID0gbG9jYWxTdG9yYWdlT3B0aW9uKG9wdGlvbilcbiAgICAgICAgb2wuYXBwZW5kQ2hpbGQoc2V0dGluZ0J1dHRvbilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChvbClcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVBU1RUcmVlID0gKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIGRpdi5jbGFzc05hbWUgPSBcImFzdFwiXG5cbiAgICAgIGNvbnN0IGluZm9Gb3JOb2RlID0gKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRzLlN5bnRheEtpbmRbbm9kZS5raW5kXVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0eXBlIE5vZGVJbmZvID0gUmV0dXJuVHlwZTx0eXBlb2YgaW5mb0Zvck5vZGU+XG5cbiAgICAgIGNvbnN0IHJlbmRlckxpdGVyYWxGaWVsZCA9IChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgaW5mbzogTm9kZUluZm8pID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgY29uc3QgdHlwZW9mU3BhbiA9IGBhc3Qtbm9kZS0ke3R5cGVvZiB2YWx1ZX1gXG4gICAgICAgIGxldCBzdWZmaXggPSBcIlwiXG4gICAgICAgIGlmIChrZXkgPT09IFwia2luZFwiKSB7XG4gICAgICAgICAgc3VmZml4ID0gYCAoU3ludGF4S2luZC4ke2luZm8ubmFtZX0pYFxuICAgICAgICB9XG4gICAgICAgIGxpLmlubmVySFRNTCA9IGAke2tleX06IDxzcGFuIGNsYXNzPScke3R5cGVvZlNwYW59Jz4ke3ZhbHVlfTwvc3Bhbj4ke3N1ZmZpeH1gXG4gICAgICAgIHJldHVybiBsaVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZW5kZXJTaW5nbGVDaGlsZCA9IChrZXk6IHN0cmluZywgdmFsdWU6IE5vZGUsIGRlcHRoOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gYCR7a2V5fTogYFxuXG4gICAgICAgIHJlbmRlckl0ZW0obGksIHZhbHVlLCBkZXB0aCArIDEpXG4gICAgICAgIHJldHVybiBsaVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZW5kZXJNYW55Q2hpbGRyZW4gPSAoa2V5OiBzdHJpbmcsIG5vZGVzOiBOb2RlW10sIGRlcHRoOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRlcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgIGNoaWxkZXJzLmNsYXNzTGlzdC5hZGQoXCJhc3QtY2hpbGRyZW5cIilcblxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICBsaS5pbm5lckhUTUwgPSBgJHtrZXl9OiBbPGJyLz5gXG4gICAgICAgIGNoaWxkZXJzLmFwcGVuZENoaWxkKGxpKVxuXG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgcmVuZGVySXRlbShjaGlsZGVycywgbm9kZSwgZGVwdGggKyAxKVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IGxpRW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgIGxpRW5kLmlubmVySFRNTCArPSBcIl1cIlxuICAgICAgICBjaGlsZGVycy5hcHBlbmRDaGlsZChsaUVuZClcbiAgICAgICAgcmV0dXJuIGNoaWxkZXJzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbmRlckl0ZW0gPSAocGFyZW50RWxlbWVudDogRWxlbWVudCwgbm9kZTogTm9kZSwgZGVwdGg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBpdGVtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGl0ZW1EaXYpXG4gICAgICAgIGl0ZW1EaXYuY2xhc3NOYW1lID0gXCJhc3QtdHJlZS1zdGFydFwiXG4gICAgICAgIGl0ZW1EaXYuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBpdGVtRGl2LmRhdGFzZXQucG9zID0gbm9kZS5wb3NcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBpdGVtRGl2LmRhdGFzZXQuZW5kID0gbm9kZS5lbmRcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBpdGVtRGl2LmRhdGFzZXQuZGVwdGggPSBkZXB0aFxuXG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkgaXRlbURpdi5jbGFzc0xpc3QuYWRkKFwib3BlblwiKVxuXG4gICAgICAgIGNvbnN0IGluZm8gPSBpbmZvRm9yTm9kZShub2RlKVxuXG4gICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgICAgICBhLmNsYXNzTGlzdC5hZGQoXCJub2RlLW5hbWVcIilcbiAgICAgICAgYS50ZXh0Q29udGVudCA9IGluZm8ubmFtZVxuICAgICAgICBpdGVtRGl2LmFwcGVuZENoaWxkKGEpXG4gICAgICAgIGEub25jbGljayA9IF8gPT4gYS5wYXJlbnRFbGVtZW50IS5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKVxuICAgICAgICBhZGRFZGl0b3JIb3ZlclRvRWxlbWVudChhLCB7IHN0YXJ0OiBub2RlLnBvcywgZW5kOiBub2RlLmVuZCB9LCB7IHR5cGU6IFwiaW5mb1wiIH0pXG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKVxuICAgICAgICBwcm9wZXJ0aWVzLmNsYXNzTmFtZSA9IFwiYXN0LXRyZWVcIlxuICAgICAgICBpdGVtRGl2LmFwcGVuZENoaWxkKHByb3BlcnRpZXMpXG5cbiAgICAgICAgT2JqZWN0LmtleXMobm9kZSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm5cbiAgICAgICAgICBpZiAoZmllbGQgPT09IFwicGFyZW50XCIgfHwgZmllbGQgPT09IFwiZmxvd05vZGVcIikgcmV0dXJuXG5cbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IChub2RlIGFzIGFueSlbZmllbGRdXG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZVswXSAmJiBcInBvc1wiIGluIHZhbHVlWzBdICYmIFwiZW5kXCIgaW4gdmFsdWVbMF0pIHtcbiAgICAgICAgICAgIC8vICBJcyBhbiBhcnJheSBvZiBOb2Rlc1xuICAgICAgICAgICAgcHJvcGVydGllcy5hcHBlbmRDaGlsZChyZW5kZXJNYW55Q2hpbGRyZW4oZmllbGQsIHZhbHVlLCBkZXB0aCkpXG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgXCJwb3NcIiBpbiB2YWx1ZSAmJiBcImVuZFwiIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyBJcyBhIHNpbmdsZSBjaGlsZCBwcm9wZXJ0eVxuICAgICAgICAgICAgcHJvcGVydGllcy5hcHBlbmRDaGlsZChyZW5kZXJTaW5nbGVDaGlsZChmaWVsZCwgdmFsdWUsIGRlcHRoKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydGllcy5hcHBlbmRDaGlsZChyZW5kZXJMaXRlcmFsRmllbGQoZmllbGQsIHZhbHVlLCBpbmZvKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJlbmRlckl0ZW0oZGl2LCBub2RlLCAwKVxuICAgICAgY29udGFpbmVyLmFwcGVuZChkaXYpXG4gICAgICByZXR1cm4gZGl2XG4gICAgfVxuXG4gICAgdHlwZSBUZXh0SW5wdXRDb25maWcgPSB7XG4gICAgICBpZDogc3RyaW5nXG4gICAgICBwbGFjZWhvbGRlcjogc3RyaW5nXG5cbiAgICAgIG9uQ2hhbmdlZD86ICh0ZXh0OiBzdHJpbmcsIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50KSA9PiB2b2lkXG4gICAgICBvbkVudGVyOiAodGV4dDogc3RyaW5nLCBpbnB1dDogSFRNTElucHV0RWxlbWVudCkgPT4gdm9pZFxuXG4gICAgICB2YWx1ZT86IHN0cmluZ1xuICAgICAga2VlcFZhbHVlQWNyb3NzUmVsb2Fkcz86IHRydWVcbiAgICAgIGlzRW5hYmxlZD86IChpbnB1dDogSFRNTElucHV0RWxlbWVudCkgPT4gYm9vbGVhblxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVRleHRJbnB1dCA9IChjb25maWc6IFRleHRJbnB1dENvbmZpZykgPT4ge1xuICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpXG5cbiAgICAgIGNvbnN0IHRleHRib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcbiAgICAgIHRleHRib3guaWQgPSBjb25maWcuaWRcbiAgICAgIHRleHRib3gucGxhY2Vob2xkZXIgPSBjb25maWcucGxhY2Vob2xkZXJcbiAgICAgIHRleHRib3guYXV0b2NvbXBsZXRlID0gXCJvZmZcIlxuICAgICAgdGV4dGJveC5hdXRvY2FwaXRhbGl6ZSA9IFwib2ZmXCJcbiAgICAgIHRleHRib3guc3BlbGxjaGVjayA9IGZhbHNlXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0ZXh0Ym94LmF1dG9jb3JyZWN0ID0gXCJvZmZcIlxuXG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSBcInBsYXlncm91bmQtaW5wdXQtXCIgKyBjb25maWcuaWRcblxuICAgICAgaWYgKGNvbmZpZy52YWx1ZSkge1xuICAgICAgICB0ZXh0Ym94LnZhbHVlID0gY29uZmlnLnZhbHVlXG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZy5rZWVwVmFsdWVBY3Jvc3NSZWxvYWRzKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlZFF1ZXJ5ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlS2V5KVxuICAgICAgICBpZiAoc3RvcmVkUXVlcnkpIHRleHRib3gudmFsdWUgPSBzdG9yZWRRdWVyeVxuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLmlzRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBlbmFibGVkID0gY29uZmlnLmlzRW5hYmxlZCh0ZXh0Ym94KVxuICAgICAgICB0ZXh0Ym94LmNsYXNzTGlzdC5hZGQoZW5hYmxlZCA/IFwiZ29vZFwiIDogXCJiYWRcIilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRib3guY2xhc3NMaXN0LmFkZChcImdvb2RcIilcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGV4dFVwZGF0ZSA9IChlOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgaHJlZiA9IGUudGFyZ2V0LnZhbHVlLnRyaW0oKVxuICAgICAgICBpZiAoY29uZmlnLmtlZXBWYWx1ZUFjcm9zc1JlbG9hZHMpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VLZXksIGhyZWYpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5vbkNoYW5nZWQpIGNvbmZpZy5vbkNoYW5nZWQoZS50YXJnZXQudmFsdWUsIHRleHRib3gpXG4gICAgICB9XG5cbiAgICAgIHRleHRib3guc3R5bGUud2lkdGggPSBcIjkwJVwiXG4gICAgICB0ZXh0Ym94LnN0eWxlLmhlaWdodCA9IFwiMnJlbVwiXG4gICAgICB0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCB0ZXh0VXBkYXRlKVxuXG4gICAgICAvLyBTdXBwcmVzcyB0aGUgZW50ZXIga2V5XG4gICAgICB0ZXh0Ym94Lm9ua2V5ZG93biA9IChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9ybS5hcHBlbmRDaGlsZCh0ZXh0Ym94KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm0pXG4gICAgICByZXR1cm4gZm9ybVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAvKiogQ2xlYXIgdGhlIHNpZGViYXIgKi9cbiAgICAgIGNsZWFyLFxuICAgICAgLyoqIFByZXNlbnQgY29kZSBpbiBhIHByZSA+IGNvZGUgICovXG4gICAgICBjb2RlLFxuICAgICAgLyoqIElkZWFsbHkgb25seSB1c2UgdGhpcyBvbmNlLCBhbmQgbWF5YmUgZXZlbiBwcmVmZXIgdXNpbmcgc3VidGl0bGVzIGV2ZXJ5d2hlcmUgKi9cbiAgICAgIHRpdGxlOiAodGl0bGU6IHN0cmluZykgPT4gZWwodGl0bGUsIFwiaDNcIiwgY29udGFpbmVyKSxcbiAgICAgIC8qKiBVc2VkIHRvIGRlbm90ZSBzZWN0aW9ucywgZ2l2ZSBpbmZvIGV0YyAqL1xuICAgICAgc3VidGl0bGU6IChzdWJ0aXRsZTogc3RyaW5nKSA9PiBlbChzdWJ0aXRsZSwgXCJoNFwiLCBjb250YWluZXIpLFxuICAgICAgLyoqIFVzZWQgdG8gc2hvdyBhIHBhcmFncmFwaCAqL1xuICAgICAgcDogKHN1YnRpdGxlOiBzdHJpbmcpID0+IGVsKHN1YnRpdGxlLCBcInBcIiwgY29udGFpbmVyKSxcbiAgICAgIC8qKiBXaGVuIHlvdSBjYW4ndCBkbyBzb21ldGhpbmcsIG9yIGhhdmUgbm90aGluZyB0byBzaG93ICovXG4gICAgICBzaG93RW1wdHlTY3JlZW4sXG4gICAgICAvKipcbiAgICAgICAqIFNob3dzIGEgbGlzdCBvZiBob3ZlcmFibGUsIGFuZCBzZWxlY3RhYmxlIGl0ZW1zIChlcnJvcnMsIGhpZ2hsaWdodHMgZXRjKSB3aGljaCBoYXZlIGNvZGUgcmVwcmVzZW50YXRpb24uXG4gICAgICAgKiBUaGUgdHlwZSBpcyBxdWl0ZSBzbWFsbCwgc28gaXQgc2hvdWxkIGJlIHZlcnkgZmVhc2libGUgZm9yIHlvdSB0byBtYXNzYWdlIG90aGVyIGRhdGEgdG8gZml0IGludG8gdGhpcyBmdW5jdGlvblxuICAgICAgICovXG4gICAgICBsaXN0RGlhZ3MsXG4gICAgICAvKiogU2hvd3MgYSBzaW5nbGUgb3B0aW9uIGluIGxvY2FsIHN0b3JhZ2UgKGFkZHMgYW4gbGkgdG8gdGhlIGNvbnRhaW5lciBCVFcpICovXG4gICAgICBsb2NhbFN0b3JhZ2VPcHRpb24sXG4gICAgICAvKiogVXNlcyBsb2NhbFN0b3JhZ2VPcHRpb24gdG8gY3JlYXRlIGEgbGlzdCBvZiBvcHRpb25zICovXG4gICAgICBzaG93T3B0aW9uTGlzdCxcbiAgICAgIC8qKiBTaG93cyBhIGZ1bGwtd2lkdGggdGV4dCBpbnB1dCAqL1xuICAgICAgY3JlYXRlVGV4dElucHV0LFxuICAgICAgLyoqIFJlbmRlcnMgYW4gQVNUIHRyZWUgKi9cbiAgICAgIGNyZWF0ZUFTVFRyZWUsXG4gICAgICAvKiogQ3JlYXRlcyBhbiBpbnB1dCBidXR0b24gKi9cbiAgICAgIGJ1dHRvbixcbiAgICAgIC8qKiBVc2VkIHRvIHJlLWNyZWF0ZSBhIFVJIGxpa2UgdGhlIHRhYiBiYXIgYXQgdGhlIHRvcCBvZiB0aGUgcGx1Z2lucyBzZWN0aW9uICovXG4gICAgICBjcmVhdGVUYWJCYXIsXG4gICAgICAvKiogVXNlZCB3aXRoIGNyZWF0ZVRhYkJhciB0byBhZGQgYnV0dG9ucyAqL1xuICAgICAgY3JlYXRlVGFiQnV0dG9uLFxuICAgICAgLyoqIEEgZ2VuZXJhbCBcInJlc3RhcnQgeW91ciBicm93c2VyXCIgbWVzc2FnZSAgKi9cbiAgICAgIGRlY2xhcmVSZXN0YXJ0UmVxdWlyZWQsXG4gICAgfVxuICB9XG59XG4iXX0=