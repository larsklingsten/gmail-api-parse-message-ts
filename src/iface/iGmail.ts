 
import { IGapiLabel } from './igapi-label';
import { IAttachment } from "./iattachment";
import { IReceiver } from './ireceiver';

export interface IGmail {

    id: string;          // gapi id  gapi = 'Gmail API'
    threadId: string;    // gapi thread
    snippet: string;     // gapi snippet
    historyId: string;
    internalDate: number;
    dateStr: string;
    from: string;         // "Amazon Web Services <aws-marketing-email-replies@amazon.com>",
    to: IReceiver[];         //  "reply-to": "aws-marketing-email-replies@amazon.com",
    cc: IReceiver[];         // "cc": "lars@klingsten.net",
    bcc: IReceiver[];        // "bbc": "lars@klingsten.net",
    subject: string;      //  "subject": "The AWS Summit Stockholm is back! Register and join us on May 22, 2019",

    textHtml: string,
    textPlain: string,
    attachments: IAttachment[],
    inline?: IAttachment[],
    size: number;

    labelIds: string[],
    labels?: IGapiLabel[],  // parsed.labelIds of IGapiLabel[]
    headers: Map<string, string>,
}

