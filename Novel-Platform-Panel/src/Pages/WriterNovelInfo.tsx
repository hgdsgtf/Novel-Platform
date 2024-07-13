import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from 'antd'
import { WriterGetChaptersMessage } from 'Plugins/NovelAPI/WriterGetChaptersMessage'
import { NovelInfoMessage } from 'Plugins/NovelAPI/NovelInfoMessage'

const WriterNovelInfo = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [rating, setRating] = useState('')
    const [chapters, setChapters] = useState([])

    const location = useLocation()
    const history = useHistory()
    const query = new URLSearchParams(location.search)
    const noveltitle = query.get('noveltitle')
    const username = query.get('userName')
    const [selectedBook] = useState<string | null>(null) // 选中的书籍

    useEffect(() => {
        fetchNovelInfo()
        fetchChapters() // 永久显示章节列表，组件加载时获取章节列表
    }, [])

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

                const updatedInfo = {
                    title: novelInfo.title || 'N/A',
                    author: novelInfo.author || 'N/A',
                    rating: novelInfo.rating !== null ? novelInfo.rating : 'No rating available',
                }

                setTitle(updatedInfo.title)
                setAuthor(updatedInfo.author)
                setRating(updatedInfo.rating)
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
                new WriterGetChaptersMessage(noveltitle).getURL(),
                JSON.stringify(new WriterGetChaptersMessage(noveltitle)),
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
        history.push(`/writerreadnovel?userName=${username}&bookName=${noveltitle}&chapter=${chapter}`)
    }

    const handleAddChapter = (bookItem: string) => {
        history.push(`/writeraddchapter?userName=${username}&bookName=${bookItem}`)
    }

    return (
        <div>
            <p>小说信息</p>
            <p>标题: {title}</p>
            <p>作者: {author}</p>
            <p>作品评分: {rating}</p>

            <div>
                <h3>章节:</h3>
                <ul>
                    {chapters.map((chapter: any, index: number) => (
                        <div key={index}>
                            <li>
                                chapter {chapter.chapter}: {chapter.chaptername}
                                {chapter.status === 1 || chapter.status === 2 ? (
                                    <span style={{ color: 'green' }}> This chapter is qualified</span>
                                ) : (
                                    <span style={{ color: 'orange' }}> This chapter is pending audit</span>
                                )}
                                <Button
                                    onClick={() => {
                                        handleChapterClick(chapter.chapter)
                                    }}
                                    style={{
                                        margin: '5px',
                                        padding: '10px 20px',
                                        textDecoration: 'underline',
                                    }}
                                    type="link"
                                    disabled={chapter.status === 0 || chapter.status === 3}
                                >
                                    查看
                                </Button>
                            </li>
                        </div>
                    ))}
                    {chapters.length === 0 && <li>This book has no chapters yet.</li>}
                </ul>
                <Button
                    onClick={() => handleAddChapter(noveltitle)}
                    style={{ margin: '5px', padding: '10px 20px' }}
                >
                    Add new chapters for {noveltitle}
                </Button>
            </div>

            <Button
                onClick={() => history.push(`/writermain?userName=${username}&title=${noveltitle}`)}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                返回上一页面
            </Button>
        </div>
    )
}

export default WriterNovelInfo
