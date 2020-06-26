export interface UI {
    /** Show a text modal, with some buttons */
    showModal: (message: string, subtitle?: string, buttons?: {
        [text: string]: string;
    }) => void;
    /** A quick flash of some text */
    flashInfo: (message: string) => void;
    /** Creates a modal container which you can put your own DOM elements inside */
    createModalOverlay: (classes?: string) => HTMLDivElement;
}
export declare const createUI: () => UI;
