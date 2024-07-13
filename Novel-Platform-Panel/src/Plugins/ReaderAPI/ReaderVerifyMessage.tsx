import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderVerifyMessage extends ReaderMessage {
    userEmail: string
    verificationCode: string

    constructor(userEmail: string, verificationCode: string) {
        super()
        this.userEmail = userEmail
        this.verificationCode = verificationCode
    }
}
