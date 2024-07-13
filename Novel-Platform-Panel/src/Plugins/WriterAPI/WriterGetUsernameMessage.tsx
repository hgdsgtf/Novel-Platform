import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterGetUsernameMessage extends WriterMessage {
    email: string

    constructor(email: string) {
        super()
        this.email = email
    }
}
