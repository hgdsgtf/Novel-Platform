import { StyleMessage } from 'Plugins/StyleAPI/StyleMessage'

export class DeletePageStyleMessage extends StyleMessage {
    pageName: string
    id: number
    constructor(pageName: string,id: number) {
        super()
        this.id = id
        this.pageName = pageName
    }
}
