import { API } from 'Plugins/CommonUtils/API'

export abstract class AuditorMessage extends API {
    override serviceName: string = 'Auditor'
}
