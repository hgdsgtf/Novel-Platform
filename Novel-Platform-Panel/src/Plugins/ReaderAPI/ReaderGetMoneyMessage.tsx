import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderGetMoneyMessage extends ReaderMessage {
    userName: string

    constructor(userName: string) {
        super()
        this.userName = userName
    }
}
