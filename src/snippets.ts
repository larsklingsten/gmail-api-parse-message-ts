import { IGmail } from './iface/igmail';

export function getEmptyEmail(): IGmail {
    const iGmail = {
        id: '',
        size: -1,
        threadId: '',
        historyId: '',
        subject: '',
        textPlain: '',
        textHtml: '',
        internalDate: -1,
        dateStr: '',
        from: '',
        to: [],
        cc: [],
        bcc: [],
        labels: [],          // parsed.labelIds of IGapiLabel[] 
        labelIds: [],        // rawID
        snippet: '',
        attachments: [],
        headers: new Map<string, string>()

    };
    return iGmail;
}

/** returns a fresh copy of IGmail */
export function copyGmail(gmail: IGmail): IGmail {
    const copy: IGmail = JSON.parse(JSON.stringify(gmail));
    copy.headers = new Map(gmail.headers);
    return copy;
}

function addToErrors(result: string[], key: string, valA: any, valB: any) {
    result.push(`${key}`);
    result.push(`--> got='${valA}' len=${valA.length ? valA.length : 'n/a'} `);
    result.push(`--> exp='${valB}' len=${valB.length ? valB.length : 'n/a'} `);
};

/** prints errors to console */
export function printResult(compareErrors: string[], funcName: string) {

    console.log("isSuccess", compareErrors.length === 0, funcName);
    if (compareErrors) {
        compareErrors.forEach(error => {
            console.log(' --> ', error);
        });
    }
}

/** compares two arrays by attributes, and return an array of errors, if any, with 3 rows per error
 * @param  arrayA  
 * @param  arrayB  
 * @param  string[]  attributes of ArrayA/ArrayB, such a ['id','name']
 * @returns string[] of errors, if any
*/
export function compareArray(arrayA: any[], arrayB: any[], objectAttributes: string[]): string[] {
    const errors: string[] = [];

    if (!Array.isArray(arrayA)) {
        addToErrors(errors, 'Not Array', arrayA, arrayB);
        return errors;
    }
    if (!Array.isArray(arrayB)) {
        addToErrors(errors, 'Not Array', arrayA, arrayB);
        return errors;
    }
    if ((arrayA.length !== arrayB.length)) {
        addToErrors(errors, 'Not Same Length', arrayA, arrayB);
        return errors;
    }

    // array loop
    for (let j = 0; j < arrayA.length; j++) {
        const a = arrayA[j];
        const b = arrayB[j];

        // objectAttributes loop
        for (let i = 0; i < objectAttributes.length; i++) {
            const key = objectAttributes[i];
            const valA = a[key]
            const valB = b[key]

            if (valA === undefined && valB === undefined) {
                continue;
            }
            if (valA === undefined || valB === undefined) {
                addToErrors(errors, key, valA, valB);
                continue;
            }

            if (valA.toString() !== valB.toString()) {
                addToErrors(errors, key, valA, valB);
            }
        };
    }
    return errors;
}

/** compares two objects attributes by toString() and 
 * return an array of errors, if any, with 3 rows per error 
 * @param  arrayA 
 * @param  arrayB 
 * @param  string[]  attributes of ArrayA/ArrayB, such as ['id','name']
 * @returns string[] of errors, if any
*/
export function compareObject(a: any, b: any, objectAttributes: string[]): string[] {
    const errors: string[] = [];
    for (let i = 0; i < objectAttributes.length; i++) {
        const key = objectAttributes[i];
        const valA = a[key]
        const valB = b[key]

        if (valA === undefined && valB === undefined) {
            continue;
        }
        if (valA === undefined || valB === undefined) {
            addToErrors(errors, key, valA, valB);
            continue;
        }
        if (valA.toString() !== valB.toString()) {
            addToErrors(errors, key, valA, valB);
        }
    };
    return errors;
}

/** remove non printing chars, space, intended for use for string comparison with multilines  */
export function removeNonPrint(s: string): string {
    return s.replace(/[^A-Za-zæøåÆØÅ0-9$§!"#€%&/\[\]\?{}()<>=@,.;':]/g, '');
};




/**
 * splits a string by delimiters (',' or ',') except when delimiters are two quotes '"'.
 * note: Does NOT handle delimiter within single quotes "'" */

export function splitByCommaSemicolon(s: string): string[] {
    s += ";";                                                       // we add a delimitor at end , to avoid fixing a possible last item
    const delimitor1 = ';';
    const delimitor2 = ',';

    const resultArr: string[] = [];
    let doubleQuoteCount = 0;
    let singleQuoteCount = 0;
    let startPos = 0;
    for (let i = 0; i < s.length; i++) {

        // find "," or ";", and add to result array, except if within quotes (we just check if quotes counts are uneven)
        if ((s[i] === delimitor1 || s[i] === delimitor2) && doubleQuoteCount % 2 === 0 && singleQuoteCount % 2 === 0) {
            const subStr = s.substr(startPos, i - startPos).trim();  // get string, and remove empty spaces
            startPos = i + 1;                                        // skip current delimiter char
            if (subStr.length > 0) {                                 // avoid empty items
                resultArr.push(subStr);
            }
        } else if (s[i] === `"`) {
            doubleQuoteCount++;
        } else if (s[i] === `'`) {
            singleQuoteCount++;
        }
    }
    return resultArr;
}
