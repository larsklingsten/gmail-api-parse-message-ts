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

    /**  parses Gmail Api Response, and return a parse IGmail Object
     * @param {gmailApiResp} gmail api response 
     * @returns {IEmail } with message parsed to textPlain or textHmtl, receivers, attachments, and 
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

    private indexHeaders(headers: any) {
        const result = new Map<string, string>();
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
     * does not mutate object gmail, return a parsed copy
     */
    public test_parseAddresses(gmail: IEmail): IEmail {
        const copy = copyGmail(gmail);
        return this.parseHeaders(copy);
    }

    /**  mutates/parse IEmail headers (such as 'to', 'subject') 
     * to to, cc, from, subject attributes  
    * @param { IEmail } with 'to' 'from' 'cc' 'subject' 'bcc' set in the headers attributes
    */
    private parseHeaders(email: IEmail): IEmail {

        email.from = this.parseReceivers(email.headers.get('from'))[0]; // should be ok?
        email.to = this.parseReceivers(email.headers.get('to'));
        email.cc = this.parseReceivers(email.headers.get('cc'));
        email.bcc = this.parseReceivers(email.headers.get('bcc'));

        email.sentDate = parseInt(email.headers.get('date') || '');
        if (!email.sentDate) {
            email.sentDate = email.internalDate;
        }
        email.subject = email.headers.get('subject') || '';
        email.attachments = email.attachments || email.inline || [];


        // clear up
        email.inline = [];
        const removeHeaders = ['from', 'to', 'cc', 'bcc', 'subject']
        removeHeaders.forEach(header => {
            email.headers.delete(header);
        })
        return email;
    }

    /** converts are string container emails, and returns them as IReceivers[] */
    public parseReceivers(receiverStr: string = ""): IReceiver[] {
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
            receivers.push({ name: resp.name, email: resp.email });
        }
        return receivers;
    }
 

    private removeUnwantedCharsFromName(s: string) {
        const re = /(['"<>()!*;#?]+)/gm
        return s.replace(re, '');
    }


    // left over from previous parsingß
    public isEmailUnread(labels: string[]): boolean {
        const UNREAD = 'unread';
        for (let i = 0; i < labels.length; i++) {
            if (labels[i] === UNREAD) {
                return true;
            }
        }
        return false;
    }
}