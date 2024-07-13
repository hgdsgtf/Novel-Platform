import { BasicUserMessage } from './UserMessage'

export class GetUserNameMessage extends BasicUserMessage {
    userEmail: string

    constructor(userEmail: string) {
        super()
        this.userEmail = userEmail
    }
}
