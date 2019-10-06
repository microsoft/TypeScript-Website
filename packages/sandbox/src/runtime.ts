// window.UI = {
//   tooltips: {},

//   shouldUpdateHash: false,

//   showFlashMessage(message) {
//     const node = document.querySelector(".flash");
//     const messageNode = node.querySelector(".flash__message");

//     messageNode.textContent = message;

//     node.classList.toggle("flash--hidden", false);
//     setTimeout(() => {
//       node.classList.toggle("flash--hidden", true);
//     }, 1000);
//   },

//   fetchTooltips: async function() {
//     try {
//       this.toggleSpinner(true);
//       const res = await fetch(`${window.CONFIG.baseUrl}schema/tsconfig.json`);
//       if(!res.ok) return

//       const json = await res.json();
//       this.toggleSpinner(false);

//       for (const [propertyName, property] of Object.entries(
//         json.definitions.compilerOptionsDefinition.properties.compilerOptions
//           .properties,
//       )) {
//         this.tooltips[propertyName] = property.description;
//       }
//     } catch (e) {
//       console.error(e);
//       // not critical
//     }
//   },


//   renderVersion() {
//     const node = document.querySelector("#version");
//     const childNode = node.querySelector("#version-current");

//     childNode.textContent = `${window.CONFIG.TSVersion}`;

//     node.style.opacity = 1;
//     node.classList.toggle("popup-on-hover", true);

//     this.toggleSpinner(false);
//   },

//   toggleSpinner(shouldShow) {
//     document
//       .querySelector(".spinner")
//       .classList.toggle("spinner--hidden", !shouldShow);
//   },

//   updateIsJavaScript(shouldUseJS) {
//     window.CONFIG.useJavaScript = shouldUseJS
//     UI.updateEditorStateAfterChange()
//     document.location.reload()
//   },

//   renderSettings() {
//     const node = document.querySelector("#settings-popup");
//     const isJS = window.CONFIG.useJavaScript
//     const html = `
//     ${createSelect(
//       monaco.languages.typescript.ScriptTarget,
//       "monaco.languages.typescript.ScriptTarget",
//       "Target",
//       "target",
//     )}
//     <br />
//     ${createSelect(
//       monaco.languages.typescript.JsxEmit,
//       "monaco.languages.typescript.JsxEmit",
//       "JSX",
//       "jsx",
//     )}
//     <br />
//     <label class="select">
//       <span class="select-label">Lang</span>
//       <select onchange="UI.updateIsJavaScript(event.target.value === 'JavaScript')")>;
//         <option>TypeScript</option>
//         <option ${window.CONFIG.useJavaScript ? "selected" : ""}>JavaScript</option>
//       </select>
//     </label>

//   <hr/>
//   <ul style="margin-top: 1em;">
//   ${Object.entries(compilerOptions)
//     .filter(([_, value]) => typeof value === "boolean")
//     .map(([key, value]) => {
//       return `<li style="margin: 0; padding: 0; ${isJS ? "opacity: 0.5" : ""}" title="${UI.tooltips[key] ||
//         ""}"><label class="button" style="user-select: none; display: block;"><input class="pointer" onchange="javascript:UI.updateCompileOptions(event.target.name, event.target.checked);" name="${key}" type="checkbox" ${
//         value ? "checked" : ""
//       }></input>${key}</label></li>`;
//     })
//     .join("\n")}
//   </ul>
//   <p style="margin-left: 0.5em; margin-top: 1em;">
//     <a href="https://www.typescriptlang.org/docs/handbook/compiler-options.html" target="_blank">
//       Compiler options reference
//     </a>
//   </p>
//   `;

//     node.innerHTML = html;
//   },

//   console() {
//     if (!window.ts) {
//       return;
//     }

//     console.log(`Using TypeScript ${window.ts.version}`);

//     console.log("Available globals:");
//     console.log("\twindow.ts", window.ts);
//     console.log("\twindow.client", window.client);
//   },

//   selectVersion(version) {
//     if (version === window.CONFIG.getLatestVersion()) {
//       location.href = `${window.CONFIG.baseUrl}${location.hash}`;
//       return false;
//     }

//     location.href = `${window.CONFIG.baseUrl}?ts=${version}${location.hash}`;
//     return false;
//   },

//   downloadExamplesTOC: async function() {
//     const examplesTOCHref = "/examplesTOC.json"
//     const res = await fetch(examplesTOCHref);
//     if (res.ok) {
//       const toc = await res.json()
//       const sections = toc.sections
//       const examples = toc.examples
//       const sortedSubSections = toc.sortedSubSections
      
//       // We've got the JSON representing the TOC
//       // so replace the "loading" html with 
//       // a real menu.
//       const exampleMenu = document.getElementById("examples")
//       exampleMenu.removeChild(exampleMenu.children[0])
      
