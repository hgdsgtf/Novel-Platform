import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderAddNovelMessage extends ReaderMessage {
    userName: string
    title: string

    constructor(userName: string, title: string) {
        super()
        this.userName = userName
        this.title = title
    }
}
