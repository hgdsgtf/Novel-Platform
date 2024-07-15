import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { WriterUpdateNovelContentMessage } from 'Plugins/NovelAPI/WriterUpdateNovelContentMessage'
import { GetChapterMessage } from 'Plugins/NovelAPI/GetChapterMessage'

const WriterUpdateNovelContent: React.FC = () => {
    const [title, setTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [reason, setReason] = useState('')
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const bookName = query.get('bookName')
    const chapter = query.get('chapter')
    const status = query.get('status')

    useEffect(() => {
        if (bookName) {
            setTitle(bookName)
            handleGetNovel()
        }
    }, [bookName])

    const handleGetNovel = async () => {
        try {
            const message = new GetChapterMessage(bookName, parseInt(chapter))
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            setNewContent(response.data)
        } catch (error) {
            console.error('Error sending request:', error)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const message = new WriterUpdateNovelContentMessage(title, parseInt(chapter), newContent, reason)
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log('Response:', response.data)
            setSuccess('Novel content updated successfully')
            setTimeout(() => {
                history.push(`/writerreadnovel?userName=${username}&bookName=${bookName}&chapter=${chapter}`)
            }, 1000)
        } catch (error) {
            console.error('Error:', error.response?.data)
            const rExp: RegExp = /(?<=Body:).*/
            setError(error.response?.data?.error.match(rExp) || 'Unknown error occurred')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Update Novel Content</h1>
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
                type="number"
                value={chapter}
                onChange={e => {
                    setTitle(e.target.value)
                    setError('')
                }}
                disabled={true}
                placeholder="Enter chapter"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <textarea
                value={newContent}
                onChange={e => {
                    setNewContent(e.target.value)
                    setError('')
                }}
                placeholder="Enter new content"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%', minHeight: '200px' }}
            />
            <div>
                <textarea
                    value={reason}
                    onChange={e => {
                        setReason(e.target.value)
                        setError('')
                    }}
                    placeholder="Your reason for updates"
                    required
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '10px',
                        width: '77%',
                        minHeight: '200px',
                    }}
                />
            </div>
            <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                Update Novel Content
            </button>
            <button
                onClick={() =>
                    history.push(
                        `/writerreadnovel?userName=${username}&bookName=${bookName}&chapter=${chapter}&status=${status}`
                    )
                }
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Go Back
            </button>
        </form>
    )
}

export default WriterUpdateNovelContent
