import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterRegisterMessage extends WriterMessage {
    userName: string
    userEmail: string
    password: string
    verificationCode: string

    constructor(userName: string, userEmail: string, password: string, verificationCode: string) {
        super()
        this.userName = userName
        this.userEmail = userEmail
        this.password = password
        this.verificationCode = verificationCode
    }
}
