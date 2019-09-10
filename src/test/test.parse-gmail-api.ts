import { Snippets } from './../snippets';

import { iGmail, IAttachment } from './../iface';
import { GMAIL_RESP_LK_PLAIN, GMAIL_RESP_CLAUDIA_1ATTACH } from './test.parse-gmail-api.const';
import { ParseGmailApi } from './../parse-gmail-api';
import { Gmail } from '../gmail.class';

export class TestParseGmailApi {
    constructor() {

        this.test_parseBase64();
        this.test_parseEmail_LK_PLAIN();
        this.test_parseEmail_CLAUDIA_1ATTACH();

    }


    test_parseBase64() {
        const ENCODED = "TGFycywKCmplZyBiZWRlciBkaWcgdmVubGlnc3Qgc2VuZGUgZW4ga29waSBhZiBqZXJlcyAncmVtaXR0YW5jZScgZGV0YWxqZXIuIEJlbMO4YmV0IGVyIGVuZG51IGlra2UgbW9kdGFnZXQ6IExhcnMKCi0tLS0tIG9yaWdpbmFsIG1lc3NhZ2UgLS0tLS0KRnJvbTogPGxhcnMua29ybm1vZEB1YnMuY29tPgpUbzogPGxhcnNAa2xpbmdzdGVuLm5ldD4KQ2M6IDxqYW4uZGVoYWFzQHVicy5jb20-LCA8YW5uZXR0ZS5ib2RlQHVicy5jb20-CkRhdGU6IFRodSwgNSBTZXAgMjAxOSAxMzo0MDo0NSArMDAwMAo="
        const DECODED = Snippets.removeNonPrint(`Lars,
                        jeg beder dig venligst sende en kopi af jeres 'remittance' detaljer. Beløbet er endnu ikke modtaget: Lars
                        ----- original message -----
                        From: <lars.kornmod@ubs.com>
                        To: <lars@klingsten.net>
                        Cc: <jan.dehaas@ubs.com>, <annette.bode@ubs.com>
                        Date: Thu, 5 Sep 2019 13:40:45 +0000`);

        const test = {
            name: "parseGmailApi.urlB64Decode 1/1",
            func: (s: string) => parseGmailApi.urlB64Decode,
            in: ENCODED,
            exp: DECODED
        };

        const parseGmailApi = new ParseGmailApi();
        const result = parseGmailApi.urlB64Decode(ENCODED)


        const isSuccess = Snippets.removeNonPrint(result) === test.exp;
        console.log("isSuccess", isSuccess, test.name);

        if (!isSuccess) {
            console.log(`  -> got=len=${result.length}  expect=len=${test.exp.length}`);

        }

    }

    test_parseEmail_LK_PLAIN() {

        // setup // 
        const parseGmailApi = new ParseGmailApi();
        const HEADERS = new Map<string, string>();
        HEADERS.set(
            'received', 'from 726060055156 named unknown by gmailapi.google.com with ' +
            'HTTPREST; Thu, 5 Sep 2019 23:33:35 -0700from 726060055156 named ' +
        'unknown by gmailapi.google.com with HTTPREST; Thu, 5 Sep 2019  23:33:33 -0700');

        HEADERS.set('content-type', 'multipart/mixed;boundary=dmRh3NkD')
        HEADERS.set('from', 'Lars Klingsten <lars@ckhansen.net>')
        HEADERS.set('to', '<lars.kornmod@s.com>')
        HEADERS.set('cc', '<jan.dehaas@s.com>, <annette.bode@s.com>')
        HEADERS.set('bcc', 'bcc <bcc@ckhansen.net>')
        HEADERS.set('subject', 'RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX')
        HEADERS.set('x-sender', 'Simplified Gmail v0.0.31')
        HEADERS.set('date', 'Thu, 5 Sep 2019 23:33:35 -0700')
        HEADERS.set('message-id', '<CA+Ntg33RvNf2eaCvqrJaZ1XFLbAncVPKbyv91OFzc87_V0qPPg@mail.gmail.com>');


        const expectGmail: iGmail = {
            id: '16d054733b8b1ea1',
            threadId: '',
            snippet: '',
            historyId: '',
            internalDate: 0,
            textPlain: `Lars,jegbederdigvenligstsendeenkopiafjeres'remittance'detaljer.Beløbeterendnuikkemodtaget:LarsoriginalmessageFrom:<lars.kornmod@ubs.com>To:<lars@klingsten.net>Cc:<jan.dehaas@ubs.com>,<annette.bode@ubs.com>Date:Thu,5Sep201913:40:450000`,
            textHtml: '',
            attachments: [],
            headers: HEADERS,
            labelIds: ['Label_956', 'Label_1113', 'Label_490', 'SENT', 'Label_4358'],
        };

        const test = {
            name: "parseGmailApi.parseMessage() LK_PLAIN",
            func: (x: object) => parseGmailApi.parseMessage,
            in: GMAIL_RESP_LK_PLAIN['result'],
            expect: new Gmail(expectGmail)
        };

        // evaluate // 
        let result = new ParseGmailApi().parseMessage(test.in);
        let resultEmail = new Gmail(result);
        const isSuccess = resultEmail.compare(test.expect);

        // write
        console.log("isSuccess", isSuccess, test.name);
        if (!isSuccess) {
            console.log(`  -> got=${resultEmail.string()} expect: ${test.expect.string()}`);
        }
    }


