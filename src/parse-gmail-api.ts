declare var require: any;
const b64Decode = require('base-64').decode;

import { IEmail } from './iface/iemail';
import { IPart } from './iface/iparts';
import { getEmptyEmail, copyGmail } from './constants';

import { IReceiver } from './iface/ireceiver';
import { Strings } from 'klingsten-snippets';

/** parses gmail api response to a IGmail object - typescript */
export class ParseGmailApi {


    constructor() { }

    /**  parses a gmail-api message.resource object, and returns a IEmail Object
     * @param   messages.resource
     * @returns IEmail 
     * 
     * messages.resource: https://developers.google.com/gmail/api/v1/reference/users/messages#resource 
     */
    public parseMessage(gmailApiResp: any): IEmail {

        // its not evident that we only need the result, so we test to see what we got
        const resp = gmailApiResp['result'] || gmailApiResp;
        const gmail = this.parseRawGmailResponse(resp);
        this.parseHeaders(gmail);
        return gmail;
    }

    /** Decodes a URLSAFE Base64 string to its original representation */
    public urlB64Decode(s: string): string {
        return s ? decodeURIComponent(escape(b64Decode(s.replace(/\-/g, '+').replace(/\_/g, '/')))) : '';
    }

    /** check whether an email address is valid, exposes func from klingsten snippets */
    public isEmailValid(s: string): boolean {
        return Strings.isEmailValid(s);
    }

    /** Parses a Gmail API response to a iGmail object 
     * 'to', 'from' 'cc', 'subject' are stored property 'headers'  */
    private parseRawGmailResponse(gmailApiResp: any): IEmail {

        const email = getEmptyEmail();
        email.id = gmailApiResp.id;
        email.threadId = gmailApiResp.threadId;
        email.labelIds = gmailApiResp.labelIds;
        email.snippet = gmailApiResp.snippet;
        email.historyId = gmailApiResp.historyId;
        email.isUnread = this.isEmailUnread(email.labelIds);

        if (gmailApiResp.internalDate) {
            email.internalDate = parseInt(gmailApiResp.internalDate);
        }

        const payload = gmailApiResp.payload;
        if (!payload) {
            return email;
        }

        let headers = this.indexHeaders(payload.headers);
        email.headers = headers;

        let parts = [payload];
        let firstPartProcessed = false;

        while (parts.length !== 0) {
            const part = parts.shift();
            if (part.parts) {
                parts = parts.concat(part.parts);
            }
            if (firstPartProcessed) {
                headers = this.indexHeaders(part.headers);
            }
            if (!part.body) {
                continue;
            }

            const contentDisposition = headers.get('content-disposition');
            const isHtml = part.mimeType && part.mimeType.indexOf('text/html') !== -1;
            const isPlain = part.mimeType && part.mimeType.indexOf('text/plain') !== -1;
            const isAttachment = this.isAttachment(part);
            const isInline = contentDisposition && contentDisposition.indexOf('inline') !== -1;

            if (isHtml && !isAttachment) {
                email.textHtml = this.urlB64Decode(part.body.data);
            } else if (isPlain && !isAttachment) {
                email.textPlain = this.urlB64Decode(part.body.data);
            } else if (isAttachment) {
                const body = part.body;
                if (!email.attachments) {
                    email.attachments = [];
                }
                email.attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            } else if (isInline) {
                const body = part.body;
                if (!email.inline) {
                    email.inline = [];
                }
                email.inline.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            }
            firstPartProcessed = true;
        }
        return email;
    };

    private isAttachment(part: IPart): boolean {
        if (part.body.attachmentId && part.filename) { return true; }
        return false;
    }

    /** Converts email headers (such  as "subject":"Email Subj" into
     *  map<sting,string> with the key in lowercase. Its further 
     * combines headers such as "received_from" into a single key value pair  */
    private indexHeaders(headers: any): Map<string, string> {
        const result = new Map<string, string>();

        if (!headers) { // missing headers could come from Gmail draft, or an outgoing message
            return result;
        }
        headers.forEach((v: any) => {
            let value = result.get(v.name.toLowerCase());
            if (!value) {
                value = '';
            }
            result.set(v.name.toLowerCase(), value + v.value);
        })
        return result;
    }

    /** for testing parseAddresses purpose only
     * does not mutate object Email, return a parsed copy
     */
    public test_parseAddresses(email: IEmail): IEmail {
        const copy = copyGmail(email);
        return this.parseHeaders(copy);
    }

    /**  mutates/parse IEmail headers (such as 'to', 'subject') 
     * to to, cc, from, subject attributes  
    * @param { IEmail } with 'to' 'from' 'cc' 'subject' 'bcc' set in the headers attributes
    */
    private parseHeaders(email: IEmail): IEmail {

        email.from = this.parseReceivers(email.headers.get('from'), false)[0] || []; // should be ok?
        email.to = this.parseReceivers(email.headers.get('to'), false);
        email.cc = this.parseReceivers(email.headers.get('cc'), false);
        email.bcc = this.parseReceivers(email.headers.get('bcc'), false);

        email.sentDate = parseInt(email.headers.get('date') || '');
        if (!email.sentDate) {
            email.sentDate = email.internalDate;
        }
        email.subject = email.headers.get('subject') || '';
        email.attachments = email.attachments || email.inline || [];


        // clean up
        email.inline = []; // merged with attachments into attachments
        const removeHeadersFromEmail = ['from', 'to', 'cc', 'bcc', 'subject']
        for (let i = 0; i < removeHeadersFromEmail.length; i++) {
            email.headers.delete(removeHeadersFromEmail[i]);
        }
        return email;
    }

    /** converts are string container emails, and returns them as IReceivers[]
     *  Emails are by default checked for validity, however optional parameter
     *  checkIfEmailIsValid can be set to false, whereby emails are not checked,
     *  and isValid is set to true.  ParseGmailApi.parseMessage() always set isValid=true
     *  without checking  */
    public parseReceivers(receiverStr: string = "", checkIfEmailIsValid: boolean = true): IReceiver[] {
        const receivers: IReceiver[] = [];
        if (!receiverStr) {
            return receivers;
        }
        // split string of received into array
        const strArrReceivers = Strings.splitExceptQuotes(receiverStr)
        if (!strArrReceivers) {
            return receivers;
        }

        //split name from email address
        for (let i = 0; i < strArrReceivers.length; i++) {
            const resp = Strings.splitNameFromEmail(strArrReceivers[i]);
            resp.name = this.removeUnwantedCharsFromName(resp.name);
            receivers.push({
                name: resp.name,
                email: resp.email,
                isValid: checkIfEmailIsValid ? this.isEmailValid(resp.email) : true
            });
        }
        return receivers;
    }


    private removeUnwantedCharsFromName(s: string) {
        const re = /(['"<>()!*;,#?]+)/gm
        return s.replace(re, '');
    }


    /** check if labels "unread" has been set */
    public isEmailUnread(labels: string[]): boolean {
        if (!labels) {
            return false;
        }
        const UNREAD = 'unread';
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] === UNREAD) {
                return true;
            }
        }
        return false;
    }
}