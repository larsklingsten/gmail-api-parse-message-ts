declare var require: any;
const b64Decode = require('base-64').decode;

import { IGmail } from './iface/igmail';
import { IPart } from './iface/iparts';
import { getEmptyEmail, copyGmail } from './snippets';

import { IReceiver } from './iface/ireceiver';
import { Strings } from 'klingsten-snippets';

/** parses gmail api response to a IGmail object - typescript */
export class ParseGmailApi {


    constructor() { }

    /** Decodes a URLSAFE Base64 string to its original representation */
    urlB64Decode(s: string): string {
        return s ? decodeURIComponent(escape(b64Decode(s.replace(/\-/g, '+').replace(/\_/g, '/')))) : '';
    }



    /** Parses a Gmail API response to a iGmail object 
     * 'to', 'from' 'cc', 'subject' are stored property 'headers'  */
    private parseRawGmailResponse(gmailApiResp: any): IGmail {

        const gmail = getEmptyEmail();
        gmail.id = gmailApiResp.id;
        gmail.threadId = gmailApiResp.threadId;
        gmail.labelIds = gmailApiResp.labelIds;
        gmail.snippet = gmailApiResp.snippet;
        gmail.historyId = gmailApiResp.historyId;

        if (gmailApiResp.internalDate) {
            gmail.internalDate = parseInt(gmailApiResp.internalDate);
        }

        const payload = gmailApiResp.payload;
        if (!payload) {
            return gmail;
        }

        let headers = this.indexHeaders(payload.headers);
        gmail.headers = headers;

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
                gmail.textHtml = this.urlB64Decode(part.body.data);
            } else if (isPlain && !isAttachment) {
                gmail.textPlain = this.urlB64Decode(part.body.data);
            } else if (isAttachment) {
                const body = part.body;
                if (!gmail.attachments) {
                    gmail.attachments = [];
                }
                gmail.attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            } else if (isInline) {
                const body = part.body;
                if (!gmail.inline) {
                    gmail.inline = [];
                }
                gmail.inline.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            }
            firstPartProcessed = true;
        }
        return gmail;
    };

    private isAttachment(part: IPart): boolean {
        if (part.body.attachmentId && part.filename) {
            return true;
        }
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

    /**  parses Gmail Api Response, and return a parse IGmail Object
     * @param {gmailApiResp} gmail api response 
     * @returns {IGmail } with message parsed to textPlain or textHmtl, receivers, attachments, and 
     */
    public parseMessage(gmailApiResp: any): IGmail {

        // its not evident that we only need the result, so we test to see what we got
        const resp = gmailApiResp['result'] || gmailApiResp;

        const gmail = this.parseRawGmailResponse(resp);
        this.parseHeaders(gmail);
        return gmail;
    }


    /** for testing parseAddresses purpose only
     * does not mutate object gmail, return a parsed copy
     */
    public test_parseAddresses(gmail: IGmail): IGmail {
        const copy = copyGmail(gmail);
        return this.parseHeaders(copy);
    }

   



    /**  mutates/parse IGmail headers (such as 'to', 'subject') 
     * to IGmail's to,cc,from,subject attributes  
    * @param { IGmail } with 'to' 'from' 'cc' 'subject' set in the headers attributes
    */
    private parseHeaders(gmail: IGmail): IGmail {

        gmail.from = gmail.headers.get('from') || '';
        gmail.to = this.parseReceivers(gmail.headers.get('to') || '');
        gmail.cc = this.parseReceivers(gmail.headers.get('cc') || '');
        gmail.bcc = this.parseReceivers(gmail.headers.get('bcc') || '');
        gmail.dateStr = gmail.headers.get('date') || '';
        gmail.subject = gmail.headers.get('subject') || '';
        gmail.attachments = gmail.attachments || gmail.inline || [];

        // clear up
        gmail.inline = [];
        const removeHeaders = ['from', 'to', 'cc', 'bcc', 'subject']
        removeHeaders.forEach(header => {
            gmail.headers.delete(header);
        })
        return gmail;
    }

     /** converts are string container emails, and returns them as IReceivers[] */
     public parseReceivers(receiverStr: string): IReceiver[] {
        const receivers: IReceiver[] = [];
        if (!receiverStr) {
            return receivers;
        }
        // parse string to string array
        const strArrReceivers = Strings.splitByCommaSemicolon(receiverStr)
        if (!strArrReceivers) {
            return receivers;
        }

        for (let i = 0; i < strArrReceivers.length; i++) {
            const resp = Strings.splitNameFromEmail(strArrReceivers[i])
            resp.name = this.ensureNameFromSplit(resp);
            receivers.push({ name: resp.name, email: resp.email });
        }
        return receivers;
    }

        /**  ensures that the name is always update with a name, 
     * such as a resp {name:'', email:'lars@email.com'} we extract names from the email  */
    private ensureNameFromSplit(resp: { name: string, email: string }): string {

        // if a name was not provided, then we take the first part of the email adr
        if (!resp.name) {
            const pos = resp.email.indexOf('@');
           
            // @ must be found, and is not in the first [0] position ('@email.com' is not a valid email adr )
            if (pos > 0) {
                resp.name = resp.email[0].toUpperCase() + resp.email.substr(1, pos - 1);
            } else {
                console.log(`bug: @parseReceivers email="${resp.email}".Emailadr has not "@" or nothing before "@"`);
            }
        }
        return resp.name;
    }
}