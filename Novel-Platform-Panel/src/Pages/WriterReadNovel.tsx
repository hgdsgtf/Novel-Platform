import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { GetChapterMessage } from 'Plugins/NovelAPI/GetChapterMessage'
import { WriterGetCommentMessage } from 'Plugins/NovelAPI/WriterGetCommentMessage'

const WriterReadNovel = () => {
    const [, setNovelTitle] = useState('')
    const [fetchedNovel, setFetchedNovel] = useState('')
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const bookName = query.get('bookName')
    const chapter = query.get('chapter')
    const status = query.get('status')
    const [auditorComments, setAuditorComments] = useState('')

    useEffect(() => {
        if (bookName) {
            setNovelTitle(bookName)
        }
        handleGetNovel()
        fetchAuditorComments()
    }, [bookName])

    const handleGetNovel = async () => {
        try {
            const message = new GetChapterMessage(bookName, parseInt(chapter))
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            setFetchedNovel(response.data)
        } catch (error) {
            console.error('Error sending request:', error)
        }
    }

    const fetchAuditorComments = async () => {
        try {
            const message = new WriterGetCommentMessage(bookName, parseInt(chapter))
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            setAuditorComments(response.data)
        } catch (error) {
            console.error('Error sending request:', error)
        }
    }

    return (
        <div>
            <h2>Read Novel</h2>
            <h3>
                Novel: {bookName}-Chapter: {chapter}
            </h3>
            <h3>{parseInt(status) === 3 && 'Auditor comments: '}</h3>
            <div>{parseInt(status) === 3 && auditorComments}</div>
            <div>
                <h3>Novel Content:</h3>
                <p>{fetchedNovel}</p>
            </div>
            <button
                onClick={() =>
                    history.push(
                        `/writerupdatenovelcontent?userName=${username}&bookName=${bookName}&chapter=${chapter}&status=${status}`
                    )
                }
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Update Content
            </button>
            { (
                <div>
                    <button onClick={() => {console.log(bookName);history.push(`/novelcomments?userName=${username}&userType=writer&title=${bookName}&chapter=${chapter}&status=${status}`)}} style={{ padding: '10px 20px', marginTop: '20px' }}>
                        Check comment
                    </button>
                </div>
            )}
            <button
                onClick={() => history.push(`/writermain?userName=${username}`)}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Go Back
            </button>
        </div>
    )
}
export default WriterReadNovel
