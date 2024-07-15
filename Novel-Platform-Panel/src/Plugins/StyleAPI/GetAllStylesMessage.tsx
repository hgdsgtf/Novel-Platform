import { StyleMessage } from 'Plugins/StyleAPI/StyleMessage'

export class GetAllStylesMessage extends StyleMessage {
    pageName: string

    constructor(pageName: string) {
        super()
        this.pageName = pageName
    }
}
