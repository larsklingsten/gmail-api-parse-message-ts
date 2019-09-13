import { Compare} from 'klingsten-snippets';
import { ParseReceiverService } from './../parse-receivers';
 

export class TestStringsToEmails {
    constructor() {
        this.test_stingsToEmails();
    }

    test_stingsToEmails() {

        const svcParseReceiver = new ParseReceiverService();


        const test = {
            name: "parseStrArrayToReceivers()",
            insAndOuts: [
                { in: ['lars@klingsten.net'], exp: [{ name: 'lars', email: 'lars@klingsten.net' }] }

            ]
        }


        for (let i = 0; i < test.insAndOuts.length; i++) {
            const r = test.insAndOuts[i];
            const result = svcParseReceiver.parseStrArrayToReceivers(r.in)

            const errors = Compare.arrays(result, r.exp, ['name', 'email']);

            Compare.printErrors(errors, test.name + ' test=' + i);
 
        }
    }

}