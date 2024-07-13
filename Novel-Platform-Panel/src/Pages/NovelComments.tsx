import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AddCommentMessage } from 'Plugins/CommentAPI/AddCommentMessage';
import { GetCommentMessage } from 'Plugins/CommentAPI/GetCommentMessage';
import { LikeCommentMessage } from 'Plugins/CommentAPI/LikeComment';
import { DeleteCommentMessage } from 'Plugins/CommentAPI/DeleteComment';
import { Comment} from 'Plugins/CommentAPI/CommentItemMessage';
import CommentItem from './CommentItem';
import dayjs from 'dayjs';
import { useHistory, useLocation } from 'react-router-dom'



const NovelComments= () => {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [feedback, setFeedback] = useState('');
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const userType  = query.get('userType')
    const novelTitle = query.get('title')
    const chapter= query.get('chapter')
    const status= query.get('status')
    const isWriterReadNovelPage = query.get('isWriterReadNovelPage') === 'true';

    useEffect(() => {
        fetchComments();
    }, [novelTitle]);


    const fetchComments = async () => {
        try {
            const message = new GetCommentMessage(novelTitle);
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = JSON.parse(response.data);

            const mappedData = data.map((comment: any) => ({
                ...comment,
                id: comment.id,
                createdAt: dayjs(comment.created_at).format('YYYY-MM-DD HH:mm:ss'),
                parentCommentId: comment.parentcommentid,
                parentUserName: comment.parentusername,
                isAuthorComment: comment.isauthorcomment === 'true',
                userType: comment.usertype,
                replies: [],
                user: comment.user,
                content: comment.content,
                liker: comment.liker || [],
                likes: comment.likes,
            }));
            console.log("Mapped Data: ", mappedData); // 检查 mappedData 是否包含正确的属性

            const commentDict: { [key: number]: Comment } = mappedData.reduce((dict: { [key: number]: Comment }, comment: Comment) => {
                dict[comment.id] = comment;
                return dict;
            }, {});

            const topLevelComments: Comment[] = [];
            mappedData.forEach((comment: Comment) => {
                if (comment.parentCommentId) {
                    if (commentDict[comment.parentCommentId]) {
                        commentDict[comment.parentCommentId].replies.push(comment);
                    }
                } else {
                    topLevelComments.push(comment);
                }
            });
            topLevelComments.sort((a: Comment, b: Comment) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

            setComments(topLevelComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        }
    };


    const handleLike = async (commentId: number) => {
        try {
            // 找到要点赞的评论
            const comment = comments.find(comment => comment.id === commentId);

            if (!comment) {
                console.error('Comment not found:', commentId);
                return;
            }

            // 检查当前用户是否已经在 liker 列表中
            const userAlreadyLiked = comment.liker.some(
                (liker: any) => liker[0] === username && liker[1] === userType
            );

            if (userAlreadyLiked) {
                console.log('User has already liked this comment');
                return; // 用户已经点赞过，直接返回
            }

            const message = new LikeCommentMessage(novelTitle, username, userType, commentId);

            console.log('Sending like request:', JSON.stringify(message));

            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Like response:', response);

            const responseData = response.data;

            if (responseData.includes("评论点赞成功")) {
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === commentId
                            ? {
                                ...comment,
                                likes: comment.likes + 1,
                                liker: [...comment.liker, [username, userType]],
                            }
                            : comment
                    )
                );
            } else {
                console.error('Error liking comment:', responseData);
            }
            fetchComments()
        } catch (error) {
            console.error('Error liking comment:', error.message);
        }
    };


    const handleDelete = async (commentId: number) => {
        try {

            const message = new DeleteCommentMessage(username, commentId);
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = response.data;

            if (responseData.includes("评论删除成功")) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            } else {
                console.error('Error deleting comment:', responseData);
            }
            fetchComments()
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    };

    const handleReply = async (parentCommentId: number, parentUserName: string, replyContent: string) => {
        const isAuthorComment = userType === 'writer';
        const newReply = new AddCommentMessage(novelTitle, username, `@${parentUserName} ${replyContent}`, userType, isAuthorComment, parentCommentId, parentUserName);

        try {
            const response = await axios.post(newReply.getURL(), JSON.stringify(newReply), {
                headers: { 'Content-Type': 'application/json' },
            });
            const data = JSON.parse(response.data);
            if (data.success) {
                fetchComments(); // 更新评论列表
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleNewComment = async () => {
        if (!newComment) return;

        const isAuthorComment = userType === 'writer';
        const newCommentData = new AddCommentMessage(novelTitle, username, newComment, userType, isAuthorComment);

        try {
            const response = await axios.post(newCommentData.getURL(), JSON.stringify(newCommentData), {
                headers: { 'Content-Type': 'application/json' },
            });
            const data = JSON.parse(response.data);


            if (data.success) {
                fetchComments();
                setNewComment('');
                setFeedback('评论添加成功');
            } else {
                setFeedback('评论添加失败: ' + data.error);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setFeedback('评论添加失败: ' + error.message);
        }
    };
    const renderComments = (comments: Comment[], renderedComments: Set<number>, canDelete: boolean, parentId?: number) => {
        return comments
            .filter(comment => !renderedComments.has(comment.id) && (parentId ? comment.parentCommentId === parentId : !comment.parentCommentId))
            .map((comment) => {
                renderedComments.add(comment.id);
                return (
                    <div key={comment.id} className={parentId ? 'comment-reply' : 'comment-root'}>
                        <CommentItem
                            comment={comment}
                            handleLike={handleLike}
                            handleReply={handleReply}
                            handleDelete={handleDelete}
                            renderComments={(comments, parentId) => renderComments(comments, renderedComments, canDelete, parentId)}
                            currentUserName={username}
                            currentUserType={userType}
                            canDelete={canDelete}
                        />
                        {comment.replies.length > 0 && (
                            <div className="comment-replies">
                                {renderComments(comment.replies, renderedComments, canDelete, comment.id)}
                            </div>
                        )}
                    </div>
                );
            });
    };



    const handleBack = async () => {
        if (userType === 'reader') {
            history.push(`/readerreadnovel?userName=${username}&title=${novelTitle}&chapter=${chapter}`)
        } else {
            history.push(`/writerreadnovel?userName=${username}&bookName=${novelTitle}&chapter=${chapter}&status=${status}`)
        }
    }

    return (
        <div>
            <h3>评论区</h3>
            {feedback && <p style={{ color: 'green' }}>{feedback}</p>}
            {comments.length === 0 ? (
                <p>暂无评论</p>
            ) : (
                renderComments(comments, new Set(), isWriterReadNovelPage)
            )}
            <div style={{ marginTop: '20px' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="添加新评论"
                    rows={3}
                    style={{ width: '100%' }}
                ></textarea>
                <button onClick={handleNewComment} className="submit-button">提交评论</button>
                <button
                    onClick={handleBack}
                    className="submit-button"
                    style={{ marginTop: '20px' }}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NovelComments;
