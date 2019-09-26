export interface IAttachment {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
    headers?: any

    /** data must be URLsafe base64 encoded */
    data?: string;
    dataEncoding?: string;
}