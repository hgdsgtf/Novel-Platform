import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class ReaderReportIssueMessage extends NovelMessage {
    title: string
    chapter: number
    issue: string

    constructor(title: string, chapter: number, issue: string) {
        super()
        this.title = title
        this.chapter = chapter
        this.issue = issue
    }
}
