[![npm][npm]][npm-url]

# gmail-api-parse-message typescript
## forked from https://github.com/EmilTholin/gmail-api-parse-message v2.1
Parses Gmail API's GET message method, and returns a IGmail object

## To install:
```bash
npm install --save gmail-api-parse-message-ts --latest

or add to package.json  
"dependencies": {
     "gmail-api-parse-message-ts": "~2.2.5"
}
 
```
 

## Example usage

```ts
import { ParseGmailApi } from 'gmail-api-parse-message-ts';
import { iGmail } from 'gmail-api-parse-message-ts/dist/iface/iGmail';

export class ParseEmailService {
    /**  fetch single email from Gmail, and also updates emails array (see paramenter 'emails' below from component) */
    async getGmail(id: string): Promise<gapi.client.gmail.Message> {
      const email: gapi.client.gmail.Message = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: id,  // format: 'metadata'
        format: 'full'
      });
      return email;
    }
 
    /** Parses Email */
    async parseEmail() {      
          const parse = new ParseGmailApi();
          const gmailResponse = await getEmail('nm7ntsgm7tu1b6od')
          const iGmail = parse.parseMessage(gmailResponse);
          console.log(iGmail) // which return an object of type iGmail with the following properties
 }
```

which return the following objects

```ts

interface iGmail {
        id: string;
        threadId: string;
        labelIds: string[];
        snippet: string;
        historyId: string;
        internalDate: number;
        textHtml: string;
        textPlain: string;
        attachments: IAttachment[];
        inline?: IAttachment[];
        headers: Map<string, string>;
    }

interface IAttachment {
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
    headers?: any;
    /** data must be URLsafe base64 encoded */
    data?: string;
    dataEncoding?: string;
}

```

## API


```ts
/**
 * Takes a response from the Gmail API's GET message method and extracts all the relevant data.
 * @param  {object} gmail api response - The response from the Gmail API parsed to a JavaScript object.
 * @return {iGmail object}  
 */
 parseMessage(response);
```

## Licence
MIT

[npm]: https://img.shields.io/npm/v/gmail-api-parse-message-ts.svg
[npm-url]: https://npmjs.com/package/gmail-api-parse-message-ts
