import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { AuditorGetPermissionMessage } from 'Plugins/AuditorAPI/AuditorGetPermissionMessage'
import { Button } from 'antd'
import { AuditorGetChaptersMessage } from 'Plugins/NovelAPI/AuditorGetChaptersMessage'

const AuditorMain = () => {
    const location = useLocation()
    const [permission, setPermission] = useState(false)
    const [chapters, setChapters] = useState([])
    const [, setError] = useState('')
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const history = useHistory()

    useEffect(() => {
        fetchPermission()
        fetchChapterList()
    }, [])

    const fetchPermission = async () => {
        try {
            const response = await axios.post(
                new AuditorGetPermissionMessage(username).getURL(),
                JSON.stringify(new AuditorGetPermissionMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setPermission(response.data)
        } catch (err) {
            console.error('Failed to fetch permissions', err)
        }
    }

    const fetchChapterList = async () => {
        try {
            const response = await axios.post(
                new AuditorGetChaptersMessage().getURL(),
                JSON.stringify(new AuditorGetChaptersMessage()),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setChapters(response.data)
        } catch (err) {
            console.error('Failed to fetch chapters', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    const handleView = async (bookItem: string, chapter: number, status: number) => {
        history.push(`/auditorviewnovel?userName=${username}&title=${bookItem}&chapter=${chapter}&status=${status}`)
    }

    return (
        <div>
            <header>
                <h1>Welcome our judicious auditor——{username}!</h1>
            </header>
            <main>
                <section>
                    <h2>Status</h2>
                    <h3>{permission ? 'You are a qualified auditor!' : 'You are not qualified yet!'}</h3>
                </section>
                {permission && (
                    <main>
                        <section>
                            <h2>Chapters pending audition</h2>
                            <ul>
                                {chapters.length !== 0 ? (
                                    chapters.map(bookItem => (
                                        <li>
                                            <Button
                                                onClick={() =>
                                                    handleView(bookItem.title, bookItem.chapter, bookItem.status)
                                                }
                                                style={{
                                                    margin: '5px',
                                                    padding: '10px 20px',
                                                    textDecoration: 'underline',
                                                }}
                                                type="link"
                                            >
                                                {bookItem.title}-{bookItem.chapter}-{bookItem.chaptername}
                                            </Button>
                                            {bookItem.status === 0 ? '' : '!!!This chapter has issues!!!'}
                                        </li>
                                    ))
                                ) : (
                                    <li>Currently there are no more chapters to audit</li>
                                )}
                            </ul>
                        </section>
                    </main>
                )}
            </main>
            <div>
                <button
                    onClick={() => history.push('/login')}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Log out
                </button>
            </div>
        </div>
    )
}

export default AuditorMain
