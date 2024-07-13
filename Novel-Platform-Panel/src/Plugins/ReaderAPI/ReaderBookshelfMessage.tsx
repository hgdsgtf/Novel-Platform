import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderBookshelfMessage extends ReaderMessage {
    userName: string

    constructor(userName: string) {
        super()
        this.userName = userName
    }
}