//       // const header = document.createElement("h4")
//       // header.textContent = "Examples"
//       // exampleMenu.appendChild(header)

//       const sectionUL = document.createElement("ol")
//       exampleMenu.appendChild(sectionUL)

//       sections.forEach((s, i) => {
//         // Set up the TS/JS selection links at the top
//         const sectionHeader = document.createElement("li")
//         const sectionAnchor = document.createElement("button")
//         sectionAnchor.textContent = s.name
//         sectionAnchor.classList.add("section-name", "button")
//         sectionHeader.appendChild(sectionAnchor)
//         sectionUL.appendChild(sectionHeader)

//         // A wrapper div, which is used to show/hide
//         // the different sets of sections
//         const sectionContent = document.createElement("div")
//         sectionContent.id = s.name.toLowerCase()
//         sectionContent.classList.add("section-content")
//         sectionContent.style.display = i === 0 ? "flex" : "none"

//         // Handle clicking on a section title, moved
//         // further down so we can access the corresponding
//         // content section element.
//         sectionAnchor.onclick = () => {
//           // Visible selection
//           const allSectionTitles = document.getElementsByClassName("section-name")
//           for (const title of allSectionTitles) { title.classList.remove("selected") }
//           sectionAnchor.classList.add("selected")

//           const allSections = document.getElementsByClassName("section-content")
//           for (const section of allSections) { 
//             section.style.display = "none" 
//             section.classList.remove("selected")
//           }
//           sectionContent.style.display = "flex"
//           sectionContent.classList.add("selected")
//         }

//         const sectionSubtitle = document.createElement("p")
//         sectionSubtitle.textContent = s.subtitle
//         sectionSubtitle.style.width = "100%"
//         sectionContent.appendChild(sectionSubtitle)

//         // Goes from a flat list of examples, to a
//         // set of keys based on the section with
//         // an array of corresponding examples
//         const sectionDict = {}
//         examples.forEach(e => {
//           if (e.path[0] !== s.name) return;
//           if (sectionDict[e.path[1]]) {
//             sectionDict[e.path[1]].push(e)
//           } else {
//             sectionDict[e.path[1]] = [e]
//           }
//         })

//         // Grab the seen examples from your local storage
//         let seenExamples = {}
//         if (localStorage) {
//           const examplesFromLS = localStorage.getItem("examples-seen") || "{}"
//           seenExamples = JSON.parse(examplesFromLS)
//         }

//         // Looping through each section inside larger selection set, sorted by the index
//         // of the sortedSubSections array in the toc json
//         Object.keys(sectionDict)
//           .sort( (lhs, rhs) => sortedSubSections.indexOf(lhs) - sortedSubSections.indexOf(rhs))
//           .forEach(sectionName => {

//           const section = document.createElement("div")
//           section.classList.add("section-list")
          
//           const sectionTitle = document.createElement("h4")
//           sectionTitle.textContent = sectionName
//           section.appendChild(sectionTitle)

//           const sectionExamples = sectionDict[sectionName]
//           const sectionExampleContainer = document.createElement("ol")
          
//           sectionExamples.sort( (lhs, rhs) => lhs.sortIndex - rhs.sortIndex).forEach(e => {
//             const example = document.createElement("li")
            
//             const exampleName = document.createElement("a")
//             exampleName.textContent = e.title
//             exampleName.href = "#"
//             exampleName.onclick = (event) => {
//               const isJS = e.name.indexOf(".js") !== -1
//               const prefix = isJS ? "useJavaScript=true" : ""
              
//               const hash = "example/" + e.id
//               const query = prefix + objectToQueryParams(e.compilerSettings)
//               const newLocation = `${document.location.protocol}//${document.location.host}${document.location.pathname}?${query}#${hash}`

//               document.location = newLocation
//               event.preventDefault()
//             }

//             // To help people keep track of what they've seen,
//             // we keep track of what examples they've seen and 
//             // what the SHA was at the time. This makes it feasible
//             // for someone to work their way through the whole set
//             const exampleSeen = document.createElement("div") // circle
//             exampleSeen.classList.add("example-indicator")
//             const seenHash = seenExamples[e.id]
//             if (seenHash) {
//               const isSame = seenHash === e.hash
//               exampleSeen.classList.add(isSame ? "done" : "changed")
//             }

//             example.appendChild(exampleName)
//             example.appendChild(exampleSeen)

//             sectionExampleContainer.appendChild(example)
//           })

//           section.appendChild(sectionExampleContainer)
//           sectionContent.appendChild(section)
//           exampleMenu.appendChild(sectionContent)
//         })
//       })
      
//     } 
//     // set the first selection by default
//     const sections = document.getElementsByClassName("section-name")
//     sections[0].onclick()
//   },

//   selectExample: async function(exampleName) {
//     try {
//       const examplesTOCHref = "/examplesTOC.json"
//       const res = await fetch(examplesTOCHref);
//       if (!res.ok) {
//         console.error("Could not fetch example TOC")
//         return
//       }  

