import { Compare } from 'klingsten-snippets';



import { IGmail } from '../iface/igmail';
import { GMAIL_RESP_LK_PLAIN, GMAIL_RESP_CLAUDIA_1ATTACH, GMAIL_RESP_UBS_BUGFIX, GMAIL_RESP_SPARKRON_ATTACH } from './test.parse-gmail-api.const';
import { ParseGmailApi } from './../parse-gmail-api';
import { IAttachment } from '../iface/iattachment';
import { getEmptyEmail, removeNonPrint } from '../snippets';


const ATTRIB_RECEIVERS = ['id', 'to', 'cc', 'from', 'subject']
const ATTRIB_TEXTPLAIN_LABELSID = ['textPlain', 'labelIds']
const ATTRIBUTES_TEXTHTML = ['textHtml']
const ATTRIB_FOR_ATTACH = ['filename', 'mimeType', 'size', 'attachmentId'];



export class TestParseGmailApi {

    private parseGmailApi = new ParseGmailApi();

    constructor() {
        /**  should all run */
        this.test_parseBase64();
        this.test_parseEmail_LK_PLAIN();
        this.test_parseEmail_CLAUDIA_1ATTACH();
        this.test_parseEmail_UBS_BUGFIX();
        this.test_parseEmail_SPARKRON_ATTACH();
    }

    test_parseBase64() {
        const ENCODED = "TGFycywKCmplZyBiZWRlciBkaWcgdmVubGlnc3Qgc2VuZGUgZW4ga29waSBhZiBqZXJlcyAncmVtaXR0YW5jZScgZGV0YWxqZXIuIEJlbMO4YmV0IGVyIGVuZG51IGlra2UgbW9kdGFnZXQ6IExhcnMKCi0tLS0tIG9yaWdpbmFsIG1lc3NhZ2UgLS0tLS0KRnJvbTogPGxhcnMua29ybm1vZEB1YnMuY29tPgpUbzogPGxhcnNAa2xpbmdzdGVuLm5ldD4KQ2M6IDxqYW4uZGVoYWFzQHVicy5jb20-LCA8YW5uZXR0ZS5ib2RlQHVicy5jb20-CkRhdGU6IFRodSwgNSBTZXAgMjAxOSAxMzo0MDo0NSArMDAwMAo="
        const DECODED = removeNonPrint(`Lars,
                jeg beder dig venligst sende en kopi af jeres 'remittance' detaljer. Beløbet er endnu ikke modtaget: Lars
                ----- original message -----
                From: <lars.kornmod@ubs.com>
                To: <lars@klingsten.net>
                Cc: <jan.dehaas@ubs.com>, <annette.bode@ubs.com>
                Date: Thu, 5 Sep 2019 13:40:45 +0000`);

        const test = {
            name: "parseGmailApi.urlB64Decode 1/1",
            func: (s: string) => this.parseGmailApi.urlB64Decode,
            in: ENCODED,
            exp: DECODED
        };
        const result = this.parseGmailApi.urlB64Decode(ENCODED)
        const isSuccess = removeNonPrint(result) === test.exp;
        console.log("isSuccess", isSuccess, test.name);
        if (!isSuccess) {
            console.log(`  -> got=len=${result.length}  expect=len=${test.exp.length}`);
        }
    }

    test_parseEmail_LK_PLAIN() {

        // setup //
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

        const expectGmail: IGmail = getEmptyEmail();
        expectGmail.id = '16d054733b8b1ea1';
        expectGmail.textPlain = `Lars,jegbederdigvenligstsendeenkopiafjeres'remittance'detaljer.Beløbeterendnuikkemodtaget:LarsoriginalmessageFrom:<lars.kornmod@ubs.com>To:<lars@klingsten.net>Cc:<jan.dehaas@ubs.com>,<annette.bode@ubs.com>Date:Thu,5Sep201913:40:450000`;
        expectGmail.headers = HEADERS;
        expectGmail.labelIds = ['Label_956', 'Label_1113', 'Label_490', 'SENT', 'Label_4358'];

        const test = {
            name: "parseGmailApi.parseMessage() LK_PLAIN",
            in: GMAIL_RESP_LK_PLAIN,
            expect: expectGmail
        };

        // evaluate //
        let result = this.parseGmailApi.parseMessage(test.in);
        result.textPlain = removeNonPrint(result.textPlain);
        result.textHtml = removeNonPrint(result.textHtml);
        const attribs = ATTRIB_TEXTPLAIN_LABELSID
        const compareErrors = Compare.objects(result, test.expect, attribs);

        // write
        Compare.printErrors(compareErrors, test.name);
    }

