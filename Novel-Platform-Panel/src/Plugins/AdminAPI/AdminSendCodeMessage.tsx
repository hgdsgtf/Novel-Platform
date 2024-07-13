import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class AdminSendCodeMessage extends AdminMessage {
    userEmail: string;

    constructor(userEmail: string) {
        super();
        this.userEmail = userEmail;
    }
}