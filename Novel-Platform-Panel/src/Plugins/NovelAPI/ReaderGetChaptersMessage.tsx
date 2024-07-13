import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class ReaderGetChaptersMessage extends NovelMessage {
    title: string
    userName: string

    constructor(title: string, userName: string) {
        super()
        this.title = title
        this.userName = userName
    }
}
