import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class SearchNovelMessage extends NovelMessage {
    title: string

    constructor(title: string) {
        super()
        this.title = title
    }
}
