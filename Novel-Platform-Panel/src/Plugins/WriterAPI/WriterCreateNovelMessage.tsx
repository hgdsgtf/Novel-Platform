import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'

export class WriterCreateNovelMessage extends WriterMessage {
    userName: string
    title: string

    constructor(userName: string, title: string) {
        super()
        this.userName = userName
        this.title = title
    }
}
