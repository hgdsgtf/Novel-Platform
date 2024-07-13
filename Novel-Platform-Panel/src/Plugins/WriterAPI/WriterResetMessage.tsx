import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterResetMessage extends WriterMessage {
    userName: string
    password: string

    constructor(userName: string, password: string) {
        super()
        this.userName = userName
        this.password = password
    }
}
