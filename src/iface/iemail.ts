
import { IGapiLabel } from './igapi-label';
import { IAttachment } from "./iattachment";
import { IReceiver } from './ireceiver';

export interface IEmail {

    /** The immutable ID of the message. */
    id: string;

    /** The ID of the thread the message belongs to. To add a message or draft to a thread, the following criteria must be met:
    The requested threadId must be specified on the Message or Draft.Message you supply with your request.
    The References and In-Reply-To headers must be set in compliance with the RFC 2822 standard.
    The Subject headers must match. */
    threadId: string;

    /** A short part of the message text. */
    snippet: string;

    /** The ID of the last history record that modified this message. */
    historyId: string;

    /** The internal message creation timestamp (epoch ms), which determines ordering in the inbox. For normal SMTP-received email, this represents the time the message was originally accepted by Google, which is more reliable than the Date header. However, for API-migrated mail, it can be configured by client to be based on the Date header. */
    internalDate: number;

    /**  timestamp as taken from the message header, if not available, we take the internalDate  */
    sentDate: number;

    from: IReceiver;         // { name:'Amzn Svc', email:'web@amz.com' }  
    to: IReceiver[];         // [ { name:'Lars K', email:'lk@ema.dk' } ]
    cc: IReceiver[];         //  --||--
    bcc: IReceiver[];        //  --||--
    subject: string;         //  "subject": "The AWS Summit Stockholm is back! Register and join us on May 22, 2019",

    textHtml: string,
    textPlain: string,

    /** attachments references, the actual attachment must be downloaded seperately */
    attachments: IAttachment[],
    /** attachments. We add 'inline?' to, and remove the inline version (I think) */
    inline?: IAttachment[],

    /** estimates size of message, as calc'd by Gmail APi */
    size: number;

    /** List of IDs of labels applied to this message. */
    labelIds: string[],

    /** proceed lables, bases on LabelIds above */
    labels?: IGapiLabel[],  // parsed.labelIds of IGapiLabel[] // you need your own implementation
    headers: Map<string, string>,

    /** set by checking whether or not labelID = "DRAFT" exists  */
    isUnread: boolean;

    /** flag stateing whether or not message has been download from gmail  */
    isDownloaded: boolean;
}

