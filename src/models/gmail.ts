import { Snippets as Sn } from '../snippets';
import { IGmail } from '../iface/igmail';


export class Gmail {
    constructor(private obj: IGmail) { }

    compare(b: Gmail) {
        if (this.obj.id !== b.obj.id) {
            console.log("Failed: ID", "got", this.obj.id, "exp", b.obj.id);
            return false;
        }
        if (JSON.stringify(this.obj.labelIds) !== JSON.stringify(b.obj.labelIds)) {
            console.log("Failed: IDS", "got", this.obj.labelIds, "exp", b.obj.labelIds);
            return false;
        }

        if (this.obj.headers.get('to') !== b.obj.headers.get('to')) {
            console.log("Failed: 'to'", "got", this.obj.headers.get('to'), "exp", b.obj.headers.get('to'));
            return false;
        }
        if (this.obj.headers.get('cc') !== b.obj.headers.get('cc')) {
            console.log("Failed: 'cc'", "got", this.obj.headers.get('cc'), "exp", b.obj.headers.get('cc'));
            return false;
        }
        if (this.obj.headers.get('from') !== b.obj.headers.get('from')) {
            console.log("Failed: 'from'", "got", this.obj.headers.get('from'), "exp", b.obj.headers.get('from'));
            return false;
        }

        if (this.obj.headers.get('subject') !== b.obj.headers.get('subject')) {
            console.log("subject failed:"); return false;
        }

        if (Sn.removeNonPrint(this.obj.textPlain) !== Sn.removeNonPrint(b.obj.textPlain)) {

            console.log("iGmail.textPlain");
            console.log("---this---");
            console.log(Sn.removeNonPrint(this.obj.textPlain));
            console.log("---b---");
            console.log(Sn.removeNonPrint(b.obj.textPlain));
            console.log("----done---");

            return false;
        }

        // compare length
        if (this.obj.attachments.length !== b.obj.attachments.length) {
            console.log("Failed: attachment length", "got", this.obj.attachments.length, "exp", b.obj.attachments.length);
            return false;
        }

        if (this.obj.attachments.length > 0 && b.obj.attachments.length > 0) {


            for (let i = 0; i < this.obj.attachments.length; i++) {

                if (this.obj.attachments[i].attachmentId !== b.obj.attachments[i].attachmentId) {
                    console.log("Failed: attachments.id", 'index', i, "got", this.obj.attachments[i].attachmentId, "exp", b.obj.attachments[i].attachmentId);
                    return false;
                }
                if (this.obj.attachments[i].filename !== b.obj.attachments[i].filename) {
                    console.log("Failed: attachments.filename", 'index', i, "got", this.obj.attachments[i].filename, "exp", b.obj.attachments[i].filename);
                    return false;
                }

                if (this.obj.attachments[i].size !== b.obj.attachments[i].size) {
                    console.log("Failed: attachments.size", 'index', i, "got", this.obj.attachments[i].size, "exp", b.obj.attachments[i].size);
                    return false;
                }


            }


        }



        return true;

    }
    string(): string {
        return this.obj.id + ' to:' + this.obj.headers.get('to') + " labels:" + this.obj.labelIds.length + " headers:" + this.obj.headers.size;
    }
}