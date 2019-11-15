import fs from 'fs';
import ts from 'typescript';
import * as utils from './utils';

// Hacking in some internal stuff
declare module 'typescript' {
  type Option = {
    name: string;
    type: 'list' | 'boolean' | 'number' | 'string' | ts.Map<number>;
    element?: Option;
  };

  const optionDeclarations: Array<Option>;
}

const {  escapeHtml } = utils;

function cleanMarkdownEscaped(code: string) {
  code = code.replace(/¨D/g, '$');
  code = code.replace(/¨T/g, '~');
  return code;
}

function createLanguageServiceHost(
  ref: SampleRef
): ts.LanguageServiceHost & { setOptions(opts: ts.CompilerOptions): void } {
  let options: ts.CompilerOptions = {
    allowJs: true,
    skipLibCheck: true,
    strict: true,
  };
  const servicesHost: ReturnType<typeof createLanguageServiceHost> = {
    getScriptFileNames: () => [ref.fileName!],
    getScriptVersion: fileName =>
      ref.fileName === fileName ? '' + ref.versionNumber : '0',
    getScriptSnapshot: fileName => {
      if (fileName === ref.fileName) {
        return ts.ScriptSnapshot.fromString(ref.content);
      }
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    setOptions(newOpts) {
      options = newOpts;
    },
  };
  return servicesHost;
}

interface SampleRef {
  fileName: string | undefined;
  versionNumber: number;
  content: string;
}

type QueryPosition = { kind: 'query'; position: number; offset: number };
type HighlightPosition = {
  kind: 'highlight';
  position: number;
  length: number;
  description: string;
};
function filterHighlightLines(
  codeLines: string[]
): { highlights: HighlightPosition[]; queries: QueryPosition[] } {
  const highlights: HighlightPosition[] = [];
  const queries: QueryPosition[] = [];
  let nextContentOffset = 0;
  let contentOffset = 0;
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    const highlightMatch = /^\s*\^+( .+)?$/.exec(line);
    const queryMatch = /^\s*\^\?\s*$/.exec(line);
    if (queryMatch !== null) {
      const start = line.indexOf('^');
      const position = contentOffset + start;
      queries.push({ kind: 'query', offset: start, position });
      codeLines.splice(i, 1);
      i--;

    } else if (highlightMatch !== null) {
      const start = line.indexOf('^');
      const length = line.lastIndexOf('^') - start + 1;
      const position = contentOffset + start;
      const description = highlightMatch[1] ? highlightMatch[1].trim() : '';
      highlights.push({ kind: 'highlight', position, length, description });
      codeLines.splice(i, 1);
      i--;
    } else {
      contentOffset = nextContentOffset;
      nextContentOffset += line.length + 1;
    }
  }
  return { highlights, queries };
}

// function filterOut<T>(arr: T[], predicate: (el: T) => boolean) {
//   const result: T[] = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (predicate(arr[i])) {
//       result.push(arr.splice(i, 1)[0]);
//       i--;
//     }
//   }
//   return result;
// }

function setOption(name: string, value: string, opts: ts.CompilerOptions) {
  console.log(`Setting ${name} to ${value}`);
  for (const opt of ts.optionDeclarations) {
    if (opt.name.toLowerCase() === name.toLowerCase()) {
      switch (opt.type) {
        case 'number':
        case 'string':
        case 'boolean':
          opts[opt.name] = parsePrimitive(value, opt.type);
          break;

        case 'list':
          opts[opt.name] = value
            .split(',')
            .map(v => parsePrimitive(v, opt.element!.type as string));
          break;

        default:
          opts[opt.name] = opt.type.get(value.toLowerCase());
          console.log(`Set ${opt.name} to ${opts[opt.name]}`);
          if (opts[opt.name] === undefined) {
            const keys = Array.from(opt.type.keys() as any);
            console.error(
              `Invalid value ${value} for ${
                opt.name
              }. Allowed values: ${keys.join(',')}`
            );
          }
          break;
      }
      return;
    }
  }
  console.error(`No compiler setting named ${name} exists!`);
}

const booleanConfigRegexp = /^\/\/\s?@(\w+)$/;
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(\w+)$/;
function filterCompilerOptions(
  codeLines: string[],
  defaultCompilerOptions: ts.CompilerOptions
) {
  const options = { ...defaultCompilerOptions };
  for (let i = 0; i < codeLines.length; ) {
    let match;
    if ((match = booleanConfigRegexp.exec(codeLines[i]))) {
      options[match[1]] = true;
      setOption(match[1], 'true', options);
    } else if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      setOption(match[1], match[2], options);
    } else {
      i++;
      continue;
    }
    codeLines.splice(i, 1);
  }
  return options;
}

