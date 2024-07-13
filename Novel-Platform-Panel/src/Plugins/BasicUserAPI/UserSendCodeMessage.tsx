import { BasicUserMessage } from './UserMessage'

export class UserSendCodeMessage extends BasicUserMessage {
    userEmail: string

    constructor(userEmail: string) {
        super()
        this.userEmail = userEmail
    }
}
