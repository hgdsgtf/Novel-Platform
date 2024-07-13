import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class WriterAddChapterMessage extends NovelMessage {
    title: string
    author: string
    chapter: number
    chapterName: string
    content: string

    constructor(title: string, author: string, chapter: number, chapterName: string, content: string) {
        super()
        this.title = title
        this.author = author
        this.chapter = chapter
        this.chapterName = chapterName
        this.content = content
    }
}
