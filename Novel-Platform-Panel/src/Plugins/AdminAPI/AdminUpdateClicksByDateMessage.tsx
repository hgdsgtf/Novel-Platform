import {
    AdminMessage,
} from '../../../../../OneDrive/桌面/Novel-Platform (3)/Novel-Platform/Novel-Platform-Panel/src/Plugins/AdminAPI/AdminMessage'

export class AdminUpdateClicksByDateMessage extends AdminMessage {
    novelTitle: string
    currentTime: Date

    constructor(novelTitle: string, currentTime: Date) {
        super()
        this.novelTitle = novelTitle
        this.currentTime = currentTime
    }
}