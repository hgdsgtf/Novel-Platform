import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import styles from '../../styles/NovelComments.module.css';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import { SetPageStyleMessage } from 'Plugins/StyleAPI/SetPageStyleMessage';
import backgroundImage from '../../assets/images/like_icon.png';
const EditCommentItem = () => {
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    const username = query.get('userName');

    // 集中管理状态的对象
    const [styleSettings, setStyleSettings] = useState({
        styleName: '',
        buttonColor: '',
        buttonFontSize: 1,
        buttonWidth: 100,
        paragraphColor: '',
        paragraphFontSize: 1,
        headerFontSize: 1.5,
        headerColor: '',
    });

    const [showStyleNameInput, setShowStyleNameInput] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newStyleName, setNewStyleName] = useState('');

    useEffect(() => {
        fetchStyle();
    }, []);

    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('CommentItem', parseInt(id));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.length > 0) {
                const style = response.data[0];
                const updatedStyleSettings = {
                    styleName: style.styleName,
                    buttonColor: style.buttonColor,
                    buttonFontSize: style.buttonFontSize,
                    buttonWidth: style.buttonWidth,
                    paragraphColor: style.paragraphColor,
                    paragraphFontSize: style.paragraphFontSize,
                    headerFontSize: style.headerFontSize,
                    headerColor: style.headerColor
                };
                setStyleSettings(updatedStyleSettings);

                console.log('Updated style settings:', updatedStyleSettings);
            } else {
                console.log('No styles found for CommentItem');
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

    const setStyle = async () => {
        if (!newStyleName) {
            setError('Please enter your style name');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        const message = new SetPageStyleMessage(
            'CommentItem',
            newStyleName,
            styleSettings.buttonColor,
            styleSettings.buttonFontSize,
            styleSettings.buttonWidth,
            styleSettings.paragraphFontSize,
            styleSettings.paragraphColor,
            styleSettings.headerFontSize,
            styleSettings.headerColor
        );

        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setTimeout(() => {
                setSuccess('Style settings updated successfully');
            }, 3000);
            history.push(`/stylelist?pageName=CommentItem&userName=${username}`);
        } catch (error) {
            console.error('Failed to update style settings:', error);
        }
    };

    const handleSubmit = () => {
        setShowStyleNameInput(true);
    };

    const handleInputChange = (field: keyof typeof styleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStyleSettings(prevSettings => {
            const updatedValue = typeof prevSettings[field] === 'number' ? parseFloat(value) : value;
            console.log(`Updating field ${field} to value:`, updatedValue);
            return {
                ...prevSettings,
                [field]: updatedValue
            };
        });
    };

    return (
        <div>
            <label>Button Color</label>
            <input
                type="color"
                value={styleSettings.buttonColor || ''} // 确保有默认值
                onChange={handleInputChange('buttonColor')}
            />
            <label>Button Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.buttonFontSize || 1} // 确保有默认值
                onChange={handleInputChange('buttonFontSize')}
            />
            <label>Button Width</label>
            <input
                type="range"
                min="10"
                max="100"
                value={styleSettings.buttonWidth || 100} // 确保有默认值
                onChange={handleInputChange('buttonWidth')}
            />
            <label>Paragraph Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.paragraphFontSize || 1} // 确保有默认值
                onChange={handleInputChange('paragraphFontSize')}
            />
            <label>Paragraph Color</label>
            <input
                type="color"
                value={styleSettings.paragraphColor || ''} // 确保有默认值
                onChange={handleInputChange('paragraphColor')}
            />
            <label>Header Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.headerFontSize || 1.5} // 确保有默认值
                onChange={handleInputChange('headerFontSize')}
            />
            <label>Header Color</label>
            <input
                type="color"
                value={styleSettings.headerColor || ''} // 确保有默认值
                onChange={handleInputChange('headerColor')}
            />

            <div className={styles.commentContainer}>
                <div className={styles.commentHeader}>
                    <div>
                        <span className={styles.commentUser} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>用户名</span>
                        <span className={styles.commentTime} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>2024-01-01 00:00</span>
                        <span className={styles.commentAuthor} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>(作者)</span>
                    </div>
                </div>
                <div className={styles.commentContent} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>这是一条评论内容。</div>
                <div className={styles.commentActions}>
                    <span className={styles.commentLikeIcon} style={{ backgroundImage: backgroundImage }}></span>
                    <span style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>(0)</span>
                </div>
                <div className={styles.commentReplies}>
                    <p style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>暂无评论</p>
                </div>
            </div>
            {showStyleNameInput && (
                <>
                    <label>New Style Name</label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <input
                        type="text"
                        value={newStyleName}
                        onChange={(e) => {
                            setNewStyleName(e.target.value);
                            setError('');
                        }}
                        placeholder="New Style Name" required
                    />
                    <button onClick={setStyle} className={styles.submit}>
                        Confirm Submit
                    </button>
                </>
            )}
            {!showStyleNameInput && (
                <button onClick={handleSubmit} className={styles.submit}>
                    Submit
                </button>
            )}
            <button onClick={() => history.push(`/stylelist?pageName=CommentItem&userName=${username}`)}
                    className={styles.submit}>
                Go Back
            </button>
        </div>
    )
}

export default EditCommentItem;
