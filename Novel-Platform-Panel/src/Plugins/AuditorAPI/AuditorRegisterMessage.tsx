import { AuditorMessage } from 'Plugins/AuditorAPI/AuditorMessage'

export class AuditorRegisterMessage extends AuditorMessage {
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
