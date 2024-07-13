// Plugins/CommentAPI/DeleteCommentMessage.ts
import { CommentMessage } from './CommentMessage';

export class DeleteCommentMessage extends CommentMessage {
    userName: string;
    novelId: number;

    constructor(userName: string, novelId: number) {
        super();
        this.userName = userName;
        this.novelId = novelId;
    }
}
