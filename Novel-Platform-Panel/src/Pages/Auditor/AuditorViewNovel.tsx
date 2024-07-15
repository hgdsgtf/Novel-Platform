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
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage'
import styles from '../../styles/AuditorViewNovel.module.css'
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
    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem(`currentStyleId_AuditorViewNovel`);
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };
    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId());

    useEffect(() => {
        fetchStyle();
    }, [currentStyleId]);
    const fetchStyle = async () => {
        try {
            const message = new GetPageStyleMessage('AuditorViewNovel', currentStyleId);
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
        <div className={styles.auditorViewNovelContainer}>
            <section className={styles.novelContent}>{content}</section>
            {reason ? (
                <div className={styles.writerReason}>
                    <h3>Writer's reason:</h3>
                    <section>{reason}</section>
                </div>
            ) : (
                <h3 className={styles.firstCommit}>First commit</h3>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
            <div className={styles.buttonContainer}>
                <button onClick={() => handleApprove()} className={styles.actionButton}>
                    Approve
                </button>
                <button
                    onClick={() => setInputComment(!inputComment)}
                    className={styles.actionButton}
                >
                    {inputComment ? 'Fold' : 'Reject'}
                </button>
                {inputComment && (
                    <div className={styles.commentSection}>
                    <textarea
                        value={comment}
                        onChange={e => {
                            setComment(e.target.value)
                            setError('')
                        }}
                        placeholder="Your comments"
                        required
                        className={styles.commentTextarea}
                    />
                        <button onClick={() => handleReject()} className={styles.submitButton}>
                            Submit
                        </button>
                    </div>
                )}
                <button
                    onClick={() => history.push(`/auditormain?userName=${username}`)}
                    className={styles.actionButton}
                >
                    Go back
                </button>
            </div>
            {parseInt(status) === 2 && (
                <>
                    <h3 className={styles.issuesHeader}>Issues</h3>
                    <div className={styles.issuesList}>
                        {issues.length !== 0 && issues[0].issues.map((issue: string, index: number) => <li key={index}>{issue}</li>)}
                    </div>
                </>
            )}
            <section className={styles.filterSection}>
                <h2>Filtering keywords</h2>
                <div className={styles.filterInputContainer}>
                    <input
                        type="text"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        placeholder="keyword"
                        required
                        className={styles.filterInput}
                    />
                    <button onClick={() => handleFilter()} className={styles.filterButton}>
                        Filter
                    </button>
                    <button onClick={() => handleReset()} className={styles.filterButton}>
                        Reset
                    </button>
                </div>
            </section>
            <section className={styles.contentSection}>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Report your issues"
                required
                className={styles.contentTextarea}
                disabled
            />
                <textarea
                    value={filteredContent}
                    onChange={e => setFilteredContent(e.target.value)}
                    placeholder="Report your issues"
                    required
                    className={styles.contentTextarea}
                    disabled
                />
            </section>
        </div>
    );

}

export default AuditorViewNovel