interface ExampleOptions {
  noErrors: false;
  showEmit: false;
}

const defaultHandbookOptions: ExampleOptions = {
  noErrors: false,
  showEmit: false,
};

function filterHandbookOptions(
  codeLines: string[]
): typeof defaultHandbookOptions {
  const options: any = { ...defaultHandbookOptions };
  for (let i = 0; i < codeLines.length; i++) {
    let match;
    if ((match = booleanConfigRegexp.exec(codeLines[i]))) {
      if (match[1] in options) {
        options[match[1]] = true;
        codeLines.splice(i, 1);
        i--;
      }
    } else if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      if (match[1] in options) {
        options[match[1]] = match[2];
        codeLines.splice(i, 1);
        i--;
      }
    }
  }
  return options;
}

/**
 * Converts code into 
 *
 * @param code The fourslash code
 * @param extension For example: ts, tsx, typescript, javascript, js
 */
export function fourslasher(code: string, extension: string) {
  const sampleFileRef: SampleRef = {
    fileName: undefined,
    content: '',
    versionNumber: 0,
  };
  const lsHost = createLanguageServiceHost(sampleFileRef);
  const caseSensitiveFilenames =
    lsHost.useCaseSensitiveFileNames && lsHost.useCaseSensitiveFileNames();
  const docRegistry = ts.createDocumentRegistry(
    caseSensitiveFilenames,
    lsHost.getCurrentDirectory()
  );
  const ls = ts.createLanguageService(lsHost, docRegistry);
  const defaultCompilerOptions: ts.CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ESNext,
    allowJs: true,
  };

  code = cleanMarkdownEscaped(code);

  const codeLines = code.split(/\r\n?|\n/g);

  const handbookOptions = filterHandbookOptions(codeLines);
  const compilerOptions = filterCompilerOptions(codeLines, {
    ...defaultCompilerOptions,
  });
  lsHost.setOptions(compilerOptions);

  // Remove ^^^^^^ lines from example and store
  const { highlights, queries } = filterHighlightLines(codeLines);
  code = codeLines.join('\n');

  sampleFileRef.fileName = 'input.' + extension;
  sampleFileRef.content = code;
  sampleFileRef.versionNumber++;

  const scriptSnapshot = lsHost.getScriptSnapshot(sampleFileRef.fileName);
  const scriptVersion = '' + sampleFileRef.versionNumber;
  docRegistry.updateDocument(
    sampleFileRef.fileName,
    compilerOptions,
    scriptSnapshot!,
    scriptVersion
  );

  const errs: ts.Diagnostic[] = [];

  if (!handbookOptions.noErrors) {
    errs.push(...ls.getSemanticDiagnostics(sampleFileRef.fileName));
    errs.push(...ls.getSyntacticDiagnostics(sampleFileRef.fileName));
  }

  const errors: Array<ts.Diagnostic & {
    renderedMessage: string;
    id: string;
  }> = [];

  for (const err of errs.filter(
    d => d.file && d.file.fileName === sampleFileRef.fileName
  )) {
    const renderedMessage = escapeHtml(
      ts.flattenDiagnosticMessageText(err.messageText, '\n')
    );
    const id = `err-${err.code}-${err.start}-${err.length}`;
    errors.push({
      ...err,
      renderedMessage,
      id,
    });
  }

  if (handbookOptions.showEmit) {
    code = ls.getEmitOutput(sampleFileRef.fileName).outputFiles[0].text;
  }

  // const url = `https://www.typescriptlang.org/play/#src=${encodeURIComponent(code)}`;
  // if (codeLines.length >= 4 + codeLines.indexOf("//cut")) {
  //     parts.push(`<a class="playground-link" href="${url}">Try</a>`)
  // }

  return {
    code: code,
    extension: extension,
    highlights,
    queries,
    errors
  };
}

function parsePrimitive(value: string, type: string): any {
  switch (type) {
    case 'number':
      return +value;
    case 'string':
      return value;
    case 'boolean':
      return value.toLowerCase() === 'true' || value.length === 0;
  }
  throw new Error(`Unknown primitive type ${type}`);
}
