import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class WriterUpdateNovelContentMessage extends NovelMessage {
    title: string
    chapter: number
    newContent: string
    reason: string

    constructor(title: string, chapter: number, newContent: string, reason: string) {
        super()
        this.title = title
        this.chapter = chapter
        this.newContent = newContent
        this.reason = reason
    }
}
