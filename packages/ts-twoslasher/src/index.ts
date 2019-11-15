import fs from 'fs';
import ts  from 'typescript';
import * as utils from './utils';
import debug from "debug"
import { parsePrimitive } from './utils';

const log = debug("twoslasher")

// Hacking in some internal stuff
declare module 'typescript' {
  type Option = {
    name: string;
    type: 'list' | 'boolean' | 'number' | 'string' | ts.Map<number>;
    element?: Option;
  };

  const optionDeclarations: Array<Option>;
}

const { escapeHtml } = utils;

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
      log(`Removing line ${i} for having a query`)
      codeLines.splice(i, 1);
      i--;
    } else if (highlightMatch !== null) {
      const start = line.indexOf('^');
      const length = line.lastIndexOf('^') - start + 1;
      const position = contentOffset + start;
      const description = highlightMatch[1] ? highlightMatch[1].trim() : '';
      highlights.push({ kind: 'highlight', position, length, description });
      log(`Removing line ${i} for having a highlight`)
      codeLines.splice(i, 1);
      i--;
    } else {
      contentOffset = nextContentOffset;
      nextContentOffset += line.length + 1;
    }
  }
  return { highlights, queries };
}

function setOption(name: string, value: string, opts: ts.CompilerOptions) {
  log(`Setting ${name} to ${value}`);

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
          log(`Set ${opt.name} to ${opts[opt.name]}`);
          if (opts[opt.name] === undefined) {
            const keys = Array.from(opt.type.keys() as any);
            throw new Error(  `Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(',')}`)
          }
          break;
      }
      return;
    }
  }

  throw new Error(`No compiler setting named ${name} exists!`)
}

const booleanConfigRegexp = /^\/\/\s?@(\w+)$/;
// https://regex101.com/r/bSjhaM/1

const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?([a-zA-Z0-9.]+)/;

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

/** Available inline flags which are not compiler flags */
interface ExampleOptions {
  /** Let's the sample suppress all error diagnostics */
  noErrors: false;
  /** Shows the JS equivalent of the TypeScript code instead */
  showEmit: false;
  /** When mixed with showEmit, lets you choose the file to present instead of the JS */
  showEmittedFile: string
}

const defaultHandbookOptions: ExampleOptions = {
  noErrors: false,
  showEmit: false,
  showEmittedFile: "index.js"
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


interface TwoSlashReturn {
  /** The output code, could be TypeScript, but could also be a JS/JSON/d.ts */
  code: string;

  /** The new extension type for the code, potentially changed if they've requested emitted results */
  extension: string;

  /** Sample requests to highlight a particular part of the code */
  highlights: {
    kind: 'highlight';
    position: number;
    length: number;
    description: string;
  }[];

  /** Requests to use the LSP to get info for a particular symbol in the source */
  queries: {
    kind: 'query'; 
    position: number; 
    offset: number
  }[]

  /** Diagnostic error messages which came up when creating the program */
  errors: { 
    renderedMessage: string; 
    id: string; 
    category: 0 | 1 | 2 | 3;
    code: number;
    start: number | undefined
    length: number | undefined
  }[];

  /** The URL for this sample in the playground */
  playgroundURL: string
}

/**
 * Runs the checker against a TypeScript/JavaScript code sample returning potentially
 * difference code, and a set of annotations around how it works.
 *
 * @param code The fourslash code
 * @param extension For example: ts, tsx, typescript, javascript, js
 */
export function twoslasher(code: string, extension: string): TwoSlashReturn {
  log(`Looking at ${code}`)

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

  // This is mutated as the below functions pull out info
  const codeLines = code.split(/\r\n?|\n/g);

  const handbookOptions = filterHandbookOptions(codeLines);
  const compilerOptions = filterCompilerOptions(codeLines, {
    ...defaultCompilerOptions,
  });
  lsHost.setOptions(compilerOptions);

  // Remove ^^^^^^ lines from example and store
  const { highlights, queries } = filterHighlightLines(codeLines);
  code = codeLines.join('\n');

  sampleFileRef.fileName = 'index.' + extension;
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

  const errors: TwoSlashReturn["errors"] = [];

  const relevantErrors = errs.filter(d => d.file && d.file.fileName === sampleFileRef.fileName)
  for (const err of relevantErrors) {
    const renderedMessage = escapeHtml(ts.flattenDiagnosticMessageText(err.messageText, '\n'));
    const id = `err-${err.code}-${err.start}-${err.length}`;
    errors.push({
      category: err.category,
      code: err.code,
      length: err.length,
      start: err.start,
      renderedMessage,
      id,
    });
  }

  if (handbookOptions.showEmit) {
    const output = ls.getEmitOutput(sampleFileRef.fileName)
    const file = output.outputFiles.find(o => o.name === handbookOptions.showEmittedFile)
    if (!file) {
      const allFiles = output.outputFiles.map(o => o.name).join(", ")
      throw new Error(`Cannot find the file ${handbookOptions.showEmittedFile} - in ${allFiles}`)
    }

    code = file.text
    
    // Remove highlights and queries, because it won't work across transpiles,
    // though I guess source-mapping could handle the transition
    highlights.length = 0
    queries.length = 0
  }

  // const url = `https://www.typescriptlang.org/play/#src=${encodeURIComponent(code)}`;
  // if (codeLines.length >= 4 + codeLines.indexOf("//cut")) {
  //     parts.push(`<a class="playground-link" href="${url}">Try</a>`)
  // }

  const splitCode = code.split("//cut").pop()!

  return {
    code: splitCode,
    extension: extension,
    highlights,
    queries,
    errors,
    playgroundURL: ""
  };
}
