import { WriterMessage } from 'Plugins/WriterAPI/WriterMessage'


export class WriterDeleteWriterMessage extends WriterMessage {
    userName: String;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}
