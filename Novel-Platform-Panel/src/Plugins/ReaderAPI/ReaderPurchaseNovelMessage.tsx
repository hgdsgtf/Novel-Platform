import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderPurchaseNovelMessage extends ReaderMessage {
    userName: string
    title: string
    chapter: number
    cost: number

    constructor(userName: string, title: string, chapter: number, cost: number) {
        super()
        this.userName = userName
        this.title = title
        this.chapter = chapter
        this.cost = cost
    }
}
