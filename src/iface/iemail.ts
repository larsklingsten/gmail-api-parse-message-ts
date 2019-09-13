 
import { IGapiLabel } from './igapi-label';
import { IAttachment } from "./iattachment";
import { IReceiver } from './ireceiver';

export interface IEmail {

    id: string;              // gapi id  gapi = 'Gmail API'
    threadId: string;        // gapi thread
    snippet: string;         // gapi snippet
    historyId: string;
    internalDate: number;
    dateStr: string;
    from: IReceiver;         //  { name:'Amzn Web Service', email:'web@amz.com' }  
    to: IReceiver[];         //  [ { name:'Lars K', email:'lk@email' } ]
    cc: IReceiver[];         //  etc
    bcc: IReceiver[];        //  etc
    subject: string;         //  "subject": "The AWS Summit Stockholm is back! Register and join us on May 22, 2019",

    textHtml: string,
    textPlain: string,
    attachments: IAttachment[],
    inline?: IAttachment[],
    size: number;

    labelIds: string[],     // Label IDs from GMAIL API, list
    labels?: IGapiLabel[],  // parsed.labelIds of IGapiLabel[] // you need your own implementation
    headers: Map<string, string>,
}

