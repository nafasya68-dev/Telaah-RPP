declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }
  export class PDFParse {
    constructor(options?: { data?: Buffer });
    getText(): Promise<{ text: string }>;
  }
  function pdf(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  export default pdf;
}
