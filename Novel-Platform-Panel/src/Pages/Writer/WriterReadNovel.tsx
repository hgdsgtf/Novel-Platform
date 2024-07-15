import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { GetChapterMessage } from 'Plugins/NovelAPI/GetChapterMessage';
import { GetChapterRatingMessage } from 'Plugins/NovelAPI/GetChapterRatingMessage';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import styles from '../../styles/WriterReadNovel.module.css';

const WriterReadNovel = () => {
    const [, setNovelTitle] = useState('');
    const [fetchedNovel, setFetchedNovel] = useState('');
    const [chapterRating, setChapterRating] = useState<string | null>(null);
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');
    const bookName = query.get('bookName');
    const chapter = query.get('chapter');
    const status = query.get('status');
    const [auditorComments, setAuditorComments] = useState('');

    useEffect(() => {
        if (bookName) {
            setNovelTitle(bookName);
        }
        handleGetNovel();
        fetchRatings();
        fetchStyle();
    }, [bookName]);

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId_WriterReadNovel');
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };

    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId());

    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('WriterReadNovel', currentStyleId);
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
                console.log('No styles found for WriterReadNovel');
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

    const handleGetNovel = async () => {
        try {
            const message = new GetChapterMessage(bookName, parseInt(chapter));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setFetchedNovel(response.data);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const fetchRatings = async () => {
        try {
            console.log('Fetching ratings for:', bookName, chapter, username);
            const message = new GetChapterRatingMessage(bookName, parseInt(chapter), username);
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            if (data) {
                const chapterRating = data.chapterRating !== null ? data.chapterRating : 'No rating available';
                setChapterRating(chapterRating);
            } else {
                console.error('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    return (
        <div className={styles.writerReadNovelContainer}>
            <h2 className={styles.title}>Read Novel</h2>
            <h3 className={styles.subtitle}>
                Novel: {bookName}-Chapter: {chapter}
            </h3>
            <h3 className = {styles.subtitle}>{parseInt(status) === 3 && 'Auditor comments: '}</h3>
            <div  className={styles.novelContent}>{parseInt(status) === 3 && auditorComments}</div>
            <div>
                <h3 className = {styles.subtitle}>Content:</h3>
                <p className={styles.novelContent}>{fetchedNovel}</p>
            </div>
            {chapterRating !== null && (
                <div className={styles.novelContent}>
                    <h4>Chapter Rating: {chapterRating}</h4>
                </div>
            )}
            <button
                onClick={() =>
                    history.push(
                        `/writerupdatenovelcontent?userName=${username}&bookName=${bookName}&chapter=${chapter}&status=${status}`
                    )
                }
                className={styles.updateButton}
            >
                <p className={styles.novelContent}>Update Content</p>
            </button>
            <div>
                <button onClick={() => {
                    console.log(bookName);
                    history.push(`/novelcomments?userName=${username}&userType=writer&title=${bookName}&chapter=${chapter}&status=${status}&isWriterReadNovelPage=true`);
                }} className={styles.updateButton}>
                    <p className={styles.novelContent}>Check comment</p>
                </button>
            </div>
            <button
                onClick={() => history.push(`/writernovelinfo?userName=${username}&noveltitle=${bookName}`)}
                className={styles.updateButton}
            >
                返回
            </button>
        </div>
    );
};

export default WriterReadNovel;
