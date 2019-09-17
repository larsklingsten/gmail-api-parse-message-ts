import { ParseGmailApi } from './../parse-gmail-api';
import { Compare, CompareError } from 'klingsten-snippets';

export class TestParseReceivers {

    constructor() {

        this.test_stingsToEmails();

    }

    private test_stingsToEmails() {

        const svcParseGmailApi = new ParseGmailApi();

        const test = {
            name: "svcParseGmailApi.parseReceivers()",
            insAndOuts: [
                { in: 'lars@gog.net', exp: [{ name: 'Lars', email: 'lars@gog.net' }] },
                { in: 'Lars@gog.net', exp: [{ name: 'Lars', email: 'lars@gog.net' }] }, // email in ucase
                { in: 'l@gog.net', exp: [{ name: 'L', email: 'l@gog.net' }] },
                { in: '"lk@ckhansen.dk" <lk@ckhansen.dk>', exp: [{ name: 'Lk', email: 'lk@ckhansen.dk' }] }
            ]
        }

        let errorsAll: CompareError[] = [];
        for (let i = 0; i < test.insAndOuts.length; i++) {
            const r = test.insAndOuts[i];
            const result = svcParseGmailApi.parseReceivers(r.in)
            const errors = Compare.arrays(result, r.exp, ['name', 'email']);
            errorsAll = errorsAll.concat(errors);
        }
        Compare.printErrors(errorsAll, test.name + ' tests=' + test.insAndOuts.length);

    }
}