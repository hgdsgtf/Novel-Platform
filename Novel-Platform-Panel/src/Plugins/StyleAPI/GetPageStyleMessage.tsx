import { StyleMessage } from 'Plugins/StyleAPI/StyleMessage'

export class GetPageStyleMessage extends StyleMessage {
    pageName: string
    styleId: number
    constructor(pageName: string, styleId: number) {
        super()
        this.pageName = pageName
        this.styleId = styleId
    }
}
