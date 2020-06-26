export declare const getExampleSourceCode: (prefix: string, lang: string, exampleID: string) => Promise<{
    example?: undefined;
    code?: undefined;
} | {
    example: any;
    code: string;
}>;
