import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Select, Form, Modal, message as antdMessage } from 'antd';
import { GetChapterRatingMessage } from 'Plugins/NovelAPI/GetChapterRatingMessage';
import { ReaderGetChaptersMessage } from 'Plugins/NovelAPI/ReaderGetChaptersMessage';
import { ReaderMakeNovelRateMessage } from 'Plugins/NovelAPI/ReaderMakeNovelRateMessage';
import { NovelInfoMessage } from 'Plugins/NovelAPI/NovelInfoMessage';
import { ReaderAddNovelMessage } from 'Plugins/ReaderAPI/ReaderAddNovelMessage';
import styles from '../../styles/NovelInfo.module.css';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage'

const { Option } = Select;

const NovelInfo = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState('');
    const [chapters, setChapters] = useState([]);
    const [visible, setVisible] = useState(false); // 控制表单显示
    const [userRating, setUserRating] = useState<number | null>(null); // 用户评分
    const [selectedBook, setSelectedBook] = useState<string | null>(null); // 设置选中的
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(location.search);
    const noveltitle = query.get('noveltitle');
    const username = query.get('userName');
    const isAdded = query.get('isAdded') === 'true';
    const [form] = Form.useForm();
    const state = location.state as {
        isChapterNew?: (bookItem: string, chapter: number) => boolean;
        SetOldChapter?: (bookItem: string, chapter: number) => void;
        newChapters?: any; // 添加这个属性来调试
    } || {};

    useEffect(() => {
        console.log('Component loaded, calling fetchStyle');
        fetchNovelInfo();
        fetchChapters();

        fetchStyle();
        setSelectedBook(noveltitle); // 设置选中的书籍
    }, []);
    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId_NovelInfo')
            return storedStyleId ? parseInt(storedStyleId) : 1 // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e)
            return 1 // Default to 1 in case of any error
        }
    }
    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId())
    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('NovelInfo', currentStyleId);
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
                const userRating = data.userRating || null;

                const updatedInfo = {
                    title: novelInfo.title || 'N/A',
                    author: novelInfo.author || 'N/A',
                    rating: novelInfo.rating !== null ? novelInfo.rating : 'No rating available'
                };

                setTitle(updatedInfo.title);
                setAuthor(updatedInfo.author);
                setRating(updatedInfo.rating);
                setUserRating(userRating);
            } else {
                console.error('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching novel info:', error);
        }
    };

    const handleAddBook = async (novelTitle: string) => {
        try {
            const response = await axios.post(
                new ReaderAddNovelMessage(username, novelTitle).getURL(),
                JSON.stringify(new ReaderAddNovelMessage(username, novelTitle)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess('添加成功');
            setError(null);
        } catch (err) {
            console.error('Submit failed', err);
            setError('添加失败，书籍已经在书架中');
            setSuccess(null);
        }
    };

    const fetchChapters = async () => {
        try {
            const response = await axios.post(
                new ReaderGetChaptersMessage(noveltitle, username).getURL(),
                JSON.stringify(new ReaderGetChaptersMessage(noveltitle, username)),
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
        history.push(`/readerreadnovel?userName=${username}&title=${noveltitle}&chapter=${chapter}&isAdded=${isAdded}`);
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const message = new ReaderMakeNovelRateMessage(noveltitle, values.rating, username);
            const jsonMessage = JSON.stringify(message);

            console.log('Sending JSON message:', jsonMessage); // 添加日志输出

            const response = await axios.post(message.getURL(), jsonMessage, {
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = response.data;

            if (responseData.includes("Rating added successfully")) { // 修改此处
                setUserRating(values.rating); // 设置用户评分
                antdMessage.success(responseData);
                setVisible(false);
                form.resetFields();
            } else {
                console.error('Error sending rating:', responseData);
                antdMessage.error(responseData);
            }
        } catch (error) {
            console.error('Error sending rating:', error.message);
            antdMessage.error('Error sending rating');
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div className={styles.novelInfoContainer}>
            <h2 className={styles.title}>小说信息</h2>
            <h3 className={styles.subtitle}>标题: {title}</h3>
            <h4 className={styles.author}>作者: {author}</h4>
            <h4 className={styles.rating}>作品评分: {rating !== null ? rating : '暂无评分'}</h4>
            {userRating === null ? (
                <Button onClick={showModal} style={{ padding: '10px 20px', marginLeft: '20px' }}>
                    作品评分
                </Button>
            ) : (
                <div>
                    <p className={styles.subtitle}>你的评分: {userRating}</p>
                </div>
            )}
            <div>
                <h3 className={styles.subtitle}>章节:</h3>
                <ul className={styles.chapterList}>
                    {chapters.map((chapter: any, index: number) => (
                        <div key={index}>
                            <li className={styles.chapterItem}>
                                chapter {chapter.chapter}: {chapter.chaptername}
                                {chapter.status === 1 || chapter.status === 2 ? (
                                    <span className={styles.chapterAvailable}> 这个章节可以查看</span>
                                ) : (
                                    <span className={styles.chapterPending}> 这个章节正在被审核</span>
                                )}
                                <Button
                                    onClick={() => {
                                        handleChapterClick(chapter.chapter);
                                        if (state.SetOldChapter) {
                                            console.log('Setting old chapter with:', noveltitle, chapter.chapter); // 打印日志
                                            try {
                                                state.SetOldChapter(noveltitle, chapter.chapter);
                                                history.push(`/readerreadnovel?userName=${username}&title=${noveltitle}&chapter=${chapter.chapter}`);
                                            } catch (error) {
                                                console.error('Failed to set old chapter:', error);
                                            }
                                        }
                                    }}
                                    className={styles.readButton}
                                    type="link"
                                    disabled={chapter.status === 0 || chapter.status === 3}
                                >
                                    阅读
                                </Button>
                                {state.isChapterNew && (
                                    state.isChapterNew(selectedBook, chapter.chapter) && (
                                        <span className={styles.chapterUpdated}> 更新</span>
                                    )
                                )}
                            </li>
                        </div>
                    ))}
                    {chapters.length === 0 && <li className={styles.noChapters}>This book has no chapters yet.</li>}
                </ul>
            </div>

            {isAdded === false && (
                <section>
                    <ul>
                        <button
                            onClick={() => handleAddBook(noveltitle)}
                            className={styles.addButton}
                        >
                            Add this Book
                        </button>
                        {success && <div className={styles.successMessage}>{success}</div>}
                        {error && <div className={styles.errorMessage}>{error}</div>}
                    </ul>
                </section>
            )}
            <Button
                onClick={() => history.push(`/readermain?userName=${username}&title=${noveltitle}`)}
                className={styles.backButton}
            >
                返回上一页面
            </Button>
            <Modal
                title="评分"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[{ required: true, message: 'Please select a rating!' }]}
                    >
                        <Select>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <Option key={rating} value={rating}>{rating}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NovelInfo;
