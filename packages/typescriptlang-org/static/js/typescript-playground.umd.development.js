(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('typescript')) :
	typeof define === 'function' && define.amd ? define(['exports', 'typescript'], factory) :
	(global = global || self, factory(global['typescript-playground'] = {}, global.ts));
}(this, (function (exports, ts) { 'use strict';

	ts = ts && ts.hasOwnProperty('default') ? ts['default'] : ts;

	// A type of promise-like that resolves synchronously and supports only one observer
	var _Pact =
	/*#__PURE__*/
	function () {
	  function _Pact() {}

	  _Pact.prototype.then = function (onFulfilled, onRejected) {
	    var result = new _Pact();
	    var state = this.s;

	    if (state) {
	      var callback = state & 1 ? onFulfilled : onRejected;

	      if (callback) {
	        try {
	          _settle(result, 1, callback(this.v));
	        } catch (e) {
	          _settle(result, 2, e);
	        }

	        return result;
	      } else {
	        return this;
	      }
	    }

	    this.o = function (_this) {
	      try {
	        var value = _this.v;

	        if (_this.s & 1) {
	          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
	        } else if (onRejected) {
	          _settle(result, 1, onRejected(value));
	        } else {
	          _settle(result, 2, value);
	        }
	      } catch (e) {
	        _settle(result, 2, e);
	      }
	    };

	    return result;
	  };

	  return _Pact;
	}(); // Settles a pact synchronously

	function _settle(pact, state, value) {
	  if (!pact.s) {
	    if (value instanceof _Pact) {
	      if (value.s) {
	        if (state & 1) {
	          state = value.s;
	        }

	        value = value.v;
	      } else {
	        value.o = _settle.bind(null, pact, state);
	        return;
	      }
	    }

	    if (value && value.then) {
	      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
	      return;
	    }

	    pact.s = state;
	    pact.v = value;
	    var observer = pact.o;

	    if (observer) {
	      observer(pact);
	    }
	  }
	}
	function _isSettledPact(thenable) {
	  return thenable instanceof _Pact && thenable.s & 1;
	} // Converts argument to a function that always returns a Promise
	var _iteratorSymbol =
	/*#__PURE__*/
	typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator =
	/*#__PURE__*/
	Symbol("Symbol.iterator")) : "@@iterator"; // Asynchronously iterate through an object's values
	var _asyncIteratorSymbol =
	/*#__PURE__*/
	typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator =
	/*#__PURE__*/
	Symbol("Symbol.asyncIterator")) : "@@asyncIterator"; // Asynchronously iterate on a value using it's async iterator if present, or its synchronous iterator if missing

	function _for(test, update, body) {
	  var stage;

	  for (;;) {
	    var shouldContinue = test();

	    if (_isSettledPact(shouldContinue)) {
	      shouldContinue = shouldContinue.v;
	    }

	    if (!shouldContinue) {
	      return result;
	    }

	    if (shouldContinue.then) {
	      stage = 0;
	      break;
	    }

	    var result = body();

	    if (result && result.then) {
	      if (_isSettledPact(result)) {
	        result = result.s;
	      } else {
	        stage = 1;
	        break;
	      }
	    }

	    if (update) {
	      var updateValue = update();

	      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
	        stage = 2;
	        break;
	      }
	    }
	  }

	  var pact = new _Pact();

	  var reject = _settle.bind(null, pact, 2);

	  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
	  return pact;

	  function _resumeAfterBody(value) {
	    result = value;

	    do {
	      if (update) {
	        updateValue = update();

	        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
	          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
	          return;
	        }
	      }

	      shouldContinue = test();

	      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
	        _settle(pact, 1, result);

	        return;
	      }

	      if (shouldContinue.then) {
	        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
	        return;
	      }

	      result = body();

	      if (_isSettledPact(result)) {
	        result = result.v;
	      }
	    } while (!result || !result.then);

	    result.then(_resumeAfterBody).then(void 0, reject);
	  }

	  function _resumeAfterTest(shouldContinue) {
	    if (shouldContinue) {
	      result = body();

	      if (result && result.then) {
	        result.then(_resumeAfterBody).then(void 0, reject);
	      } else {
	        _resumeAfterBody(result);
	      }
	    } else {
	      _settle(pact, 1, result);
	    }
	  }

	  function _resumeAfterUpdate() {
	    if (shouldContinue = test()) {
	      if (shouldContinue.then) {
	        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
	      } else {
	        _resumeAfterTest(shouldContinue);
	      }
	    } else {
	      _settle(pact, 1, result);
	    }
	  }
	} // Asynchronously implement a do ... while loop

	/**
	 * Type Defs we've already got, and nulls when something has failed.
	 * This is to make sure that it doesn't infinite loop.
	 */
	var acquiredTypeDefs = {};
	/**
	 * Pseudo in-browser type acquisition
	 *
	 * @param sourceCode the root source code to look at
	 * @param addLibraryToRuntime
	 */

	var detectNewImportsToAcquireTypeFor = function detectNewImportsToAcquireTypeFor(sourceCode, addLibraryToRuntime) {
	  var getTypeDependenciesForSourceCode = function getTypeDependenciesForSourceCode(sourceCode, mod, path) {
	    try {
	      // TODO: debounce
	      //
	      // TODO: This needs to be replaced by the AST - it still works in comments
	      // blocked by https://github.com/microsoft/monaco-typescript/pull/38
	      //
	      // https://regex101.com/r/Jxa3KX/4
	      var requirePattern = /(const|let|var)(.|\n)*? require\(('|")(.*)('|")\);?$/; //  https://regex101.com/r/hdEpzO/4

	      var es6Pattern = /(import|export)((?!from)(?!require)(.|\n))*?(from|require\()\s?('|")(.*)('|")\)?;?$/gm;
	      var foundModules = new Set();
	      var match;

	      while ((match = es6Pattern.exec(sourceCode)) !== null) {
	        if (match[6]) foundModules.add(match[6]);
	      }

	      while ((match = requirePattern.exec(sourceCode)) !== null) {
	        if (match[5]) foundModules.add(match[5]);
	      }

	      var moduleJSONURL = function moduleJSONURL(name) {
	        return "https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/" + name + "?attributes=types&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.1&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e";
	      };

	      var unpkgURL = function unpkgURL(name, path) {
	        return "https://www.unpkg.com/" + encodeURIComponent(name) + "/" + encodeURIComponent(path);
	      };

	      var packageJSONURL = function packageJSONURL(name) {
	        return unpkgURL(name, 'package.json');
	      };

	      var errorMsg = function errorMsg(msg, response) {
	        console.error(msg + " - will not try again in this session", response.status, response.statusText, response);
	        debugger;
	      }; //  const addLibraryToRuntime = (code:string, path:string) => {
	      //    const defaults = monacoLanguageDefaults({ isJS: path.endsWith("js") })
	      //    defaults.addExtraLib(code, path);
	      //    console.log(`Adding ${path} to runtime`)
	      //  }


	      var getReferenceDependencies = function getReferenceDependencies(sourceCode, mod, path) {
	        try {
	          var _exit2 = false;
	          return Promise.resolve(function () {
	            if (sourceCode.indexOf('reference path') > 0) {
	              // https://regex101.com/r/DaOegw/1
	              var referencePathExtractionPattern = /<reference path="(.*)" \/>/gm;
	              return _for(function () {
	                return !_exit2 && (match = referencePathExtractionPattern.exec(sourceCode)) !== null;
	              }, void 0, function () {
	                var relativePath = match[1];
	                return function () {
	                  if (relativePath) {
	                    var newPath = mapRelativePath(mod, relativePath, path);
	                    return function () {
	                      if (newPath) {
	                        var dtsRefURL = unpkgURL(mod, newPath);
	                        return Promise.resolve(fetch(dtsRefURL)).then(function (dtsReferenceResponse) {
	                          if (!dtsReferenceResponse.ok) {
	                            _exit2 = true;
	                            return errorMsg("Could not get " + newPath + " for a reference link in the module '" + mod + "' from " + path, dtsReferenceResponse);
	                          }

	                          return Promise.resolve(dtsReferenceResponse.text()).then(function (dtsReferenceResponseText) {
	                            if (!dtsReferenceResponseText) {
	                              _exit2 = true;
	                              return errorMsg("Could not get " + newPath + " for a reference link for the module '" + mod + "' from " + path, dtsReferenceResponse);
	                            }

	                            return Promise.resolve(getTypeDependenciesForSourceCode(dtsReferenceResponseText, mod, newPath)).then(function () {
	                              var representationalPath = "node_modules/" + mod + "/" + newPath;
	                              addLibraryToRuntime(dtsReferenceResponseText, representationalPath);
	                            });
	                          });
	                        });
	                      }
	                    }();
	                  }
	                }();
	              });
	            }
	          }());
	        } catch (e) {
	          return Promise.reject(e);
	        }
	      };
	      /**
	       * Takes an initial module and the path for the root of the typings and grab it and start grabbing its
	       * dependencies then add those the to runtime.
	       *
	       * @param {string} mod The module name
	       * @param {string} path  The path to the root def type
	       */


	      var addModuleToRuntime = function addModuleToRuntime(mod, path) {
	        try {
	          var isDeno = path && path.indexOf('https://') === 0;
	          var dtsFileURL = isDeno ? path : unpkgURL(mod, path);
	          return Promise.resolve(fetch(dtsFileURL)).then(function (dtsResponse) {
	            return dtsResponse.ok ? Promise.resolve(dtsResponse.text()).then(function (content) {
	              return content ? Promise.resolve(getTypeDependenciesForSourceCode(content, mod, path)).then(function () {
	                if (isDeno) {
	                  var wrapped = "declare module \"" + path + "\" { " + content + " }";
	                  addLibraryToRuntime(wrapped, path);
	                } else {
	                  var typelessModule = mod.split('@types/').slice(-1);

	                  var _wrapped = "declare module \"" + typelessModule + "\" { " + content + " }";

	                  addLibraryToRuntime(_wrapped, "node_modules/" + mod + "/" + path);
	                }
	              }) : errorMsg("Could not get root d.ts file for the module '" + mod + "' at " + path, dtsResponse);
	            }) : errorMsg("Could not get root d.ts file for the module '" + mod + "' at " + path, dtsResponse);
	          });
	        } catch (e) {
	          return Promise.reject(e);
	        }
	      };
	      /**
	       * Takes a module import, then uses both the algolia API and the the package.json to derive
	       * the root type def path.
	       *
	       * @param {string} packageName
	       * @returns {Promise<{ mod: string, path: string, packageJSON: any }>}
	       */


	      var getModuleAndRootDefTypePath = function getModuleAndRootDefTypePath(packageName) {
	        try {
	          // For modules
	          var url = moduleJSONURL(packageName);
	          return Promise.resolve(fetch(url)).then(function (response) {
	            return response.ok ? Promise.resolve(response.json()).then(function (responseJSON) {
	              if (!responseJSON) {
	                return errorMsg("Could not get Algolia JSON for the module '" + packageName + "'", response);
	              }

	              if (!responseJSON.types) {
	                return console.log("There were no types for '" + packageName + "' - will not try again in this session");
	              }

	              if (!responseJSON.types.ts) {
	                return console.log("There were no types for '" + packageName + "' - will not try again in this session");
	              }

	              acquiredTypeDefs[packageName] = responseJSON;

	              if (responseJSON.types.ts === 'included') {
	                var modPackageURL = packageJSONURL(packageName);
	                return Promise.resolve(fetch(modPackageURL)).then(function (response) {
	                  return response.ok ? Promise.resolve(response.json()).then(function (responseJSON) {
	                    if (!responseJSON) {
	                      return errorMsg("Could not get Package JSON for the module '" + packageName + "'", response);
	                    } // Get the path of the root d.ts file
	                    // non-inferred route


	                    var rootTypePath = responseJSON.typing || responseJSON.typings || responseJSON.types; // package main is custom

	                    if (!rootTypePath && typeof responseJSON.main === 'string' && responseJSON.main.indexOf('.js') > 0) {
	                      rootTypePath = responseJSON.main.replace(/js$/, 'd.ts');
	                    } // Final fallback, to have got here it must have passed in algolia


	                    if (!rootTypePath) {
	                      rootTypePath = 'index.d.ts';
	                    }

	                    return {
	                      mod: packageName,
	                      path: rootTypePath,
	                      packageJSON: responseJSON
	                    };
	                  }) : errorMsg("Could not get Package JSON for the module '" + packageName + "'", response);
	                });
	              } else if (responseJSON.types.ts === 'definitely-typed') {
	                return {
	                  mod: responseJSON.types.definitelyTyped,
	                  path: 'index.d.ts',
	                  packageJSON: responseJSON
	                };
	              } else {
	                throw "This shouldn't happen";
	              }
	            }) : errorMsg("Could not get Algolia JSON for the module '" + packageName + "'", response);
	          });
	        } catch (e) {
	          return Promise.reject(e);
	        }
	      };

	      var mapModuleNameToModule = function mapModuleNameToModule(name) {
	        // in node repl:
	        // > require("module").builtinModules
	        var builtInNodeMods = ['assert', 'async_hooks', 'base', 'buffer', 'child_process', 'cluster', 'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'globals', 'http', 'http2', 'https', 'index', 'inspector', 'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib'];

	        if (builtInNodeMods.includes(name)) {
	          return 'node';
	        }

	        return name;
	      }; //** A really dumb version of path.resolve */


	      var mapRelativePath = function mapRelativePath(_outerModule, moduleDeclaration, currentPath) {
	        // https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
	        function absolute(base, relative) {
	          if (!base) return relative;
	          var stack = base.split('/');
	          var parts = relative.split('/');
	          stack.pop(); // remove current file name (or empty string)

	          for (var i = 0; i < parts.length; i++) {
	            if (parts[i] == '.') continue;
	            if (parts[i] == '..') stack.pop();else stack.push(parts[i]);
	          }

	          return stack.join('/');
	        }

	        return absolute(currentPath, moduleDeclaration);
	      };

	      var convertToModuleReferenceID = function convertToModuleReferenceID(outerModule, moduleDeclaration, currentPath) {
	        var modIsScopedPackageOnly = moduleDeclaration.indexOf('@') === 0 && moduleDeclaration.split('/').length === 2;
	        var modIsPackageOnly = moduleDeclaration.indexOf('@') === -1 && moduleDeclaration.split('/').length === 1;
	        var isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly;

	        if (isPackageRootImport) {
	          return moduleDeclaration;
	        } else {
	          return outerModule + "-" + mapRelativePath(outerModule, moduleDeclaration, currentPath);
	        }
	      };
	      /** @type {string[]} */


	      var filteredModulesToLookAt = Array.from(foundModules);
	      filteredModulesToLookAt.forEach(function (name) {
	        try {
	          // Support grabbing the hard-coded node modules if needed
	          var moduleToDownload = mapModuleNameToModule(name);

	          if (!mod && moduleToDownload.startsWith('.')) {
	            return Promise.resolve(console.log("Can't resolve local relative dependencies"));
	          }

	          var moduleID = convertToModuleReferenceID(mod, moduleToDownload, path);

	          if (acquiredTypeDefs[moduleID] || acquiredTypeDefs[moduleID] === null) {
	            return Promise.resolve();
	          }

	          var modIsScopedPackageOnly = moduleToDownload.indexOf('@') === 0 && moduleToDownload.split('/').length === 2;
	          var modIsPackageOnly = moduleToDownload.indexOf('@') === -1 && moduleToDownload.split('/').length === 1;
	          var isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly;
	          var isDenoModule = moduleToDownload.indexOf('https://') === 0;
	          return Promise.resolve(function () {
	            if (isPackageRootImport) {
	              // So it doesn't run twice for a package
	              acquiredTypeDefs[moduleID] = null; // E.g. import danger from "danger"

	              return Promise.resolve(getModuleAndRootDefTypePath(moduleToDownload)).then(function (packageDef) {
	                var _temp = function () {
	                  if (packageDef) {
	                    acquiredTypeDefs[moduleID] = packageDef.packageJSON;
	                    return Promise.resolve(addModuleToRuntime(packageDef.mod, packageDef.path)).then(function () {});
	                  }
	                }();

	                if (_temp && _temp.then) return _temp.then(function () {});
	              });
	            } else return function () {
	              if (isDenoModule) {
	                // E.g. import { serve } from "https://deno.land/std@v0.12/http/server.ts";
	                return Promise.resolve(addModuleToRuntime(moduleToDownload, moduleToDownload)).then(function () {});
	              } else {
	                // E.g. import {Component} from "./MyThing"
	                if (!moduleToDownload || !path) throw "No outer module or path for a relative import: " + moduleToDownload;
	                var absolutePathForModule = mapRelativePath(mod, moduleToDownload, path); // So it doesn't run twice for a package

	                acquiredTypeDefs[moduleID] = null;
	                var resolvedFilepath = absolutePathForModule.endsWith('.ts') ? absolutePathForModule : absolutePathForModule + '.d.ts';
	                return Promise.resolve(addModuleToRuntime(mod, resolvedFilepath)).then(function () {});
	              }
	            }();
	          }());
	        } catch (e) {
	          return Promise.reject(e);
	        }
	      });
	      getReferenceDependencies(sourceCode, mod, path);
	      return Promise.resolve();
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  }; // Start diving into the root


	  getTypeDependenciesForSourceCode(sourceCode, undefined, undefined);
	  return Promise.resolve();
	};

	/**
	 * The versions of monaco-typescript which we can use
	 * for backwards compatibility with older versions
	 * of TS in the playground.
	 */
	var monacoTSVersions = {
	  '3.5.1': {
	    monaco: '0.17.1'
	  },
	  '3.3.3': {
	    monaco: '0.16.1'
	  },
	  '3.1.6': {
	    monaco: '0.15.6'
	  },
	  '3.0.1': {
	    monaco: '0.14.3'
	  },
	  '2.8.1': {
	    monaco: '0.13.1'
	  },
	  '2.7.2': {
	    monaco: '0.11.1'
	  },
	  '2.4.1': {
	    monaco: '0.10.0'
	  }
	};

	var setupPlayground = function setupPlayground(config, monaco) {
	  try {
	    // const defaults = monacoLanguageDefaults(config)
	    var language = languageType(config);
	    var filePath = createFileUri(config, config.compilerOptions, monaco);
	    var element = 'domID' in config ? document.getElementById(config.domID) : config.elementToAppend;
	    var model = monaco.editor.createModel(config.text, language, filePath);
	    var monacoSettings = Object.assign({
	      model: model
	    }, sharedEditorOptions, config.monacoSettings || {});
	    var editor = monaco.editor.create(element, monacoSettings);
	    return Promise.resolve(editor);
	  } catch (e) {
	    return Promise.reject(e);
	  }
	};

	var languageType = function languageType(config) {
	  return config.useJavaScript ? 'javascript' : 'typescript';
	}; // const monacoLanguageDefaults = (config: PlaygroundConfig) => config.useJavaScript ? monaco.languages.typescript.javascriptDefaults : monaco.languages.typescript.typescriptDefaults
	// const monacoLanguageWorker = (config: PlaygroundConfig) => config.useJavaScript ? monaco.languages.typescript.getJavaScriptWorker : monaco.languages.typescript.getTypeScriptWorker

	/** Default Monaco settings for the sandbox */


	var sharedEditorOptions = {
	  minimap: {
	    enabled: false
	  },
	  automaticLayout: true,
	  scrollBeyondLastLine: true,
	  scrollBeyondLastColumn: 3
	};
	function getDefaultCompilerOptions(config) {
	  return {
	    noImplicitAny: true,
	    strictNullChecks: true,
	    strictFunctionTypes: true,
	    strictPropertyInitialization: true,
	    noImplicitThis: true,
	    noImplicitReturns: true,
	    alwaysStrict: true,
	    allowUnreachableCode: false,
	    allowUnusedLabels: false,
	    downlevelIteration: false,
	    noEmitHelpers: false,
	    noLib: false,
	    noStrictGenericChecks: false,
	    noUnusedLocals: false,
	    noUnusedParameters: false,
	    esModuleInterop: false,
	    preserveConstEnums: false,
	    removeComments: false,
	    skipLibCheck: false,
	    checkJs: config.useJavaScript,
	    allowJs: config.useJavaScript,
	    experimentalDecorators: false,
	    emitDecoratorMetadata: false,
	    target: ts.ScriptTarget.ES2017,
	    jsx: monaco.languages.typescript.JsxEmit.None
	  };
	}
	function defaultPlaygroundSettings(text, domID) {
	  var config = {
	    text: text,
	    domID: domID,
	    compilerOptions: {},
	    typeScriptVersion: 'bundled',
	    useJavaScript: false
	  };
	  return config;
	}
	/** Creates a monaco file reference, basically a fancy path */

	function createFileUri(config, compilerOptions, monaco) {
	  var isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None;
	  var fileExt = config.useJavaScript ? 'js' : 'ts';
	  var ext = isJSX ? fileExt + 'x' : fileExt;
	  var filepath = 'input.' + ext;
	  return monaco.Uri.file(filepath);
	}

	exports.defaultPlaygroundSettings = defaultPlaygroundSettings;
	exports.detectNewImportsToAcquireTypeFor = detectNewImportsToAcquireTypeFor;
	exports.getDefaultCompilerOptions = getDefaultCompilerOptions;
	exports.monacoTSVersions = monacoTSVersions;
	exports.setupPlayground = setupPlayground;

})));
//# sourceMappingURL=typescript-playground.umd.development.js.map
