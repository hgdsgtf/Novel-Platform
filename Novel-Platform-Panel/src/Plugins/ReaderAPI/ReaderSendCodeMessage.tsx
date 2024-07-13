import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderSendCodeMessage extends ReaderMessage {
    userEmail: string

    constructor(userEmail: string) {
        super()
        this.userEmail = userEmail
    }
}
