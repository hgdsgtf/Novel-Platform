import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class AdminLoginMessage extends AdminMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}