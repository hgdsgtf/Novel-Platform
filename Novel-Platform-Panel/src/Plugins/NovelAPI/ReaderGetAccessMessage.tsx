import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class ReaderGetAccessMessage extends NovelMessage {
    userName: string
    title: string
    chapter: number

    constructor(userName: string, title: string, chapter: number) {
        super()
        this.userName = userName
        this.title = title
        this.chapter = chapter
    }
}
