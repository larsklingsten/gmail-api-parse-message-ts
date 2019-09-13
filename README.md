[![npm][npm]][npm-url]

# gmail-api-parse-message typescript
- Parses Gmail API [message.get] and returns a IGmail object

## To install:
```bash
npm install --save gmail-api-parse-message-ts --latest
```

## Example usage

```ts
import { ParseGmailApi } from 'gmail-api-parse-message-ts';
import { IGmail } from 'gmail-api-parse-message-ts/dist/iface/iGmail';

export class ParseEmailService {
    /**  fetch single email from Gmail API  */
    async getGmailFromApi(id: string): Promise<gapi.client.gmail.Message> {
      const email: gapi.client.gmail.Message = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: id,  
        format: 'full'
      });
      return email;
    }
 
    /** Parses Email */
    async parseEmail() {      
          const parse = new ParseGmailApi();
          const gmailResponse = await getEmail('[id of your gmail message]');
          const email : IEmail = parse.parseMessage(gmailResponse);  // returns IEmail object
          console.log(email);  // see iGmail below
    }
 }
```

running parseEmail() which returns an iGmail object

```ts
interface IEmail {           // gapi = 'Gmail API'
    
    id:       string;        // gapi id  threadId: string;        // gapi thread
    snippet:  string;        // gapi snippet
    historyId:string;
    internalDate: number;
    dateStr: string;
    from: IReceiver;         //  { name:'Amzn Web Service', email:'web@amz.com' }  
    to:   IReceiver[];       //  [ { name:'Lars K', email:'lk@email' } ]
    cc:   IReceiver[];       //  etc  
    bcc:  IReceiver[];       //  etc 
    subject: string;         //  "subject": "The AWS Summit Stockholm is back! Register and join us on May 22, 2019",

    textHtml:  string,
    textPlain: string,
    attachments: IAttachment[],
    inline?:     IAttachment[],
    size:        number;

    labelIds: string[],
    labels?:  IGapiLabel[],  // parsed.labelIds of IGapiLabel[]
    headers:  Map<string, string>,

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

interface IReceiver {
   name: string;
   email: string;
}

/** Just A Copy of Gmail API Label  -> gapi.client.gmail.Label */
export interface IGapiLabel {
    id?: string;
    labelListVisibility?: string;
    messageListVisibility?: string;
    messagesTotal?: number;
    messagesUnread?: number;
    name?: string;
    threadsTotal?: number;
    threadsUnread?: number;
    type?: string;
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

## Forked
- forked from https://github.com/EmilTholin/gmail-api-parse-message v2.1


## Licence
MIT

[npm]: https://img.shields.io/npm/v/gmail-api-parse-message-ts.svg
[npm-url]: https://npmjs.com/package/gmail-api-parse-message-ts
