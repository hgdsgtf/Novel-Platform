import { BasicUserMessage } from './UserMessage'

export class UserRegisterMessage extends BasicUserMessage {
    userName: string
    userEmail: string
    password: string
    verificationCode: string
    userType: number

    constructor(userName: string, userEmail: string, password: string, verificationCode: string, userType: number) {
        super()
        this.userName = userName
        this.userEmail = userEmail
        this.password = password
        this.verificationCode = verificationCode
        this.userType = userType
    }
}
