declare module 'pdf-parse' {
  interface PDFInfo {
    PDFFormatVersion?: string
    IsAcroFormPresent?: boolean
    IsXFAPresent?: boolean
    Title?: string
    Author?: string
    Subject?: string
    Creator?: string
    Producer?: string
    CreationDate?: string
    ModDate?: string
  }

  interface PDFMetadata {
    info: PDFInfo
    metadata: any
    version: string
  }

  interface PDFPage {
    pageIndex: number
    pageInfo: any
    pageText: string
  }

  interface PDFData {
    numpages: number
    numrender: number
    info: PDFInfo
    metadata: PDFMetadata | null
    version: string
    text: string
    pages?: PDFPage[]
  }

  interface PDFParseOptions {
    pagerender?: (pageData: any) => string
    max?: number
    version?: string
  }

  function PDFParse(
    dataBuffer: Buffer | ArrayBuffer | Uint8Array,
    options?: PDFParseOptions
  ): Promise<PDFData>

  export default PDFParse
}
