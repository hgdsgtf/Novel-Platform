import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { WriterAddChapterMessage } from 'Plugins/NovelAPI/WriterAddChapterMessage'

const WriterAddChapterContent: React.FC = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [chapter, setChapter] = useState(1)
    const [chapterName, setChapterName] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const bookName = query.get('bookName')

    useEffect(() => {
        if (bookName) {
            setTitle(bookName)
        }
        if (username) {
            setAuthor(username)
        }
    }, [bookName])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const parsedValue = parseInt(value)
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setChapter(parsedValue)
        } else {
            setChapter(1)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const message = new WriterAddChapterMessage(title, author, chapter, chapterName, content)
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log('Response:', response.data)
            setSuccess('Chapter added successfully')
            setTimeout(() => {
                history.push(`/writermain?userName=${username}`)
            }, 1000)
        } catch (error) {
            console.error('Error:', error.response?.data)
            const rExp: RegExp = /(?<=Body:).*/
            setError(error.response?.data?.error.match(rExp) || 'Unknown error occurred')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Add a new chapter</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="text"
                value={title}
                onChange={e => {
                    setTitle(e.target.value)
                    setError('')
                }}
                disabled={true}
                placeholder="Enter title"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <input
                type="text"
                value={author}
                onChange={e => {
                    setTitle(e.target.value)
                    setError('')
                }}
                disabled={true}
                placeholder="Enter author"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <input
                type="number"
                value={chapter}
                onChange={e => {
                    handleChange(e)
                    setError('')
                }}
                disabled={false}
                placeholder="Enter chapter"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <input
                type="text"
                value={chapterName}
                onChange={e => {
                    setChapterName(e.target.value)
                    setError('')
                }}
                disabled={false}
                placeholder="Enter chapter name"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <textarea
                value={content}
                onChange={e => {
                    setContent(e.target.value)
                    setError('')
                }}
                placeholder="Enter new content"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%', minHeight: '200px' }}
            />
            <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                Add chapter
            </button>
            <button
                onClick={() => history.push(`/writermain?userName=${username}`)}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Go Back
            </button>
        </form>
    )
}

export default WriterAddChapterContent
