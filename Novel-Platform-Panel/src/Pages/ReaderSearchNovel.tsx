import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { SearchNovelMessage } from 'Plugins/NovelAPI/SearchNovelMessage'
import { ReaderAddNovelMessage } from 'Plugins/ReaderAPI/ReaderAddNovelMessage'

const ReaderSearchNovel: React.FC = () => {
    const [title, setTitle] = useState('')
    const [bookResult, setBookResult] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const bookName = query.get('bookName')
    const username = query.get('userName')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await searchNovel(title)
    }

    const searchNovel = async (novelTitle: string) => {
        try {
            const response = await axios.post(
                new SearchNovelMessage(novelTitle).getURL(),
                JSON.stringify(new SearchNovelMessage(novelTitle)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setBookResult(response.data)
        } catch (err) {
            console.error('Submit failed', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    const handleAddBook = async (novelTitle: string) => {
        try {
            const response = await axios.post(
                new ReaderAddNovelMessage(username, novelTitle).getURL(),
                JSON.stringify(new ReaderAddNovelMessage(username, novelTitle)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setSuccess(response.data)
        } catch (err) {
            console.error('Submit failed', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    useEffect(() => {
        if (bookName) {
            setTitle(bookName)
            searchNovel(bookName)
        }
    }, [bookName])

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
                <h1>Search for Novels</h1>
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
                <div>
                    <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                        Search
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => history.push(`/readermain?userName=${username}`)}
                        style={{ padding: '10px 20px', marginTop: '20px' }}
                    >
                        Go Back
                    </button>
                </div>
            </form>
            <section>
                <h2 style={{ textAlign: 'center' }}>Results</h2>
                <ul>
                    {bookResult.length !== 0 ? (
                        bookResult.map((book, index) => (
                            <div>
                                <li key={index}>
                                    <strong>Title:</strong> {book.title}
                                </li>
                                <button
                                    onClick={() => handleAddBook(book.title)}
                                    style={{ padding: '10px 20px', marginTop: '20px' }}
                                >
                                    Add this Book
                                </button>
                            </div>
                        ))
                    ) : (
                        <div>No results found</div>
                    )}
                </ul>
            </section>
        </div>
    )
}

export default ReaderSearchNovel
