import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from '../../styles/CommentItem.module.css';
import backgroundImage from '../../assets/images/like_icon.png';
import axios from 'axios';
import { CommentItemProps } from 'Plugins/CommentAPI/CommentItemMessage';
import { GetAllStylesMessage } from 'Plugins/StyleAPI/GetAllStylesMessage'
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage'

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
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [liked, setLiked] = useState(false);

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem(`currentStyleId_${'CommentItem'}`);
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };
    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId());

    useEffect(() => {
        fetchStyle();
    }, [currentStyleId]);
    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('CommemtItem', currentStyleId);
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            const responseData = response.data;
            if (Array.isArray(responseData) && responseData.length > 0) {
                const style = responseData[0];
                // 定义属性映射对象
                const styleProperties = {
                    '--button-color': style.buttonColor,
                    '--button-fontSize': style.buttonFontSize ? style.buttonFontSize.toString() + 'rem' : null,
                    '--button-width': style.buttonWidth ? style.buttonWidth.toString() + '%' : null,
                    '--paragraph-fontSize': style.paragraphFontSize ? style.paragraphFontSize.toString() + 'rem' : null,
                    '--paragraph-color': style.paragraphColor,
                    '--header-fontSize': style.headerFontSize ? style.headerFontSize.toString() + 'rem' : null,
                    '--header-color': style.headerColor
                };
                for (const [property, value] of Object.entries(styleProperties)) {
                    if (value) {
                        document.documentElement.style.setProperty(property, value);
                    }
                }
            } else {
                console.log('No styles found for NovelInfo');
            }
        } catch (error) {
            console.error('Error fetching styles:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };
    useEffect(() => {
        const userAlreadyLiked = comment.liker.some(
            liker => liker[0] === currentUserName && liker[1] === currentUserType,
        );
        setLiked(userAlreadyLiked);
    }, [comment.liker, currentUserName, currentUserType]);

    const handleReplyClick = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleSubmitReply = () => {
        handleReply(comment.id, comment.user, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    const handleLikeClick = () => {
        if (!liked) {
            handleLike(comment.id);
            setLiked(true);
        }
    };

    const handleDeleteClick = () => {
        handleDelete(comment.id);
    };

    const isDeletable = canDelete || (comment.user === currentUserName && comment.userType === currentUserType);

    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentHeader}>
                <div>
                    <span className={styles.commentUser}>{comment.user}</span>
                    <span className={styles.commentTime}>{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                    {comment.isAuthorComment && <span className={styles.commentAuthor}>(作者)</span>}
                </div>
            </div>
            <div className={styles.commentContent}>{comment.content}</div>
            <div className={styles.commentActions}>
                <button onClick={handleLikeClick} disabled={liked} className={styles.commentActionButton}>
                    <span className={styles.commentLikeIcon}
                          style={{ backgroundImage: `url(${backgroundImage})` }}></span>({comment.likes})
                </button>
                <button onClick={handleReplyClick} className={styles.commentActionButton}>
                    回复
                </button>
                {isDeletable && (
                    <button onClick={handleDeleteClick} className={styles.commentActionButton}>
                        删除
                    </button>
                )}
            </div>
            {showReplyForm && (
                <div className={styles.replyForm}>
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="回复内容"
                rows={2}
                className={styles.replyTextarea}
            ></textarea>
                    <button onClick={handleSubmitReply} className={styles.submitButton}>提交回复</button>
                </div>
            )}
            {comment.replies.length > 0 && (
                <div className={styles.commentReplies}>
                    {renderComments(comment.replies)}
                </div>
            )}
        </div>

    );
};

export default CommentItem;
