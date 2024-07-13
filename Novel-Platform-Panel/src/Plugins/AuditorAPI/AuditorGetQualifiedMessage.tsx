import { AuditorMessage } from 'Plugins/AuditorAPI/AuditorMessage'

export class AuditorGetQualifiedMessage extends AuditorMessage {
    userName: string

    constructor(userName: string) {
        super()
        this.userName = userName
    }
}
