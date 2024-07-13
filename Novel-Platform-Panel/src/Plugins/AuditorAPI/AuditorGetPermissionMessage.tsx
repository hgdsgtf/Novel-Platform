import { AuditorMessage } from 'Plugins/AuditorAPI/AuditorMessage'

export class AuditorGetPermissionMessage extends AuditorMessage {
    userName: string

    constructor(userName: string) {
        super()
        this.userName = userName
    }
}
