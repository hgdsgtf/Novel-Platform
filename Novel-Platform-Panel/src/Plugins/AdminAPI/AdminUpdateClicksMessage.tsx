import {
    AdminMessage,
} from '../../../../../OneDrive/桌面/Novel-Platform (3)/Novel-Platform/Novel-Platform-Panel/src/Plugins/AdminAPI/AdminMessage'

export class AdminUpdateClicksMessage extends AdminMessage {
    readerName: string
    novelTitle: string
    currentTime: Date

    constructor(readerName: string, novelTitle: string, currentTime: Date) {
        super()
        this.readerName = readerName
        this.novelTitle = novelTitle
        this.currentTime = currentTime
    }
}