import { IAttachment } from "./iattachment";

export interface IGmail {
    id: string,
    threadId: string,
    labelIds: string[],
    snippet: string,
    historyId: string,
    internalDate: number,
    textHtml: string,
    textPlain: string,
    attachments: IAttachment[],
    inline?: IAttachment[],
    headers: Map<string, string>,
}

