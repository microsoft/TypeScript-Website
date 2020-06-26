/**
 * Allows inline clicking on internal URLs to get different example code
 */
export declare class ExampleHighlighter {
    provideLinks(model: import('monaco-editor').editor.IModel): {
        links: {
            url: string;
            range: {
                startLineNumber: number;
                startColumn: number;
                endLineNumber: number;
                endColumn: number;
            };
        }[];
    };
}
