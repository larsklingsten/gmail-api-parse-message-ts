import { ParseGmailApi } from '../parse-gmail-api';
import { getEmptyEmail } from '../constants';
import { Compare, CompareError } from 'klingsten-snippets';

export class TestParseAddresses {
    constructor() {
        this.test_parseGmailApi_addresses();
    }

    test_parseGmailApi_addresses() {

        // setup //
        const svcParse = new ParseGmailApi();

        // gmail with headers only
        const gmailIn = getEmptyEmail();
        gmailIn.headers.set('content-type', 'multipart/mixed;boundary=dmRh3NkD');
        gmailIn.headers.set('from', 'Lars Klingsten <lars@ckhansen.net>')
        gmailIn.headers.set('to', '<lars.kornmod@s.com>')
        gmailIn.headers.set('cc', '<jan.dehaas@s.com>, <annette.bode@s.com>')
        gmailIn.headers.set('bcc', 'bcc <bcc@ckhansen.net>')
        gmailIn.headers.set('subject', 'RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX')
        gmailIn.headers.set('x-sender', 'Simplified Gmail v0.0.31')
        gmailIn.headers.set('date', 'Thu, 5 Sep 2019 23:33:35 -0700')
        gmailIn.headers.set('message-id', '<CA+Ntg33RvNf2eaCvqrJaZ1XFLbAncVPKbyv91OFzc87_V0qPPg@mail.gmail.com>');


        const gmailExp = getEmptyEmail();
        gmailExp.to = [{ name: '', email: 'lars.kornmod@s.com', isValid: true }];
        gmailExp.cc = [{ name: '', email: 'jan.dehaas@s.com' , isValid: true}, { name: '', email: 'annette.bode@s.com' , isValid: true}];
        gmailExp.bcc = [{ name: 'bcc', email: 'bcc@ckhansen.net', isValid: true }];          // we dont expect Bcc as the name was provided from the headers
        gmailExp.subject = 'RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX'

        const test = {
            name: "parseGmailApi.parseAddresses()",
            in: gmailIn,
            expect: gmailExp
        };

        // compare
        let errorsAll: CompareError[] = [];
        const result = svcParse.test_parseAddresses(test.in)

        let errors = Compare.objects(result, test.expect, ['subject']);
        errorsAll = errorsAll.concat(errors);

        errors = Compare.arrays(result.to, test.expect.to, ['name', 'email']);
        errorsAll = errorsAll.concat(errors);

        errors = Compare.arrays(result.cc, test.expect.cc, ['name', 'email']);
        errorsAll = errorsAll.concat(errors);

        errors = Compare.arrays(result.bcc, test.expect.bcc, ['name', 'email']);
        errorsAll = errorsAll.concat(errors);
        Compare.printErrors(errorsAll, test.name + '_to_cc_bcc' + ' tests=4');







    }

}