import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import styles from '../styles/CommentPage.module.css'
import { CommentItemProps } from 'Plugins/CommentAPI/CommentItemMessage'
import backgroundImage from '../styles/like_icon.png'

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     handleLike,
                                                     handleReply,
                                                     handleDelete,
                                                     renderComments,
                                                     currentUserName,
                                                     currentUserType,
                                                     canDelete,
                                                 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const userAlreadyLiked = comment.liker.some(
            liker => liker[0] === currentUserName && liker[1] === currentUserType,
        )
        setLiked(userAlreadyLiked)
    }, [comment.liker, currentUserName, currentUserType])

    const handleReplyClick = () => {
        setShowReplyForm(!showReplyForm)
    }

    const handleSubmitReply = () => {
        handleReply(comment.id, comment.user, replyContent)
        setReplyContent('')
        setShowReplyForm(false)
    }

    const handleLikeClick = () => {
        if (!liked) {
            handleLike(comment.id)
            setLiked(true)
        }
    }

    const handleDeleteClick = () => {
        handleDelete(comment.id)
    }

    const isDeletable = canDelete || (comment.user === currentUserName && comment.userType === currentUserType)


    return (
        <div className="comment-container">
            <div className="comment-header">
                <div>
                    <span className="comment-user">{comment.user}</span>
                    <span className="comment-time">{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                    {comment.isAuthorComment && <span className="comment-author">(作者)</span>}
                </div>
            </div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-actions">
                <button onClick={handleLikeClick} disabled={liked}>
                    <span className="comment-like-icon"
                          style={{ backgroundImage: `url(${backgroundImage})` }}></span>({comment.likes})
                </button>
                <button onClick={handleReplyClick}>
                    <span className="comment-reply-icon"></span>回复
                </button>
                {isDeletable && (
                    <button onClick={handleDeleteClick}>
                        <span className="comment-delete-icon"></span>删除
                    </button>
                )}
            </div>
            {showReplyForm && (
                <div className="reply-form">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="回复内容"
                        rows={2}
                    ></textarea>
                    <button onClick={handleSubmitReply} className="submit-button">提交回复</button>
                </div>
            )}
            <div className="comment-replies">
                {renderComments(comment.replies, comment.id)}
            </div>
        </div>
    )
}

export default CommentItem
