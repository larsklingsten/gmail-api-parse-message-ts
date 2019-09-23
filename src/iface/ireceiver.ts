export interface IReceiver {

    /** Name of receiver */
    name: string;

    /** Email address */
    email: string;

    /** Optional. Possible to marked users non-valid emails, as not valid, for later evaluation   */
    isValid?: boolean;

}