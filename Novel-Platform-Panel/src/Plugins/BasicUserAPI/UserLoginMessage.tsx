import { BasicUserMessage } from './UserMessage'

export class UserLoginMessage extends BasicUserMessage {
    userName: string
    password: string

    constructor(userName: string, password: string) {
        super()
        this.userName = userName
        this.password = password
    }
}
