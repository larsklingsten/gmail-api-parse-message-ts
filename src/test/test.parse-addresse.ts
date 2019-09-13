import { ParseGmailApi } from '../parse-gmail-api';
import { getEmptyEmail } from '../snippets';

export class TestParseAddresses {
    constructor() {
        this.test_parseGmailApi_addresses();
    }

    test_parseGmailApi_addresses() {



        // TODO awaiting convertion from string to iReceiver // 

        /*
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

        // gmail with 'to' 'cc' etc set; 


        // TODO awaiting convertion from string to iReceiver // 

        const gmailExp = getEmptyEmail();
        gmailExp.to = ['<lars.kornmod@s.com>'];
        gmailExp.cc = ['<jan.dehaas@s.com>', '<annette.bode@s.com>'];
        gmailExp.bcc = ['bcc <bcc@ckhansen.net>'];
        gmailExp.subject = 'RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX'

        const test = {
            name: "parseGmailApi.parseAddresses()",
            in: gmailIn,
            expect: gmailExp
        };

        // compare
        const result = svcParse.test_parseAddresses(test.in)
        const compareErrors = compareObject(result, test.expect, ['to', 'cc', 'bcc', 'subject']);

        printResult(compareErrors, test.name);

*/
    }

}