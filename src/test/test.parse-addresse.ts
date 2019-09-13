import { ParseGmailApi } from '../parse-gmail-api';
import { getEmptyEmail } from '../snippets';
import { Compare } from 'klingsten-snippets';

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
        gmailExp.to = [{ name: 'Lars.kornmod', email: 'lars.kornmod@s.com' }];
        gmailExp.cc = [{ name: 'Jan.dehaas', email: 'jan.dehaas@s.com' }, { name: 'Annette.bode', email: 'annette.bode@s.com' }];
        gmailExp.bcc = [{ name: 'bcc', email: 'bcc@ckhansen.net' }];          // we dont expect Bcc as the name was provided from the headers
        gmailExp.subject = 'RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX'

        const test = {
            name: "parseGmailApi.parseAddresses()",
            in: gmailIn,
            expect: gmailExp
        };

        // compare
        const result = svcParse.test_parseAddresses(test.in)

         let errors = Compare.objects(result, test.expect, [  'subject']);
        Compare.printErrors(errors, test.name);

        errors = Compare.arrays(result.to, test.expect.to, ['name', 'email']);
        Compare.printErrors(errors, test.name + '_to');

        errors = Compare.arrays(result.cc, test.expect.cc, ['name', 'email']);
        Compare.printErrors(errors, test.name + '_cc');

        errors = Compare.arrays(result.bcc, test.expect.bcc, ['name', 'email']);
        Compare.printErrors(errors, test.name + '_bcc');







    }

}