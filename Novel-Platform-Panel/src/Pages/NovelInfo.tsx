import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Select, Form, Modal, message as antdMessage } from 'antd'
import { GetChapterRatingMessage } from 'Plugins/NovelAPI/GetChapterRatingMessage'
import { ReaderGetChaptersMessage } from 'Plugins/NovelAPI/ReaderGetChaptersMessage'
import { ReaderMakeNovelRateMessage } from 'Plugins/NovelAPI/ReaderMakeNovelRateMessage'
import { NovelInfoMessage } from 'Plugins/NovelAPI/NovelInfoMessage'
import { ReaderSetOldChapterMessage } from 'Plugins/ReaderAPI/ReaderSetOldChapterMessage'
import { AdminUpdateClicksMessage } from 'Plugins/AdminAPI/AdminUpdateClicksMessage'
import { AdminUpdateClicksByDateMessage } from 'Plugins/AdminAPI/AdminUpdateClicksByDateMessage'

const { Option } = Select

const NovelInfo = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [rating, setRating] = useState('')
    const [chapters, setChapters] = useState([])
    const [visible, setVisible] = useState(false) // 控制表单显示
    const [userRating, setUserRating] = useState<number | null>(null) // 用户评分
    const [selectedBook, setSelectedBook] = useState<string | null>(null) // 设置选中的

    const location = useLocation()
    const history = useHistory()
    const query = new URLSearchParams(location.search)
    const noveltitle = query.get('noveltitle')
    const username = query.get('userName')
    const [form] = Form.useForm()
    const state = location.state as {
        isChapterNew?: (bookItem: string, chapter: number) => boolean;
        SetOldChapter?: (bookItem: string, chapter: number) => void;
        newChapters?: NewChapters[]; // 添加这个属性来调试
    } || {}

    interface NewChapters {
        bookName: string
        newChapters: Chapter[]
    }

    type Chapter = {
        chapter: number
        chaptername: string
        status: number
    }

    useEffect(() => {
        fetchNovelInfo()
        fetchChapters()
        setSelectedBook(noveltitle) // 设置选中的书籍
    }, [])

    /*const isChapterNew = (bookName: string, chapterNumber: number): boolean => {
        console.log(state.newChapters)
        const book = state.newChapters.find(b => b.bookName === bookName)
        return book?.newChapters.some(c => c.chapter === chapterNumber) || false
    }*/

    const fetchNovelInfo = async () => {
        try {
            console.log('Fetching novel info for:', noveltitle)
            const message = new NovelInfoMessage(noveltitle, username)
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data

            if (data) {
                const novelInfo = data.novelInfo || {}
                const userRating = data.userRating || null

                const updatedInfo = {
                    title: novelInfo.title || 'N/A',
                    author: novelInfo.author || 'N/A',
                    rating: novelInfo.rating !== null ? novelInfo.rating : 'No rating available',
                }

                setTitle(updatedInfo.title)
                setAuthor(updatedInfo.author)
                setRating(updatedInfo.rating)
                setUserRating(userRating)
            } else {
                console.error('No data received from server')
            }
        } catch (error) {
            console.error('Error fetching novel info:', error)
        }
    }

    const fetchChapters = async () => {
        try {
            const response = await axios.post(
                new ReaderGetChaptersMessage(noveltitle, username).getURL(),
                JSON.stringify(new ReaderGetChaptersMessage(noveltitle, username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setChapters(response.data)
        } catch (error) {
            console.error('Error fetching chapters:', error)
        }
    }

    const handleChapterClick = (chapter: number) => {
        SetOldChapter(noveltitle, chapter)
        handleUpdateClicks(noveltitle)
        history.push(`/readerreadnovel?userName=${username}&title=${noveltitle}&chapter=${chapter}`)
    }

    const showModal = () => {
        setVisible(true)
    }

    const SetOldChapter = async (bookname: string, chapter: number) => {
        try {
            await axios.post(
                new ReaderSetOldChapterMessage(username, bookname, chapter).getURL(),
                JSON.stringify(new ReaderSetOldChapterMessage(username, bookname, chapter)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        } catch (err) {
            console.error('Failed to set oldchapter', err)
        }
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()

            const message = new ReaderMakeNovelRateMessage(noveltitle, values.rating, username)
            const jsonMessage = JSON.stringify(message)

            console.log('Sending JSON message:', jsonMessage) // 添加日志输出

            const response = await axios.post(message.getURL(), jsonMessage, {
                headers: { 'Content-Type': 'application/json' },
            })

            const responseData = response.data

            if (responseData.includes('Rating added successfully')) { // 修改此处
                setUserRating(values.rating) // 设置用户评分
                antdMessage.success(responseData)
                setVisible(false)
                form.resetFields()
            } else {
                console.error('Error sending rating:', responseData)
                antdMessage.error(responseData)
            }
        } catch (error) {
            console.error('Error sending rating:', error.message)
            antdMessage.error('Error sending rating')
        }
    }

    const handleCancel = () => {
        setVisible(false)
    }

    const handleUpdateClicks = async (bookItem: string) => {
        const currenttime: Date = new Date()
        console.log(currenttime)
        try {
            await axios.post(
                new AdminUpdateClicksMessage(username, bookItem, currenttime).getURL(),
                JSON.stringify(new AdminUpdateClicksMessage(username, bookItem, currenttime)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            await axios.post(
                new AdminUpdateClicksByDateMessage(bookItem, currenttime).getURL(),
                JSON.stringify(new AdminUpdateClicksByDateMessage(bookItem, currenttime)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        } catch (err) {
            console.error('Failed to update', err)
        }
    }

    return (
        <div>
            <h4>小说信息</h4>
            <p>标题: {title}</p>
            <p>作者: {author}</p>
            <p>作品评分: {rating}</p>
            {userRating === null ? (
                <Button onClick={showModal} style={{ padding: '10px 20px', marginLeft: '20px' }}>
                    作品评分
                </Button>
            ) : (
                <div>
                    <p>你的评分: {userRating}</p>
                </div>
            )}

            <div>
                <p>章节:</p>
                <ul>
                    {chapters.map((chapter: any, index: number) => (
                        <div key={index}>
                            <li>
                                <p>chapter {chapter.chapter}: {chapter.chaptername}</p>
                                {chapter.status === 1 || chapter.status === 2 ? (
                                    <p style={{ color: 'green' }}> 这个章节可以查看</p>
                                ) : (
                                    <p style={{ color: 'orange' }}> 这个章节正在被审核</p>
                                )}
                                <Button
                                    onClick={() => {
                                        handleChapterClick(chapter.chapter)
                                        if (state.SetOldChapter) {
                                            console.log('Setting old chapter with:', noveltitle, chapter.chapter) // 打印日志
                                            try {
                                                state.SetOldChapter(noveltitle, chapter.chapter)
                                                history.push(`/readerreadnovel?userName=${username}&title=${noveltitle}&chapter=${chapter.chapter}`)
                                            } catch (error) {
                                                console.error('Failed to set old chapter:', error)
                                            }
                                        }
                                    }}
                                    style={{
                                        margin: '5px',
                                        padding: '10px 20px',
                                        textDecoration: 'underline',
                                    }}
                                    type="link"
                                    disabled={chapter.status === 0 || chapter.status === 3}
                                >
                                    阅读
                                </Button>
                                {/*{isChapterNew(selectedBook, chapter.chapter) && (
                                    <span style={{ color: 'red' }}> 更新</span>
                                )
                                }*/}
                            </li>
                        </div>
                    ))}
                    {chapters.length === 0 && <li>This book has no chapters yet.</li>}
                </ul>
            </div>

            <Button
                onClick={() => history.push(`/readermain?userName=${username}&title=${noveltitle}`)}
                style={{ padding: '10px 20px', marginTop: '20px' }}
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
    )
}

export default NovelInfo
