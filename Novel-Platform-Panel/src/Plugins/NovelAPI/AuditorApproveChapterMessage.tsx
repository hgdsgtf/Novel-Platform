import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class AuditorApproveChapterMessage extends NovelMessage {
    title: string
    chapter: number

    constructor(title: string, chapter: number) {
        super()
        this.title = title
        this.chapter = chapter
    }
}
