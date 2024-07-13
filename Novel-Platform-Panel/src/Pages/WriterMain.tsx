import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { WriterBookshelfMessage } from 'Plugins/WriterAPI/WriterBookshelfMessage'
import { Button } from 'antd'
import { WriterGetChaptersMessage } from 'Plugins/NovelAPI/WriterGetChaptersMessage'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import {
    AdminGetWriterClickRatesMessage,
} from 'Plugins/AdminAPI/AdminGetWriterClickRatesMessage'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)


const WriterMain = () => {
    const [bookName, setBookName] = useState('')
    const [bookshelf, setBookshelf] = useState([])
    const [showChapters, setShowChapters] = useState('')
    const [chapters, setChapters] = useState([])
    const [clickRate, setClickRate] = useState([])
    const [purchaseRate, setPurchaseRate] = useState([])
    const [error, setError] = useState('')
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')

    useEffect(() => {
        // Fetch bookshelf and rates from API
        fetchBookshelf()
        fetchRates()
        fetchChapterList()
    }, [showChapters])

    const fetchBookshelf = async () => {
        try {
            const response = await axios.post(
                new WriterBookshelfMessage(username).getURL(),
                JSON.stringify(new WriterBookshelfMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setBookshelf(response.data)
        } catch (err) {
            console.error('Failed to fetch bookshelf', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    const fetchChapterList = async () => {
        try {
            const response = await axios.post(
                new WriterGetChaptersMessage(showChapters).getURL(),
                JSON.stringify(new WriterGetChaptersMessage(showChapters)),
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

    const handleCreateBook = () => {
        if (bookName.trim() !== '') {
            history.push(`/writercreatenovel?userName=${username}&bookName=${bookName}`)
        }
    }

    const handleBookClick = async (bookItem: string) => {
        if (showChapters !== bookItem) {
            setShowChapters(bookItem)
        } else {
            setShowChapters('')
        }
    }

    const handleAddChapter = (bookItem: string) => {
        history.push(`/writeraddchapter?userName=${username}&bookName=${bookItem}`)
    }

    const handleUpdate = async (bookItem: string, chapter: number, status: number) => {
        history.push(`/writerreadnovel?userName=${username}&bookName=${bookItem}&chapter=${chapter}&status=${status}`)
    }

    const fetchRates = async () => {
        try {
            //setClickRate([1, 2, 3, 9])
            setPurchaseRate([5, 2, 3, 0])
            const response = await axios.post(
                new AdminGetWriterClickRatesMessage(username).getURL(),
                JSON.stringify(new AdminGetWriterClickRatesMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            console.log(response.data)
            setClickRate(response.data)
            //setPurchaseRate(response.data.purchaseRate)
        } catch (err) {
            console.error('Failed to fetch rates', err)
        }
    }


    const lineData = {
        labels: clickRate.map((items, index) => `${items['date']}`),
        datasets: [
            {
                label: 'Click Rate',
                data: clickRate.map((items, index) => items['clicks']),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
            {
                label: 'Purchase Rate',
                data: purchaseRate,
                borderColor: 'rgba(153,102,255,1)',
                fill: false,
            },
        ],
    }

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                //position: 'top',
            },
            title: {
                display: true,
                text: 'Click Rate and Purchase Rate Over Time',
            },
        },
    }

    return (
        <div>
            <header>
                <h1>Welcome our outstanding writer——{username}!</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    value={bookName}
                    onChange={e => setBookName(e.target.value)}
                    placeholder="Enter book title"
                />
                <button onClick={handleCreateBook}>Create Book</button>
            </header>
            <main>
                <section>
                    <h2>Bookshelf</h2>
                    <ul>
                        {bookshelf.length !== 0 && bookshelf[0].writerbook.length !== 0 ? (
                            bookshelf[0].writerbook.map((bookItem: string, idx: number) => (
                                <li key={idx}>
                                    <Button
                                        onClick={() => handleBookClick(bookItem)}
                                        style={{ margin: '5px', padding: '10px 20px', textDecoration: 'underline' }}
                                        type="link"
                                    >
                                        {bookItem}
                                    </Button>
                                    {showChapters === bookItem && (
                                        <div>
                                            <ul>
                                                {chapters.length !== 0 ? (
                                                    chapters.map(chapter => (
                                                        <div>
                                                            <li key={chapter.chapter}>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleUpdate(
                                                                            bookItem,
                                                                            chapter.chapter,
                                                                            chapter.status,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        margin: '5px',
                                                                        padding: '10px 20px',
                                                                        textDecoration: 'underline',
                                                                    }}
                                                                    type="link"
                                                                >
                                                                    chapter {chapter.chapter} : {chapter.chaptername}
                                                                </Button>
                                                            </li>
                                                            {chapter.status === 0 ? (
                                                                <div>This chapter is pending audit</div>
                                                            ) : chapter.status === 3 ? (
                                                                <div>This chapter is rejected</div>
                                                            ) : (
                                                                <div>This chapter is approved</div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <li>You haven't added any chapters</li>
                                                )}
                                            </ul>
                                            <Button
                                                onClick={() => handleAddChapter(bookItem)}
                                                style={{
                                                    margin: '5px',
                                                    padding: '10px 20px',
                                                }}
                                            >
                                                Add new chapters for {bookItem}
                                            </Button>
                                        </div>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li>You haven't created any books</li>
                        )}
                    </ul>
                </section>
                <section>
                    <h2>Click and Purchase Rates</h2>
                    {<Line data={lineData} options={lineOptions} />}
                </section>
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

export default WriterMain
