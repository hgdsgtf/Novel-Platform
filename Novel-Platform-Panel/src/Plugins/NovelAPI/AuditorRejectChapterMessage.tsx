import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class AuditorRejectChapterMessage extends NovelMessage {
    title: string
    chapter: number
    comment: string

    constructor(title: string, chapter: number, comment: string) {
        super()
        this.title = title
        this.chapter = chapter
        this.comment = comment
    }
}
