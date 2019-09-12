
import { removeNonPrint, splitByCommaSemicolon } from '../snippets';
export class TestSnippets {

    constructor() {
        // this.test_removeNonChar();
        this.test_splitOnComma();
    }

    test_removeNonChar() {


        const tests = [{
            name: "snippets.removeNonAsciiChars",
            func: removeNonPrint,
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

    test_splitOnComma() {
        const tests = [{
            name: "snippets.splitOnComma",
            func: splitByCommaSemicolon,
            insAndOuts: [
                { in: 'Lars;K;', exp: ['Lars', 'K'] },
                { in: 'Lars; K', exp: ['Lars', 'K'] },
                { in: ' Lars, K ', exp: ['Lars', 'K'] },
                { in: 'Lars, K', exp: ['Lars', 'K'] },
                { in: '"Lars, K"', exp: ['"Lars, K"'] },
                { in: '"Lars; K"', exp: ['"Lars; K"'] },

                { in: '"Lars, K"', exp: ['"Lars, K"'] },

                { in: '"Lars, K" <lars@k.net>, , ,   ', exp: ['"Lars, K" <lars@k.net>'] },
                { in: '"Lars; K" <lars@k.net> ; , ;', exp: ['"Lars; K" <lars@k.net>'] },
                {
                    in: `"Lars, K1" <lars@k.net>, "lars, K2" <lars@klingsten.net>, lars K3 <lars@klingsten.net>`,
                    exp: ['"Lars, K1" <lars@k.net>', '"lars, K2" <lars@klingsten.net>', 'lars K3 <lars@klingsten.net>']
                },
                {
                    in: `'Lars, K1' <lars@k.net>, "lars, K2" <lars@klingsten.net>, lars K3 <lars@klingsten.net>`,
                    exp: [`'Lars, K1' <lars@k.net>`, '"lars, K2" <lars@klingsten.net>', 'lars K3 <lars@klingsten.net>']
                },





            ]

        }]

        tests.forEach(t => {
            let successCount = 0;
            for (let i = 0; i < t.insAndOuts.length; i++) {
                const r = t.insAndOuts[i];
                const result = t.func(r.in)
                const isSuccess = JSON.stringify(result) == JSON.stringify(r.exp);
                console.log(t.name, i, "isSuccess", isSuccess);
                if (isSuccess) {
                    successCount++;
                }
                else {
                    console.log(' ---> got =', result, ' exp =', r.exp);
                }
            }
            console.log("isSuccess", t.insAndOuts.length === successCount, `${t.name} tests=${t.insAndOuts.length} success=${successCount} `);
        })
    }


}

