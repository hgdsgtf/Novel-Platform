import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderAddMoneyMessage extends ReaderMessage {
    userName: string
    addamount: number

    constructor(userName: string, addamount: number) {
        super()
        this.userName = userName
        this.addamount = addamount
    }
}
