declare var require: any;
const b64Decode = require('base-64').decode;
import { iGmail } from './iface';

export class ParseGmailApi {

    /** Decodes a url safe Base64 string to its original representation */
    urlB64Decode(s: string): string {
        return s ? decodeURIComponent(escape(b64Decode(s.replace(/\-/g, '+').replace(/\_/g, '/')))) : '';
    }




    indexHeaders(headers: any) {

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

    /**
     * Takes a response from the Gmail API's GET message method and extracts all
     * the relevant data.
     * @param  {object} Gmail response
     * @return {object}  iGmail 
     */
    parseMessage(response: any): iGmail {


        const result: iGmail = {
            id: response.id,
            threadId: response.threadId,
            labelIds: response.labelIds,
            snippet: response.snippet,
            historyId: response.historyId,
            internalDate: -1,
            headers: new Map<string, string>(),
            isHtml: false,
            isPlain: false,
            textHtml: '',
            textPlain: '',
            attachments: []
        };
        if (response.internalDate) {
            result.internalDate = parseInt(response.internalDate);
        }

        var payload = response.payload;
        if (!payload) {
            return result;
        }

        let headers = this.indexHeaders(payload.headers);
        result.headers = headers;

        var parts = [payload];
        var firstPartProcessed = false;

        while (parts.length !== 0) {
            var part = parts.shift();
            if (part.parts) {
                parts = parts.concat(part.parts);
            }
            if (firstPartProcessed) {
                headers = this.indexHeaders(part.headers);
            }

            if (!part.body) {
                continue;
            }

            const isHtml = part.mimeType && part.mimeType.indexOf('text/html') !== -1;
            const isPlain = part.mimeType && part.mimeType.indexOf('text/plain') !== -1;

            const contentDisposition = headers.get('content-disposition')
            const isAttachment = contentDisposition && contentDisposition.indexOf('attachment') !== -1;
            const isInline = contentDisposition && contentDisposition.indexOf('inline') !== -1;

            if (isHtml && !isAttachment) {
                result.textHtml = this.urlB64Decode(part.body.data);
            } else if (isPlain && !isAttachment) {
                result.textPlain = this.urlB64Decode(part.body.data);
            } else if (isAttachment) {
                const body = part.body;
                if (!result.attachments) {
                    result.attachments = [];
                }
                result.attachments.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            } else if (isInline) {
                const body = part.body;
                if (!result.inline) {
                    result.inline = [];
                }
                result.inline.push({
                    filename: part.filename,
                    mimeType: part.mimeType,
                    size: body.size,
                    attachmentId: body.attachmentId,
                    headers: this.indexHeaders(part.headers)
                });
            }

            firstPartProcessed = true;
        }

        return result;
    };


}