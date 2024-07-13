import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderGetUsernameMessage extends ReaderMessage {
    email: string

    constructor(email: string) {
        super()
        this.email = email
    }
}
