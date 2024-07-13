import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterSendCodeMessage extends WriterMessage {
    userEmail: string

    constructor(userEmail: string) {
        super()
        this.userEmail = userEmail
    }
}
