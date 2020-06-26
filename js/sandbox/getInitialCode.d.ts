/**
 * Grabs the sourcecode for an example from the query hash or local storage
 * @param fallback if nothing is found return this
 * @param location DI'd copy of document.location
 */
export declare const getInitialCode: (fallback: string, location: Location) => string;
