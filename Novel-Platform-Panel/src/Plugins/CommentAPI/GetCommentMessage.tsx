import { CommentMessage } from './CommentMessage';

export class GetCommentMessage extends CommentMessage {
    novelTitle: string;
    commentId?: number;

    constructor(novelTitle: string, commentId?: number) {
        super();
        this.novelTitle = novelTitle;
        this.commentId = commentId;
    }

}
