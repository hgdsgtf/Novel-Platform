import { CommentMessage } from './CommentMessage';

export class LikeCommentMessage extends CommentMessage {
    novelTitle: string;
    userName: string;
    userType: string;
    commentId: number;

    constructor(novelTitle: string, userName: string, userType: string, commentId: number) {
        super();
        this.novelTitle = novelTitle;
        this.userName = userName;
        this.userType = userType;
        this.commentId = commentId;
    }
}
