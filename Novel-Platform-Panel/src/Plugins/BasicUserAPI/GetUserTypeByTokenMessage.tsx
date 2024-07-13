import { BasicUserMessage } from './UserMessage'

export class GetUserTypeByTokenMessage extends BasicUserMessage {
    userToken: string

    constructor(userToken: string) {
        super()
        this.userToken = userToken
    }
}
