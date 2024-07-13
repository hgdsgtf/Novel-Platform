import { CommentMessage } from './CommentMessage';

export class AddCommentMessage extends CommentMessage {
    novelTitle: string;
    user: string;
    content: string;
    userType: string;
    isAuthorComment: boolean;
    parentCommentId?: number;
    parentUserName?: string;

    constructor(
        novelTitle: string,
        user: string,
        content: string,
        userType: string,
        isAuthorComment: boolean,
        parentCommentId?: number,
        parentUserName?: string
    ) {
        super();
        this.novelTitle = novelTitle;
        this.user = user;
        this.content = content;
        this.userType = userType;
        this.isAuthorComment = isAuthorComment;
        this.parentCommentId = parentCommentId;
        this.parentUserName = parentUserName;
    }


}
