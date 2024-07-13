import { ReaderMessage } from 'Plugins/ReaderAPI/ReaderMessage'

export class ReaderRegisterMessage extends ReaderMessage {
    userName: string
    userEmail: string
    password: string
    verificationCode: string

    constructor(userName: string, userEmail: string, password: string, verificationCode: string) {
        super()
        this.userName = userName
        this.userEmail = userEmail
        this.password = password
        this.verificationCode = verificationCode
    }
}
