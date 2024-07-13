import { API } from 'Plugins/CommonUtils/API'

export abstract class WriterMessage extends API {
    override serviceName: string = 'Writer'
}
