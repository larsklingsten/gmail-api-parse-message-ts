


export interface iGmail {
    id: string,
    threadId: string,
    labelIds: string[],
    snippet: string,
    historyId: string,
    internalDate: number,

    isHtml?: boolean,
    isPlain?: boolean,
    textHtml: string,
    textPlain: string,
    attachments: IAttachment[],
    inline?: IAttachment[],
    headers: Map<string, string>,

}

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