    test_parseEmail_CLAUDIA_1ATTACH() {
        // setup //

        const HEADERS = new Map<string, string>();
        HEADERS.set('from', "Claudia Haupt <claudia.haupt@aktuell-team.de>")
        HEADERS.set('to', "<kf80@oc.com.sg>")
        HEADERS.set('subject', "Zahlungsaufforderung")
        HEADERS.set('date', "Fri, 23 Nov 2018 11:47:06 +0000")
        HEADERS.set('message-id', "<DIIE.00004C820000F86B@192.168.102.94>");

        const ATTACHMENTS: IAttachment[] = [{
            filename: 'FI7100-oben11232018114520001.pdf',
            mimeType: 'application/octet-stream',
            size: 730600,
            attachmentId: 'ANGjdJ-r8DxBv5YeTQSbUm3SDlKUoQbOZRLfJDcuu5iV0QqMQjqm_jRZHwIzYMAhFj2I5F6SDZ4wBRsxK_435guiFlv3Xh_UvT7hK-d7JNfZttHQ06TwStY3_U5XBe9u_upfiO7sgILuqWeEGfIdEPQ4sRchg9_L3muhT_MIWI6jLP3lwahN3EnNe6R7we9BGZhFMDhAlLXJaq9zMYmtq-E9OiGYF-YHDnUP3R0RZVbWmH2NAiSwoD_XrrzUZSrg7Asdxh9dlrvgKvLt4idQDNddlrVt4wtd_FypRqj8iquhJjlUhBtGSjN_8zTQfD2byeu1z4qZHRGpsz07qVeF1LuTjefLIeM49cmxjlYNihRD0IFnLKz-iNv20IYIYdSNi4nM5FmKw3Uv-6SvkKmb',

        }];

        const expectGmail: IGmail = getEmptyEmail();
        expectGmail.id = '1674065674141fb3';
        expectGmail.textPlain = removeNonPrint(`SehrgeehrterHerrKlingsten,anbeibersendenwirIhnendieZahlungsaufforderungdesSchleswigHolsteinischenOberlandesgerichts.Essindbiszum08.12.201811.280,Eurozuzahlen.DadiesmitIhremProzessinVerbin
        dungsteht,werdenwirdiesesSchreibenIhremRechtsanwaltHerrnJrgensenebenfallszurVerfgungstellen.DearMr.Klingsten,PleasefindattachedthepaymentrequestoftheSchleswigHolsteinHigherRegionalCourt.Therearetobepaid
        until08.12.201811.280,Euro.Sincethisisconnectedwithyourcourtprocess,wewillalsomakethisletteravailabletoyourlawyerMr.Jrgensen.mitfreundlichenGren/withkindregardsClaudiaHauptSteuerberatungsteamAktuellGmbH
        Bahnhofstrae202224975MaasbllTel.:04634/93190Fax:04634/931919Geschftsfhrer:PeterBlle.Steuerberater.Dipl.Kaufmann.Dipl.BetriebswirtHRB3251AmtsgerichtFlensburgIDNr.DE188046238,Steuernummer211529511059`);
        expectGmail.attachments = ATTACHMENTS;
        expectGmail.headers = HEADERS;
        expectGmail.labelIds = ['Label_80', 'Label_301', 'IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'];

        const test = {
            name: "parseGmailApi.parseMessage() CLAUDIA_1ATTACH",
            in: GMAIL_RESP_CLAUDIA_1ATTACH['result'],
            expect: expectGmail
        };

        // execute //
        let result = this.parseGmailApi.parseMessage(test.in);
        result.textPlain = removeNonPrint(result.textPlain);
        result.textHtml = removeNonPrint(result.textHtml);

        // evaluate
        const attribs = ATTRIB_TEXTPLAIN_LABELSID
        let compareErrors = Compare.objects(result, test.expect, attribs);
        Compare.printErrors(compareErrors, test.name);


        compareErrors = Compare.arrays(result.attachments, test.expect.attachments, ATTRIB_FOR_ATTACH);
        Compare.printErrors(compareErrors, test.name + "_attach");
    }

