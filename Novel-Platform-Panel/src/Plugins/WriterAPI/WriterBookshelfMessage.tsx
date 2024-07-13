import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterBookshelfMessage extends WriterMessage {
    userName: string

    constructor(userName: string) {
        super()
        this.userName = userName
    }
}