    test_parseEmail_CLAUDIA_1ATTACH() {
        // setup // 
        const parseGmailApi = new ParseGmailApi();
        const HEADERS = new Map<string, string>();
        HEADERS.set('from', "Claudia Haupt <claudia.haupt@aktuell-team.de>")
        HEADERS.set('to', "<kf80@overseas.com.sg>")
        HEADERS.set('subject', "Zahlungsaufforderung")
        HEADERS.set('date', "Fri, 23 Nov 2018 11:47:06 +0000")
        HEADERS.set('message-id', "<DIIE.00004C820000F86B@192.168.102.94>");


        const ATTACHMENTS: IAttachment[] = [{
            filename: 'FI7100-oben11232018114520001.pdf',
            mimeType: 'application/octet-stream',
            size: 730600,
            attachmentId: 'ANGjdJ-r8DxBv5YeTQSbUm3SDlKUoQbOZRLfJDcuu5iV0QqMQjqm_jRZHwIzYMAhFj2I5F6SDZ4wBRsxK_435guiFlv3Xh_UvT7hK-d7JNfZttHQ06TwStY3_U5XBe9u_upfiO7sgILuqWeEGfIdEPQ4sRchg9_L3muhT_MIWI6jLP3lwahN3EnNe6R7we9BGZhFMDhAlLXJaq9zMYmtq-E9OiGYF-YHDnUP3R0RZVbWmH2NAiSwoD_XrrzUZSrg7Asdxh9dlrvgKvLt4idQDNddlrVt4wtd_FypRqj8iquhJjlUhBtGSjN_8zTQfD2byeu1z4qZHRGpsz07qVeF1LuTjefLIeM49cmxjlYNihRD0IFnLKz-iNv20IYIYdSNi4nM5FmKw3Uv-6SvkKmb',

        }];


        const expectGmail: iGmail = {
            id: '1674065674141fb3',
            threadId: '',
            snippet: '',
            historyId: '',
            internalDate: 0,
            textPlain: `SehrgeehrterHerrKlingsten,anbeibersendenwirIhnendieZahlungsaufforderungdesSchleswigHolsteinischenOberlandesgerichts.Essindbiszum08.12.201811.280,Eurozuzahlen.DadiesmitIhremProzessinVerbindungsteht,w
            erdenwirdiesesSchreibenIhremRechtsanwaltHerrnJrgensenebenfallszurVerfgungstellen.DearMr.Klingsten,PleasefindattachedthepaymentrequestoftheSchleswigHolsteinHigherRegionalCourt.Therearetobepaiduntil08
            .12.201811.280,Euro.Sincethisisconnectedwithyourcourtprocess,wewillalsomakethisletteravailabletoyourlawyerMr.Jrgensen.mitfreundlichenGren/withkindregardsClaudiaHauptSteuerberatungsteamAktuellGmbHBah
            nhofstrae202224975MaasbllTel.:04634/93190Fax:04634/931919Geschftsfhrer:PeterBlle.Steuerberater.Dipl.Kaufmann.Dipl.BetriebswirtHRB3251AmtsgerichtFlensburgIDNr.DE188046238,Steuernummer211529511059`,
            textHtml: '',
            attachments: ATTACHMENTS,
            headers: HEADERS,
            labelIds: ['Label_80', 'Label_301', 'IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
        };

        const test = {
            name: "parseGmailApi.parseMessage() CLAUDIA_1ATTACH",
            func: (x: object) => parseGmailApi.parseMessage,
            in: GMAIL_RESP_CLAUDIA_1ATTACH['result'],
            expect: new Gmail(expectGmail)
        };

        // evaluate // 
        let result = new ParseGmailApi().parseMessage(test.in);
        let resultEmail = new Gmail(result);
        const isSuccess = resultEmail.compare(test.expect);

        // write
        console.log("isSuccess", isSuccess, test.name);
        if (!isSuccess) {
            console.log(`  -> got=${resultEmail.string()} expect: ${test.expect.string()}`);
        }



    }



}