    test_parseEmail_UBS_BUGFIX() {
        // setup //
        const HEADERS = new Map<string, string>();
        HEADERS.set('from', "<annette.bode@s.com>")
        HEADERS.set('to', "<lars@ckhansen.net>, <lars.kornmod@s.com>")
        HEADERS.set('cc', "<jan.dehaas@s.com>")

        HEADERS.set('subject', "RE: Telefonsamtale idag kl 14.05 KEY:UBS LUX")
        HEADERS.set('date', "Fri, 6 Sep 2019 07:29:26 +0000")
        HEADERS.set('message-id', "<909B4809D55E7B4E97FC9B9FC8B0E4FF1349C4A9@nluxc500pn1.ubsprod.msad.ubs.net>");

        const ATTACHMENTS: IAttachment[] = [{
            filename: 'disclaim.txt',
            mimeType: 'text/plain',
            size: 2207,
            attachmentId: 'ANGjdJ93Q20-PpHQeFyRH3cWaijILrinuqwGKfl84N-KC1SLMkf_K0359ZcijcJkrz-KMzUPBW21FbyVDfVLy2dyuZ6LhvLA4b3e7DHCb1bpM4KBVpuI6xGb8cz3uJ6WXkXrE70EnIdf3EQdZ9iJp162aW02hyS_qef2DQy_mZmjcGLGy-WadZ2_45sZ6c6GomxL8ibYmRZQISsK6SIqYyqC-85z0fvQcHfRhWUptH_9746SO6DF-vjOiZTJt3DPlDIZtw8o3CrAphP5mUMb9T9t1YWwmSILKPIw0mYeSbGj6o9AOmTBJfMYnZVvR1WV0aH9GK9BwvAMEeBUTQv9yftPKrpfVahSfKovphJYy8peP8eO3ZY1yRgGYa72LxY',
        }];

        const expectGmail: IGmail = getEmptyEmail();
        expectGmail.id = '16d057a6b3bf99d4';
        expectGmail.textPlain = removeNonPrint(`Lars,CutoffforatsendeDKKerkl.11:30.Pengebliversendtmedvaløridag.VhAnnetteOriginalMessageFrom:LarsKlingsten[mailto:lars@klingsten.net]Sent:Freitag,6.September201908:34To:Kornmod,LarsCc:DeHaas,Jan;Bode,AnnetteSubject:[External]RE:Telefonsamtaleidagkl14.05KEY:UBSLUXLars,jegbederdigvenligstsendeenkopiafjeres'remittance'detaljer.Beløbeterendnuikkemodtaget:LarsoriginalmessageFrom:<lars.kornmod@ubs.com>To:<lars@klingsten.net>Cc:<jan.dehaas@ubs.com>,<annette.bode@ubs.com>Date:Thu,5Sep201913:40:450000`);
        expectGmail.attachments = ATTACHMENTS;
        expectGmail.headers = HEADERS;
        expectGmail.labelIds = ['Label_490', 'CATEGORY_PERSONAL', 'INBOX', 'Label_4358'];


        const test = {
            name: "parseGmailApi.parseMessage() UBS BAD",
            in: GMAIL_RESP_UBS_BUGFIX['result'],
            expect: expectGmail
        };

        // evaluate //
        let result = this.parseGmailApi.parseMessage(test.in);
        result.textPlain = removeNonPrint(result.textPlain);
        result.textHtml = removeNonPrint(result.textHtml); // not tested
        const attribs = ATTRIB_TEXTPLAIN_LABELSID


        // write
        const compareErrors = Compare.objects(result, test.expect, attribs);
        Compare.printErrors(compareErrors, test.name);

        const compareErrors_attach = Compare.arrays(result.attachments, test.expect.attachments, ATTRIB_FOR_ATTACH);
        Compare.printErrors(compareErrors_attach, test.name + "_attach");

    }

