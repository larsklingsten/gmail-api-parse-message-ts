import { IGmail } from './iface/igmail';

export function getEmptyEmail(): IGmail {
    const iGmail = {
        id: '',
        size: -1,
        threadId: '',
        historyId: '',
        subject: '',
        textPlain: '',
        textHtml: '',
        internalDate: -1,
        dateStr: '',
        from: '',
        to: [],
        cc: [],
        bcc: [],
        labels: [],          // parsed.labelIds of IGapiLabel[] 
        labelIds: [],        // rawID
        snippet: '',
        attachments: [],
        headers: new Map<string, string>()

    };
    return iGmail;
}

/** returns a fresh copy of IGmail */
export function copyGmail(gmail: IGmail): IGmail {
    const copy: IGmail = JSON.parse(JSON.stringify(gmail));
    copy.headers = new Map(gmail.headers);
    return copy;
}

 

/** remove non printing chars, space, intended for use for string comparison with multilines  */
export function removeNonPrint(s: string): string {
    return s.replace(/[^A-Za-zæøåÆØÅ0-9$§!"#€%&/\[\]\?{}()<>=@,.;':]/g, '');
};



