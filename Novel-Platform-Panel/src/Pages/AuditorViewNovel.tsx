import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { GetChapterMessage } from 'Plugins/NovelAPI/GetChapterMessage'
import { AuditorApproveChapterMessage } from 'Plugins/NovelAPI/AuditorApproveChapterMessage'
import { AuditorFilterMessage } from 'Plugins/NovelAPI/AuditorFilterMessage'
import { AuditorRejectChapterMessage } from 'Plugins/NovelAPI/AuditorRejectChapterMessage'
import { AuditorGetIssuesMessage } from 'Plugins/NovelAPI/AuditorGetIssuesMessage'
import { GetFilteredChapterMessage } from 'Plugins/NovelAPI/GetFilteredChapterMessage'
import { AuditorResetChapterMessage } from 'Plugins/NovelAPI/AuditorResetChapterMessage'
import { AuditorGetCommentMessage } from 'Plugins/NovelAPI/AuditorGetCommentMessage'

const AuditorViewNovel = () => {
    const location = useLocation()
    const [content, setContent] = useState('')
    const [filteredContent, setFilteredContent] = useState('')
    const [issues, setIssues] = useState([])
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [filter, setFilter] = useState('')
    const [inputComment, setInputComment] = useState(false)
    const [comment, setComment] = useState('')
    const [reason, setReason] = useState('')
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const title = query.get('title')
    const chapter = query.get('chapter')
    const status = query.get('status')
    const history = useHistory()

    useEffect(() => {
        fetchContent()
        fetchIssues()
        fetchFilteredContent()
        fetchWriterReason()
    }, [])

    const fetchContent = async () => {
        try {
            const response = await axios.post(
                new GetChapterMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new GetChapterMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setContent(response.data)
        } catch (err) {
            const rExp: RegExp = /(?<=Body:).*/
            const matchResult = err.response.data.error.match(rExp)
            const matchedString = matchResult ? matchResult[0] : 'Unknown error'
            const error = matchedString !== ' ' ? matchedString : 'Unknown error'
            setContent('Error fetching content: ' + error)
        }
    }

    const fetchWriterReason = async () => {
        try {
            const response = await axios.post(
                new AuditorGetCommentMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new AuditorGetCommentMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setReason(response.data)
        } catch (err) {
            const rExp: RegExp = /(?<=Body:).*/
            const matchResult = err.response.data.error.match(rExp)
            const matchedString = matchResult ? matchResult[0] : 'Unknown error'
            const error = matchedString !== ' ' ? matchedString : 'Unknown error'
            setReason('Error fetching content: ' + error)
        }
    }

    const fetchFilteredContent = async () => {
        try {
            const response = await axios.post(
                new GetFilteredChapterMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new GetFilteredChapterMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setFilteredContent(response.data)
        } catch (err) {
            const rExp: RegExp = /(?<=Body:).*/
            const matchResult = err.response.data.error.match(rExp)
            const matchedString = matchResult ? matchResult[0] : 'Unknown error'
            const error = matchedString !== ' ' ? matchedString : 'Unknown error'
            setFilteredContent('Error fetching content: ' + error)
        }
    }

    const fetchIssues = async () => {
        try {
            const response = await axios.post(
                new AuditorGetIssuesMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new AuditorGetIssuesMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setIssues(response.data)
        } catch (err) {
            const rExp: RegExp = /(?<=Body:).*/
            const matchResult = err.response.data.error.match(rExp)
            const matchedString = matchResult ? matchResult[0] : 'Unknown error'
            const error = matchedString !== ' ' ? matchedString : 'Unknown error'
            setContent('Error fetching issues: ' + error)
        }
    }

    const handleFilter = async () => {
        try {
            await axios.post(
                new AuditorFilterMessage(title, parseInt(chapter), filter).getURL(),
                JSON.stringify(new AuditorFilterMessage(title, parseInt(chapter), filter)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            fetchContent()
            fetchFilteredContent()
        } catch (err) {
            console.error('Failed to fetch chapters', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    const handleApprove = async () => {
        try {
            const response = await axios.post(
                new AuditorApproveChapterMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new AuditorApproveChapterMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setSuccess(response.data)
            setTimeout(() => {
                history.push(`/auditormain?userName=${username}`)
            }, 1000)
        } catch (err) {
            console.error('Failed to fetch permissions', err)
        }
    }

    const handleReject = async () => {
        try {
            const response = await axios.post(
                new AuditorRejectChapterMessage(title, parseInt(chapter), comment).getURL(),
                JSON.stringify(new AuditorRejectChapterMessage(title, parseInt(chapter), comment)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setSuccess(response.data)
            setTimeout(() => {
                history.push(`/auditormain?userName=${username}`)
            }, 1000)
        } catch (err) {
            console.error('Failed to fetch permissions', err)
        }
    }

    const handleReset = async () => {
        try {
            await axios.post(
                new AuditorResetChapterMessage(title, parseInt(chapter)).getURL(),
                JSON.stringify(new AuditorResetChapterMessage(title, parseInt(chapter))),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            fetchContent()
            fetchFilteredContent()
        } catch (err) {
            console.error('Failed to fetch permissions', err)
        }
    }

    return (
        <div>
            <section>{content}</section>
            {reason ? (
                <div>
            <h3>Writer's reason:</h3>
            <section>{reason}</section></div>) : (<h3>First commit</h3>)}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <button onClick={() => handleApprove()} style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Approve
                </button>
                <button
                    onClick={() => setInputComment(!inputComment)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    {inputComment ? 'Fold' : 'Reject'}
                </button>
                {inputComment && (
                    <div>
                        <textarea
                            value={comment}
                            onChange={e => {
                                setComment(e.target.value)
                                setError('')
                            }}
                            placeholder="Your comments"
                            required
                            style={{
                                display: 'block',
                                margin: '10px auto',
                                padding: '10px',
                                width: '77%',
                                minHeight: '200px',
                            }}
                        />
                        <button onClick={() => handleReject()} style={{ padding: '10px 20px', marginTop: '20px' }}>
                            Submit
                        </button>
                    </div>
                )}
                <button
                    onClick={() => history.push(`/auditormain?userName=${username}`)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Go back
                </button>
            </div>
            <h3>{parseInt(status) === 2 && 'Issues'}</h3>
            <div>
                {parseInt(status) === 2 &&
                    issues.length !== 0 &&
                    issues[0].issues.map((issue: string) => <li>{issue}</li>)}
            </div>
            <section>
                <h2>Filtering keywords</h2>
                <div>
                    <input
                        type="text"
                        value={filter}
                        onChange={e => {
                            setFilter(e.target.value)
                        }}
                        placeholder="keyword"
                        required
                        style={{ flex: 1, padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                    />
                    <button onClick={() => handleFilter()} style={{ padding: '10px 20px', marginTop: '20px' }}>
                        Filter
                    </button>
                    <button onClick={() => handleReset()} style={{ padding: '10px 20px', marginTop: '20px' }}>
                        Reset
                    </button>
                </div>
            </section>
            <section>
                <textarea
                    value={content}
                    onChange={e => {
                        setContent(e.target.value)
                        setError('')
                    }}
                    placeholder="Report your issues"
                    required
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '10px',
                        width: '40%',
                        minHeight: '200px',
                    }}
                    disabled={true}
                />
                <textarea
                    value={filteredContent}
                    onChange={e => {
                        setFilteredContent(e.target.value)
                        setError('')
                    }}
                    placeholder="Report your issues"
                    required
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '10px',
                        width: '40%',
                        minHeight: '200px',
                    }}
                    disabled={true}
                />
            </section>
        </div>
    )
}

export default AuditorViewNovel
