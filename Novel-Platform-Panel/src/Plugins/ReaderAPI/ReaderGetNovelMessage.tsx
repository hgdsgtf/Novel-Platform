import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderGetNovelMessage extends ReaderMessage {
    title: string

    constructor(title: string) {
        super()
        this.title = title
    }
}
