import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class AdminResetMessage extends AdminMessage {
    userName: string;
    userEmail: string;
    password: string;
    verificationCode:string;

    constructor(userName: string, userEmail: string, password: string,verificationCode:string) {
        super();
        this.userName = userName;
        this.userEmail = userEmail;
        this.password = password;
        this.verificationCode=verificationCode;
    }
}
