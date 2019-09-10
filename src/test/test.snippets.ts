import { Snippets } from './../snippets';
export class TestSnippets {

    constructor() {
        this.test_removeNonChar();
    }

    test_removeNonChar() {
        const snippets = new Snippets();

        const tests = [{
            name: "snippets.removeNonAsciiChars",
            func: Snippets.removeNonPrint,
            insAndOuts: [
                { in: '', exp: '' },
                { in: 'ascii', exp: 'ascii' },
                { in: ' remove spaces ', exp: 'removespaces' },
                { in: 'check danish ææøåÆØ', exp: 'checkdanishææøåÆØ' },
                { in: 'new\nline', exp: 'newline' },
                { in: 'code@ckhansen.dk', exp: 'code@ckhansen.dk' },
                { in: 'lars <code@ckhansen.dk>', exp: 'lars<code@ckhansen.dk>' },
                { in: '"lars" <code@ckhansen.dk>', exp: '"lars"<code@ckhansen.dk>' },
                { in: "''", exp: "''" },
                { in: '""', exp: '""' },
                { in: "{[code]}", exp: "{[code]}" },
                { in: ",.;:$§!\#€%&/()=?", exp: ",.;:$§!\#€%&/()=?" },
                { in: "{[code]}", exp: "{[code]}" }
            ]

        }]

        tests.forEach(t => {
            let successCount = 0;
            for (let i = 0; i < t.insAndOuts.length; i++) {
                const r = t.insAndOuts[i];
                const result = t.func(r.in)
                const isSuccess = result === r.exp;
                if (isSuccess) {
                    successCount++;
                }
                else {
                    console.log(t.name, i, "isSuccess", isSuccess);
                    console.log(` ---> got='${result}' exp='${r.exp}'`);
                }
            }
            console.log("isSuccess", t.insAndOuts.length === successCount, `${t.name} tests=${t.insAndOuts.length} success=${successCount} `);
        })
    }
}