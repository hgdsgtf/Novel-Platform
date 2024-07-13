import { NovelMessage } from 'Plugins/NovelAPI/NovelMessage'

export class WriterGetChaptersMessage extends NovelMessage {
    title: string

    constructor(title: string) {
        super()
        this.title = title
    }
}
