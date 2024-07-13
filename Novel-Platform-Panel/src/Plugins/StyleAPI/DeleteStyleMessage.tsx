import { StyleMessage } from 'Plugins/StyleAPI/StyleMessage'

export class DeleteStyleMessage extends StyleMessage {

    id: number


    constructor(id: number) {
        super()
        this.id = id

    }
}