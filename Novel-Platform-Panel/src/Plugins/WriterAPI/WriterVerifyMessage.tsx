import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterVerifyMessage extends WriterMessage {
    userEmail: string
    verificationCode: string

    constructor(userEmail: string, verificationCode: string) {
        super()
        this.userEmail = userEmail
        this.verificationCode = verificationCode
    }
}
