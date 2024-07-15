import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { WriterGetChaptersMessage } from 'Plugins/NovelAPI/WriterGetChaptersMessage';
import { NovelInfoMessage } from 'Plugins/NovelAPI/NovelInfoMessage';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import styles from '../../styles/WriterNovelInfo.module.css';

const WriterNovelInfo = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState('');
    const [chapters, setChapters] = useState([]);

    const location = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(location.search);
    const noveltitle = query.get('noveltitle');
    const username = query.get('userName');
    const [selectedBook] = useState<string | null>(null); // 选中的书籍

    useEffect(() => {
        fetchNovelInfo();
        fetchChapters(); // 永久显示章节列表，组件加载时获取章节列表
        fetchStyle();
    }, []);

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId');
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };

    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId());

    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('WriterNovelInfo', currentStyleId);
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
                console.log('No styles found for WriterNovelInfo');
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

    const fetchNovelInfo = async () => {
        try {
            console.log('Fetching novel info for:', noveltitle);
            const message = new NovelInfoMessage(noveltitle, username);
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            if (data) {
                const novelInfo = data.novelInfo || {};

                const updatedInfo = {
                    title: novelInfo.title || 'N/A',
                    author: novelInfo.author || 'N/A',
                    rating: novelInfo.rating !== null ? novelInfo.rating : 'No rating available'
                };

                setTitle(updatedInfo.title);
                setAuthor(updatedInfo.author);
                setRating(updatedInfo.rating);
            } else {
                console.error('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching novel info:', error);
        }
    };

    const fetchChapters = async () => {
        try {
            const response = await axios.post(
                new WriterGetChaptersMessage(noveltitle).getURL(),
                JSON.stringify(new WriterGetChaptersMessage(noveltitle)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setChapters(response.data);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

    const handleChapterClick = (chapter: number) => {
        history.push(`/writerreadnovel?userName=${username}&bookName=${noveltitle}&chapter=${chapter}`);
    };

    const handleAddChapter = (bookItem: string) => {
        history.push(`/writeraddchapter?userName=${username}&bookName=${bookItem}`);
    };

    return (
        <div className={styles.writerNovelInfoContainer}>
            <h2 className={styles.title}>小说信息</h2>
            <h3 className={styles.subtitle}>标题: {title}</h3>
            <h4 className={styles.subtitle}>作者: {author}</h4>
            <h4 className={styles.subtitle}>作品评分: {rating}</h4>

            <div>
                <h3 className={styles.subtitle}>章节:</h3>
                <ul className={styles.chapterList}>
                    {chapters.map((chapter: any, index: number) => (
                        <div key={index} className={styles.chapterItem}>
                            <li>
                                chapter {chapter.chapter}: {chapter.chaptername}
                                <Button
                                    onClick={() => {
                                        handleChapterClick(chapter.chapter);
                                    }}
                                    className={styles.writerChapterButton}
                                    type="link"
                                >
                                    查看
                                </Button>
                            </li>
                        </div>
                    ))}
                    {chapters.length === 0 && <li className={styles.chapterItem}>This book has no chapters yet.</li>}
                </ul>
                <Button
                    onClick={() => handleAddChapter(noveltitle)}
                    className={styles.writerAddButton}
                >
                    Add new chapters for {noveltitle}
                </Button>
            </div>

            <Button
                onClick={() => history.push(`/writermain?userName=${username}&title=${noveltitle}`)}
                className={styles.backButton}
            >
                返回上一页面
            </Button>
        </div>
    );
};

export default WriterNovelInfo;