//       const toc = await res.json()
//       const example = toc.examples.find(e => e.id === exampleName)
//       if (!example) {
//         State.inputModel.setValue(`// Could not find example with id: ${exampleName} in\n// ${document.location.protocol}//${document.location.host}${examplesTOCHref}`);
//         return
//       }


//       const codeRes = await fetch(`/ex/en/${example.path.join("/")}/${encodeURIComponent(example.name)}`,);
//       let code = await codeRes.text();
     
//       // Handle removing the compiler settings stuff
//       if (code.startsWith("//// {")) {
//         code = code.split("\n").slice(1).join("\n");
//       }

//       // Update the localstorage showing that you've seen this page
//       if (localStorage) {
//         const seenText = localStorage.getItem("examples-seen") || "{}"
//         const seen = JSON.parse(seenText)
//         seen[example.id] = example.hash
//         localStorage.setItem("examples-seen", JSON.stringify(seen))
//       }

//       // Set the menu to be the same section as this current example
//       // this happens behind the scene and isn't visible till you hover
//       const sectionTitle = example.path[0]
//       const allSectionTitles = document.getElementsByClassName("section-name")
//       for (const title of allSectionTitles) { 
//         if (title.textContent === sectionTitle)  { title.onclick({}) }
//       }

//       document.title = "TypeScript Playground - " + example.title

//       UI.shouldUpdateHash = false
//       State.inputModel.setValue(code.trim());
//       UI.shouldUpdateHash = true

//     } catch (e) {
//       console.log(e);
//     }
//   },

//   setCodeFromHash: async function() {
//     if (location.hash.startsWith("#example")) {
//       const exampleName = location.hash.replace("#example/", "").trim();
//       UI.selectExample(exampleName);
//     }
//   },

//   refreshOutput() {
//     UI.shouldUpdateHash = false;
//     State.inputModel.setValue(State.inputModel.getValue());
//     UI.shouldUpdateHash = true;
//   },

//   updateURL() {
//     const diff = Object.entries(defaultCompilerOptions).reduce(
//       (acc, [key, value]) => {
//         if (value !== compilerOptions[key]) {
//           acc[key] = compilerOptions[key];
//         }

//         return acc;
//       },
//       {},
//     );

//     const hash = `code/${LZString.compressToEncodedURIComponent(State.inputModel.getValue())}`;
      
//     const urlParams = Object.assign({}, diff);
    
//     ["lib", "ts"].forEach(param => {
//       if (params.has(param)) {
//         urlParams[param] = params.get(param);
//       }
//     });

//     if (window.CONFIG.useJavaScript) urlParams["useJavaScript"] = true

//     if (Object.keys(urlParams).length > 0) {
//       const queryString = Object.entries(urlParams)
//         .map(([key, value]) => {
//           return `${key}=${encodeURIComponent(value)}`;
//         })
//         .join("&");

//       window.history.replaceState({}, "", `${window.CONFIG.baseUrl}?${queryString}#${hash}`);
//     } else {
//       window.history.replaceState({}, "", `${window.CONFIG.baseUrl}#${hash}`);
//     }
//   },

//   storeCurrentCodeInLocalStorage() {
//     localStorage.setItem("playground-history", State.inputModel.getValue())
//   },

//   updateCompileOptions(name, value) {
//     const isJS = window.CONFIG.useJavaScript
//     console.log(`${name} = ${value}`);
//     Object.assign(compilerOptions, { [name]: value });

//     console.log("Updating compiler options to", compilerOptions);
//     const defaults = monacoLanguageDefaults({ isJS })
//     defaults.setCompilerOptions(compilerOptions)

//     UI.updateEditorStateAfterChange()
//   },

//   updateEditorStateAfterChange() {
//     let inputCode = inputEditor.getValue();
//     State.inputModel.dispose();
    
//     const language = languageType({ isJS:window.CONFIG.useJavaScript })
//     State.inputModel = monaco.editor.createModel(inputCode, language, createFile(compilerOptions));
//     inputEditor.setModel(State.inputModel);

//     UI.refreshOutput();
//     UI.renderSettings();
//     UI.updateURL();
//   },

//   getInitialCode() {
//     if (location.hash.startsWith("#src")) {
//       const code = location.hash.replace("#src=", "").trim();
//       return decodeURIComponent(code);
//     }
    
//     if (location.hash.startsWith("#code")) {
//       const code = location.hash.replace("#code/", "").trim();
//       return LZString.decompressFromEncodedURIComponent(code);
//     }

//     if (location.hash.startsWith("#example")) {
//       return "// Loading example..."
//     }

//     if (localStorage.getItem("playground-history")) {
//       return localStorage.getItem("playground-history")
//     }

//     return `
// const message: string = 'hello world';
// console.log(message);
// `.trim();
//   },
// };
