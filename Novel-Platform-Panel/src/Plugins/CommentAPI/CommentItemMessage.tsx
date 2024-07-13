export interface Comment{
    id: number;
    createdAt: string;
    parentCommentId: number | null;
    parentUserName: string | null;
    isAuthorComment: boolean;
    userType: string;
    liker: [string, string][];
    replies: Comment[];
    user: string;
    content: string;
    likes: number;
}
export interface CommentItemProps {
    comment: Comment;
    handleLike: (id: number) => void;
    handleReply: (id: number, user: string, content: string) => void;
    handleDelete: (id: number) => void;
    renderComments: (comments: Comment[], parentId?: number) => JSX.Element[];
    currentUserName: string;
    currentUserType: string;
    canDelete: boolean;
}
