import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderLoginMessage extends ReaderMessage {
    userName: string
    password: string

    constructor(userName: string, password: string) {
        super()
        this.userName = userName
        this.password = password
    }
}
