declare var require: any;
const b64Decode = require('base-64').decode;

import { IGmail } from './iface/igmail';
import { IPart } from './iface/iparts';
import { getEmptyEmail, copyGmail } from './snippets';
import { ParseReceiverService } from './parse-receivers';

/** parses gmail api response to a IGmail object - typescript */
export class ParseGmailApi {

    private svcParseReceivers: ParseReceiverService;

    constructor() {
        this.svcParseReceivers = new ParseReceiverService()
    }

    /** Decodes a URLSAFE Base64 string to its original representation */
    urlB64Decode(s: string): string {
        return s ? decodeURIComponent(escape(b64Decode(s.replace(/\-/g, '+').replace(/\_/g, '/')))) : '';
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
        this.parseAddresses(gmail);
        return gmail;
    }


    /** for testing parseAddresses purpose only
     * does not mutate object gmail, return a parsed copy
     */
    public test_parseAddresses(gmail: IGmail): IGmail {
        const copy = copyGmail(gmail);
        return this.parseAddresses(copy);
    }

    /**  mutates/parse IGmail headers (such as 'to', 'subject') 
     * to IGmail's to,cc,from,subject attributes  
    * @param { IGmail } with 'to' 'from' 'cc' 'subject' set in the headers attributes
    */
    private parseAddresses(gmail: IGmail): IGmail {

        gmail.from = gmail.headers.get('from') || '';
        gmail.to = this.svcParseReceivers.parseReceivers(gmail.headers.get('to') || '');
        gmail.cc = this.svcParseReceivers.parseReceivers(gmail.headers.get('cc') || '');
        gmail.bcc = this.svcParseReceivers.parseReceivers(gmail.headers.get('bcc') || '');
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
}