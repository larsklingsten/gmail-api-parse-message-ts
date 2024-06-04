import { IEmail } from './iface/iemail';

export function getEmptyEmail(): IEmail {
    const email = {
        id: '',
        size: -1,
        threadId: '',
        historyId: '',
        subject: '',
        textPlain: '',
        textHtml: '',
        internalDate: -1,
        sentDate: -1,
        from: { name: '', email: '',  isValid: true },
        to: [],
        cc: [],
        bcc: [],
        labels: [],          // parsed.labelIds of IGapiLabel[] 
        labelIds: [],        // rawID
        snippet: '',
        attachments: [],
        headers: new Map<string, string>(),
        isUnread: true,
        isDownloaded: false

    };
    return email;
}

/** returns a fresh copy of IGmail */
export function copyGmail(gmail: IEmail): IEmail {
    const copy: IEmail = JSON.parse(JSON.stringify(gmail));
    copy.headers = new Map(gmail.headers);
    return copy;
}

/** remove non printing chars, space, just intended for use for string comparison with multilines  */
export function removeNonPrint(s: string): string {
    return s.replace(/[^A-Za-zæøåÆØÅ0-9$§!"#€%&/\[\]\?{}()<>=@,.;':]/g, '');
};