    test_parseEmail_SPARKRON_ATTACH() {
        // setup //
        const HEADERS = new Map<string, string>();
        HEADERS.set('from', "km@sparkron.dk")
        HEADERS.set('to', "Lars Klingsten <lars@klingsten.net>")
        HEADERS.set('subject', "Vedr.: Fwd: Sparekassen Kronjylland")
        HEADERS.set('date', "Mon, 9 Sep 2019 13:43:27 +0200")
        HEADERS.set('message-id', "<OFC9BA20DA.4F3D4261-ONC1258470.004061A4-C1258470.0040674B@fejl.sdc.dk>");

        const ATTACHMENTS: IAttachment[] = [];

        const expectGmail: IGmail = getEmptyEmail();


        expectGmail.id = '16d15d60afbe8aea';
        expectGmail.from = 'km@sparkron.dk';
        expectGmail.to = [{ name: 'Lars Klingsten', email: 'lars@klingsten.net' }];
        expectGmail.subject = "Vedr.: Fwd: Sparekassen Kronjylland"
        expectGmail.textPlain = `HejLarsHeltokIkiggerbareindenandendagVenlighilsenKlausMadsenSouschefSkt.PaulsAfdelingJægergårdsgade100B,8000AarhusCEmailkm@sparkron.dkTlf.87321106Fra:LarsKlingsten<lars@klingsten.net>Til:km@sparkron.dkDato:0909201913:42Emne:Vedr.:Fwd:SparekassenKronjyllandHejKlaus,Jegbliverdesværrenødtiludsættemødetidag.Mvh/LarsKlingstenoriginalmessageFrom:km@sparkron.dkTo:LarsKlingsten<lars@klingsten.net>Cc:Date:Thu,5Sep201913:04:440200HejLarsFairnok.Jeghjælpergernemedkonto,nemkontoogmastercarddebit.JegharbrugforatIudfylderogkommerindmedkundeskemalegitimation(pasogsygesikringsbevis)VenlighilsenKlausMadsenSouschefSkt.PaulsAfdelingJægergårdsgade100B,8000AarhusCEmailkm@sparkron.dkTlf.87321106Fra:LarsKlingsten<lars@klingsten.net>Til:km@sparkron.dkDato:0509201912:57Emne:Vedr.:Fwd:SparekassenKronjyllandHejKlaus,MinbankharikkeenafdelingiAarhusMvh/Lars.originalmessageFrom:km@sparkron.dkTo:LarsKlingsten<lars@klingsten.net>Cc:Date:Thu,5Sep201912:40:440200HejLarsSelvtak.Måjegsørge,hvorforIikkebenytterdinbank?(jegtrormåskeIkanfådetlavetgratisder)VenlighilsenKlausMadsenSouschefSkt.PaulsAfdelingJægergårdsgade100B,8000AarhusCEmailkm@sparkron.dkTlf.87321106Fra:LarsKlingsten<lars@klingsten.net>Til:KlausMadsen<km@sparkron.dk>Cc:RYOMAKATO<rkato1911@gmail.com>,ck@klingsten.netDato:0409201916:38Emne:Fwd:SparekassenKronjyllandHejKlausMadsen,Takfordithurtigetilbagesvar.Detsætterjegprispå.Ryomavores15årigeudvekslingsstudentfraJapan,oghanskalbohososdetnæsteårstid.JegharerRyomasværge,menshaneriDK.HanharbrugforenNemKonto,ogvalgetpåKronjyllandersketfordiIerdennærmestebank.Hanharisagensnaturingenpension,lønsedlerosv.Hanerklartilatkommeforbiformedpasoggultsygesikringskort,anytimemvh/LarsKlingsten23237004originalmessageFrom:RYOMAKATO<rkato1911@gmail.com>To:"lars@klingsten.net"<lars@klingsten.net>Cc:Date:Wed,4Sep201916:25:230200ForwardedmessageFrom:<km@sparkron.dk>Date:Wed,Sep4,2019at16:04Subject:SparekassenKronjyllandTo:<rkato1911@gmail.com>HejRyomaTakfordinhenvendelse.Foratkunnebehandledinhenvendelse,viljegbededigomatsendemigfølgendeøkonomiskedokumenter:3senestelønsedlerGivemigadgangtilskat,sevedhæftetvejledningOversigtoverdinefasteudgifterKontooversigtfranuværendebankKopiafpensionsinfo,kanhentespåpensionsinfo.dkDerudoverviljeggernehøremereom:Hvorforerdupåudkigefterennybank?Hvorforerdetosduskrivertil?Hvaderdinforventningtilossombank?Jegserfremtilathørefradig.GodaftenVenlighilsenKlausMadsenSouschef[image:sparekassenkronjylland]<http://sparkron.dk/>Skt.PaulsAfdelingJægergårdsgade100B,8000AarhusC<https://www.google.com/maps/search/J%C3%A6gerg%C3%A5rdsgade100B,8000AarhusC?entry=gmail&source=g>Emailkm@sparkron.dkTlf.87321106[image:nyhedsbrev]<http://sparkron.dk/nyhedsbrev/>[image:twitter]<https://twitter.com/sparkronjylland/>[image:facebook]<http://facebook.com/sparekassenkronjylland/>[image:LinkedIn]<https://www.linkedin.com/company/27187/><https://www.sparkron.dk/privat/selvbetjening/applepay>`;
        expectGmail.attachments = ATTACHMENTS;
        expectGmail.headers = HEADERS;
        expectGmail.labelIds = ['IMPORTANT', 'Label_9061698769113909650', 'Label_418', 'CATEGORY_PERSONAL', 'INBOX', 'Label_4358'];

        const test = {
            name: "parseGmailApi.parseMessage() SPARKRON_ATTACH",
            in: GMAIL_RESP_SPARKRON_ATTACH['result'],
            expect: expectGmail
        };

        // test 
        let result = this.parseGmailApi.parseMessage(test.in);
        result.textPlain = removeNonPrint(result.textPlain);
        result.textHtml = removeNonPrint(result.textHtml);
        const attribs = ATTRIB_RECEIVERS.concat(ATTRIB_TEXTPLAIN_LABELSID)

        // evaluate
        const compareErrors = Compare.objects(result, test.expect, attribs);
        Compare.printErrors(compareErrors, test.name);

        const compareErrors_attach = Compare.arrays(result.attachments, test.expect.attachments, ATTRIB_FOR_ATTACH);
        Compare.printErrors(compareErrors_attach, test.name + "_attach");
    }

}
