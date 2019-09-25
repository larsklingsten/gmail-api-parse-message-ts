[![npm][npm]][npm-url]

# gmail-api-parse-message typescript
- Parses Gmail API [message.get] and returns a IEmail object

## To install:
```bash
npm install --save gmail-api-parse-message-ts --latest
```

## Example usage

```ts
import { ParseGmailApi, IEmail } from 'gmail-api-parse-message-ts';

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
          const gmailResponse = await getEmailFromApi('[id of your gmail message]');
          const email : IEmail = parse.parseMessage(gmailResponse);  // returns IEmail object
          console.log(email);  // see IEmail below
    }
  
```

## API

```ts
/**  parses a gmail-api message.resource object, and returns an IEmail Object
* @param   messages.resource
* @returns IEmail
* 
* messages.resource: https://developers.google.com/gmail/api/v1/reference/users/messages#resource  */
parseMessage(response): IEmail

 /** get a empty IEmail object with default values
  *  @returns IEmail object  */
getEmptyEmail(): IEmail
 
/** converts are string container emails, and returns them as IReceivers[]
 *  Emails are by default checked for validity, however optional parameter
 *  checkIfEmailIsValid can be set to false, whereby emails are not checked,
 *  and isValid is set to true.  ParseGmailApi.parseMessage() always set isValid=true
 *  without checking 
 * 
 * @param   string
 * @returns IReceiver[] 
 * 
 * example usage:
 * parseReceivers("lars@kltn.net, 'lars' lk@kl.net");
 * returns -> [ {name:"", email: "lars@kltn.net", isValid:true}, { name:"lars", email:"lk@kl.net", isValid:true } ]   */
public parseReceivers(receiverStr: string = "", checkIfEmailIsValid: boolean = true): IReceiver[] 

/** check whether an email address is valid, exposes func from klingsten snippets 
* see https://bitbucket.org/LarsKlingsten/klingsten-snippets-ts/src/master/src/strings.ts  */
public isEmailValid(s: string): boolean  

```

## Interfaces
```ts
interface IEmail {

    /** The immutable ID of the message. */
    id: string;

    /** The ID of the thread the message belongs to. To add a message or draft to a thread, the following criteria must be met:
    The requested threadId must be specified on the Message or Draft.Message you supply with your request.
    The References and In-Reply-To headers must be set in compliance with the RFC 2822 standard.
    The Subject headers must match. */
    threadId: string;

    /** A short part of the message text. */
    snippet: string;

    /** The ID of the last history record that modified this message. */
    historyId: string;

    /** The internal message creation timestamp (epoch ms), which determines ordering in the inbox. For normal SMTP-received email, this represents the time the message was originally accepted by Google, which is more reliable than the Date header. However, for API-migrated mail, it can be configured by client to be based on the Date header. */
    internalDate: number;

    /**  timestamp as taken from the message header ('date'), if not available, we take the internalDate  */
    sentDate: number;

    from: IReceiver;         // { name:'Amzn Svc', email:'web@amz.com' }  
    to: IReceiver[];         // [ { name:'Lars K', email:'lk@ema.dk' } ]
    cc: IReceiver[];         //  --||--
    bcc: IReceiver[];        //  --||--
    subject: string;         //  "subject": "The AWS Summit Stockholm is back! Register and join us on May 22, 2019",

    textHtml: string,
    textPlain: string,

    /** attachments references, the actual attachment must be downloaded seperately */
    attachments: IAttachment[],
    /** attachments. We add 'inline?' to, and remove the inline version (I think) */
    inline?: IAttachment[],

    /** estimates size of message, as calc'd by Gmail APi */
    size: number;

    /** List of IDs of labels applied to this message. */
    labelIds: string[],

    /** proceed lables, bases on LabelIds above */
    labels?: IGapiLabel[],  // parsed.labelIds of IGapiLabel[] // you need your own implementation
    headers: Map<string, string>,

    /** is the message unread, set by checking whether or not labelID = "DRAFT" exists  */
    isUnread: boolean;
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

interface IReceiver {
   name: string;
   email: string;
   /**  set is as true as default by ParseGmailApi.parseMessage(). Validation appears to be 
    * redundant, as emails from the gmail api, should be  correct */
   isValid: boolean; 

}

/** Just A Copy of Gmail API Label  -> gapi.client.gmail.Label */
interface IGapiLabel {
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

## Forked
- forked from https://github.com/EmilTholin/gmail-api-parse-message v2.1

## Licence
MIT

[npm]: https://img.shields.io/npm/v/gmail-api-parse-message-ts.svg
[npm-url]: https://npmjs.com/package/gmail-api-parse-message-ts
