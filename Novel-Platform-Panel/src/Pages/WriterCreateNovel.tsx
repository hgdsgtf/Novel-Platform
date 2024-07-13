import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { WriterCreateNovelMessage } from 'Plugins/WriterAPI/WriterCreateNovelMessage'

const WriterCreateNovel: React.FC = () => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [author, setAuthor] = useState('')
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const bookName = query.get('bookName')
    const username = query.get('userName')

    useEffect(() => {
        if (bookName) {
            setTitle(bookName)
        }
        if (username) {
            setAuthor(username)
        }
    }, [bookName])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await axios.post(
                new WriterCreateNovelMessage(author, title).getURL(),
                JSON.stringify(new WriterCreateNovelMessage(author, title)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            console.log('Response status:', response.status)
            console.log('Response body:', response.data)
            setSuccess(response.data)
            setTimeout(() => {
                history.push(`/writermain?userName=${username}`)
            }, 1000)
        } catch (err) {
            console.error('Submit failed', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Add a Novel</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="text"
                value={title}
                onChange={e => {
                    setTitle(e.target.value)
                    setError('')
                }}
                placeholder="Title"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <input
                type="text"
                value={author}
                disabled={true}
                onChange={e => {
                    setAuthor(e.target.value)
                    setError('')
                }}
                placeholder="Author"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <div>
                <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Submit
                </button>
            </div>
            <div>
                <button
                    onClick={() => history.push(`/writermain?userName=${username}`)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Go Back
                </button>
            </div>
        </form>
    )
}

export default WriterCreateNovel
