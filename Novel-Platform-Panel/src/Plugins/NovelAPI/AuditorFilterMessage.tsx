import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class AuditorFilterMessage extends NovelMessage {
    title: string
    chapter: number
    keyword: string

    constructor(title: string, chapter: number, keyword: string) {
        super()
        this.title = title
        this.chapter = chapter
        this.keyword = keyword
    }
}
