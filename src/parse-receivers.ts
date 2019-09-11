
import { splitByCommaColon } from './snippets';
const CLASS_NAME = 'ParseReceiverService';

export class ParseReceiverService {
    static initCount: number = 0;

    constructor() {
        ParseReceiverService.initCount++
        console.log("@" + CLASS_NAME, 'init', ParseReceiverService.initCount);
    }

    /**  TODO -> much more work to do (should return an array of receiver class or interface) */
    public parseReceivers(receivers: string): string[] {
        if (!receivers) {
            return [];
        }

        // TODO this does not appear to be right? We must always split
        if (!receivers.includes(',')) {
            return [receivers];
        }

        const msgReceivers = receivers.split(',');
        for (let i = 0; i < msgReceivers.length; i++) {
            msgReceivers[i] = msgReceivers[i].trim();
        };
        return msgReceivers;
    }

    // convertOldEmailAdrToNew converts old emails to new types.
    // old style has emails in a single field seperated by a comma, or a semicolon
    // The func always return an array with minimum a single address item (in name="")
    convertOldEmailAdrToNew(emailStr: string): string[] {

        const emails = splitByCommaColon(emailStr)
        return emails
    }


}