import { IReceiver } from './iface/ireceiver';

import { Strings} from 'klingsten-snippets';
const CLASS_NAME = 'ParseReceiverService';

export class ParseReceiverService {
    static initCount: number = 0;

    constructor() {
        ParseReceiverService.initCount++
        console.log("@" + CLASS_NAME, 'init', ParseReceiverService.initCount);
    }


    public parseReceivers(receiverStr: string): IReceiver[] {

        if (!receiverStr) {
            return [];
        }
        // parse string to string array
        const receiverStrArray = Strings.splitByCommaSemicolon(receiverStr)
        if (!receiverStrArray) {
            return [];
        }

        // parse receiverStrArray to IIeceiver array
        return this.parseStrArrayToReceivers(receiverStrArray);
    }


    /**  TODO -> much more work to do (should return an array of receiver class or interface) */
    public parseStrArrayToReceivers(strReceivers: string[]): IReceiver[] {

        const receivers: IReceiver[] = [];
        for (let i = 0; i < strReceivers.length; i++) {

            // parse strReceiver, which should contain except one email address, but eventual name 





            receivers.push({ name: '', email: strReceivers[i] })
        }
        return receivers;
    }

    // convertOldEmailAdrToNew converts old emails to new types.
    // old style has emails in a single field seperated by a comma, or a semicolon
    // The func always return an array with minimum a single address item (in name="")
    convertOldEmailAdrToNew(emailStr: string): string[] {

        const emails = Strings.splitByCommaSemicolon(emailStr)
        return emails
    }


}