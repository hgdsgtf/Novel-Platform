import { AuditorMessage } from 'Plugins/AuditorAPI/AuditorMessage'

export class AuditorSendCodeMessage extends AuditorMessage {
    userEmail: string

    constructor(userEmail: string) {
        super()
        this.userEmail = userEmail
    }
}
