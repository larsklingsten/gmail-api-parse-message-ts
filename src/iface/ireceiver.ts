export interface IReceiver {

    /** Name of receiver */
    name: string;

    /** Email address */
    email: string;

    /** set is as true as default by ParseGmailApi.parseMessage(). Validation appears to be 
     * redundant, as emails from the gmail api, should be  correct */ 
    isValid : boolean;

}