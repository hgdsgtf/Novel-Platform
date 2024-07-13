import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { WriterBookshelfMessage } from 'Plugins/WriterAPI/WriterBookshelfMessage'
import { Button } from 'antd'
import { WriterGetChaptersMessage } from 'Plugins/NovelAPI/WriterGetChaptersMessage'


const EditorMain = () => {
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')

    return (
        <div>
            <h1>Welcome our outstanding editor——{username}!</h1>

            <div>
                <button
                    onClick={() => history.push(`/homepagestylelist?userName=${username}`)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Edit HomePage
                </button>
            </div>
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

export default EditorMain
