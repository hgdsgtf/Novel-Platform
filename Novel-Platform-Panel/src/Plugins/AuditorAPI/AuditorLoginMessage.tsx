import { AuditorMessage } from 'Plugins/AuditorAPI/AuditorMessage'

export class AuditorLoginMessage extends AuditorMessage {
    userName: string
    password: string

    constructor(userName: string, password: string) {
        super()
        this.userName = userName
        this.password = password
    }
}
