import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { GetChapterPriceMessage } from 'Plugins/NovelAPI/GetChapterPriceMessage';
import { ReaderGetAccessMessage } from 'Plugins/NovelAPI/ReaderGetAccessMessage';
import { ReaderGetPartMessage } from 'Plugins/NovelAPI/ReaderGetPartMessage';
import { ReaderPurchaseNovelMessage } from 'Plugins/ReaderAPI/ReaderPurchaseNovelMessage';
import { ReaderReportIssueMessage } from 'Plugins/NovelAPI/ReaderReportIssueMessage';
import { GetFilteredChapterMessage } from 'Plugins/NovelAPI/GetFilteredChapterMessage';
import { GetChapterRatingMessage } from 'Plugins/NovelAPI/GetChapterRatingMessage';
import { ReaderMakeChapterRateMessage } from 'Plugins/NovelAPI/ReaderMakeChapterRateMessage';
import { Button, Select, Form, Modal, message as antdMessage } from 'antd';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import styles from '../../styles/ReaderReadNovel.module.css';

const { Option } = Select;

const ReaderReadNovel = () => {
    const [fetchedNovel, setFetchedNovel] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [chapterRating, setChapterRating] = useState(null); // 章节评分
    const [userRating, setUserRating] = useState<number | null>(null); // 用户评分
    const [visible, setVisible] = useState(false); // 控制表单显示

    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');
    const bookName = query.get('title');
    const chapter = query.get('chapter');
    const isAdded = query.get('isnotAdded') === 'false';
    const [isPurchased, setIsPurchased] = useState(false);
    const [price, setPrice] = useState(0);
    const [input, setInput] = useState(false);
    const [issue, setIssue] = useState('');

    const [form] = Form.useForm();

    useEffect(() => {
        handleGetAccess();
        fetchRatings();
    }, []);

    useEffect(() => {
        if (isPurchased) {
            handleGetNovel();
        } else {
            handleGetPartNovel();
            handleGetPrice();
        }
    }, [isPurchased]);

    useEffect(() => {
        fetchStyle();
    }, []);

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId_ReaderReadNovel');
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };

    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId());

    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('ReaderReadNovel', currentStyleId);
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
                console.log('No styles found for ReaderReadNovel');
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

    const handleGetAccess = async () => {
        try {
            const message = new ReaderGetAccessMessage(username, bookName, parseInt(chapter));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setIsPurchased(response.data);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const handleGetPrice = async () => {
        try {
            const message = new GetChapterPriceMessage(bookName, parseInt(chapter));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setPrice(response.data);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const handleGetNovel = async () => {
        try {
            const message = new GetFilteredChapterMessage(bookName, parseInt(chapter));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setFetchedNovel(response.data);
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const handleGetPartNovel = async () => {
        try {
            const message = new ReaderGetPartMessage(bookName, parseInt(chapter));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setFetchedNovel(response.data + '...');
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    const handlePurchase = async () => {
        if (!isPurchased) {
            try {
                const message = new ReaderPurchaseNovelMessage(username, bookName, parseInt(chapter), price);
                await axios.post(message.getURL(), JSON.stringify(message), {
                    headers: { 'Content-Type': 'application/json' },
                });
                setIsPurchased(true);
                handleGetNovel();
            } catch (error) {
                console.error('Error sending request:', error);
                const rExp = /(?<=Body:).*/;
                setError(error.response.data.error.match(rExp));
            }
        }
    };

    const handleReportIssue = async () => {
        try {
            const message = new ReaderReportIssueMessage(bookName, parseInt(chapter), issue);
            await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccess('Issues submitted');
            setTimeout(() => {
                history.push(`/novelinfo?userName=${username}&noveltitle=${bookName}`);
            }, 1000);
        } catch (error) {
            console.error('Error sending request:', error);
            const rExp = /(?<=Body:).*/;
            setError(error.response.data.error.match(rExp));
        }
    };

    const handleInputIssue = async () => {
        setInput(!input);
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
                const userRating = data.userRating !== null ? data.userRating : null;

                setChapterRating(chapterRating);
                setUserRating(userRating);
            } else {
                console.error('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const message = new ReaderMakeChapterRateMessage(bookName, parseInt(chapter), values.rating, username);
            const jsonMessage = JSON.stringify(message);

            console.log('Sending JSON message:', jsonMessage); // 添加日志输出

            const response = await axios.post(message.getURL(), jsonMessage, {
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = response.data;

            if (responseData.includes('Rating added successfully')) { // 修改此处
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
        <div className={styles.readerReadNovelContainer}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <h4 className={styles.title}>Read Novel</h4>
            <p>
                Novel: {bookName}-Chapter: {chapter}
            </p>
            <div className={styles.subtitle}>
                <p className={styles.novelContent}>Novel Content:</p>
                {fetchedNovel}
            </div>
            {!isPurchased && (
                <div>
                    <p>Price: {price}</p>
                    <button onClick={handlePurchase} className={styles.submitButton}>
                        Purchase
                    </button>
                </div>
            )}
            {isPurchased && (
                <div>
                    <p className={styles.subtitle}>Chapter Rating: {chapterRating !== null ? chapterRating : 'No rating available'}</p>
                    {userRating === null ? (
                        <button onClick={showModal} className={styles.ratingButton}>
                            Rate Chapter
                        </button>
                    ) : (
                        <div className={styles.subtitle}>
                            <p>Your Rating: {userRating}</p>
                        </div>
                    )}
                    <button
                        onClick={() => history.push(`/novelcomments?userName=${username}&userType=reader&title=${bookName}&chapter=${chapter}`)}
                        className={styles.submitButton}
                    >
                        Check comment
                    </button>
                    <button onClick={handleInputIssue} className={styles.submitButton}>
                        Report an issue
                    </button>
                    {input && (
                        <div>
                        <textarea
                            value={issue}
                            onChange={e => {
                                setIssue(e.target.value)
                                setError('')
                            }}
                            placeholder="Report your issues"
                            required
                            className={styles.issueTextarea}
                        />
                            <button onClick={handleReportIssue} className={styles.submitButton}>
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            )}
            <button
                onClick={() => history.push(`/novelinfo?userName=${username}&noveltitle=${bookName}&isAdded=${isAdded}`)}
                className={styles.submitButton}
            >
                返回上一页面
            </button>

            <Modal
                title="Rate Chapter"
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

export default ReaderReadNovel;
