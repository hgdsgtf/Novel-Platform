import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderSetOldChapterMessage extends ReaderMessage {
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
