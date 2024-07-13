import { BasicUserMessage } from './UserMessage'

export class UserVerifyMessage extends BasicUserMessage {
    userEmail: string
    verificationCode: string

    constructor(userEmail: string, verificationCode: string) {
        super()
        this.userEmail = userEmail
        this.verificationCode = verificationCode
    }
}
