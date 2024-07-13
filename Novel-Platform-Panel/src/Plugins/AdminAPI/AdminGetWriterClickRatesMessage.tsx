import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class AdminGetWriterClickRatesMessage extends AdminMessage{
    authorName: string;
    constructor(authorname: string) {
        super();
        this.authorName = authorname;
    }
}