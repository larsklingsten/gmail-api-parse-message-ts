import { ParseGmailApi } from './../parse-gmail-api';
import { Compare } from 'klingsten-snippets';

export class TestParseReceivers {

    constructor() {

        this.test_stingsToEmails();

    }

   private  test_stingsToEmails() {

        const svcParseGmailApi = new ParseGmailApi();

        const test = {
            name: "svcParseReceiver()",
            insAndOuts: [
                { in: 'lars@gog.net', exp: [{ name: 'Lars', email: 'lars@gog.net' }] },
                { in: 'Lars@gog.net', exp: [{ name: 'Lars', email: 'lars@gog.net' }] }, // email in ucase
                { in: 'l@gog.net', exp: [{ name: 'L', email: 'l@gog.net' }] }

            ]
        }


        for (let i = 0; i < test.insAndOuts.length; i++) {
            const r = test.insAndOuts[i];
            const result = svcParseGmailApi.parseReceivers(r.in)

            const errors = Compare.arrays(result, r.exp, ['name', 'email']);

            Compare.printErrors(errors, test.name + ' test=' + i);

        }
    }
}