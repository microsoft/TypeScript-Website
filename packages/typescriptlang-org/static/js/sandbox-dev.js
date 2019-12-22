'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ts = _interopDefault(require('typescript'));

var setupPlayground = function setupPlayground(config, monaco) {
  try {
    // const defaults = monacoLanguageDefaults(config)
    var language = languageType(config);
    var filePath = createFileUri(config, config.compilerOptions, monaco);
    var element = "domID" in config ? document.getElementById(config.domID) : config.elementToAppend;
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
  return config.useJavaScript ? "javascript" : "typescript";
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
    typeScriptVersion: "bundled",
    useJavaScript: false
  };
  return config;
}
/** Creates a monaco file reference, basically a fancy path */

function createFileUri(config, compilerOptions, monaco) {
  var isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None;
  var fileExt = config.useJavaScript ? "js" : "ts";
  var ext = isJSX ? fileExt + "x" : fileExt;
  var filepath = "input." + ext;
  return monaco.Uri.file(filepath);
}

exports.defaultPlaygroundSettings = defaultPlaygroundSettings;
exports.getDefaultCompilerOptions = getDefaultCompilerOptions;
exports.setupPlayground = setupPlayground;
//# sourceMappingURL=typescript-playground.cjs.development.js.map
