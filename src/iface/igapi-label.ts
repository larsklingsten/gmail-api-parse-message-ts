
/** Just A Copy of Gmail API Label  -> gapi.client.gmail.Label */
export interface IGapiLabel {
    /** The immutable ID of the label. */
    id?: string;
    /** The visibility of the label in the label list in the Gmail web interface. */
    labelListVisibility?: string;
    /** The visibility of the label in the message list in the Gmail web interface. */
    messageListVisibility?: string;
    /** The total number of messages with the label. */
    messagesTotal?: number;
    /** The number of unread messages with the label. */
    messagesUnread?: number;
    /** The display name of the label. */
    name?: string;
    /** The total number of threads with the label. */
    threadsTotal?: number;
    /** The number of unread threads with the label. */
    threadsUnread?: number;
    /**
     * The owner type for the label. User labels are created by the user and can be modified and deleted by the user and can be applied to any message or
     * thread. System labels are internally created and cannot be added, modified, or deleted. System labels may be able to be applied to or removed from
     * messages and threads under some circumstances but this is not guaranteed. For example, users can apply and remove the INBOX and UNREAD labels from
     * messages and threads, but cannot apply or remove the DRAFTS or SENT labels from messages or threads.
     */
    type?: string;
}