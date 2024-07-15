import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { ReaderBookshelfMessage } from 'Plugins/ReaderAPI/ReaderBookshelfMessage'
import { Button } from 'antd'
import { ReaderDeleteNovelMessage } from 'Plugins/ReaderAPI/ReaderDeleteNovelMessage'
import { ReaderGetChaptersMessage } from 'Plugins/NovelAPI/ReaderGetChaptersMessage'
import { ReaderGetMoneyMessage } from 'Plugins/ReaderAPI/ReaderGetMoneyMessage'
import { ReaderGetOldChaptersMessage } from 'Plugins/ReaderAPI/ReaderGetOldChaptersMessage'
import { NovelsRankingMessage } from 'Plugins/NovelAPI/NovelsRankingMessage'
import { ReaderSetOldChapterMessage } from 'Plugins/ReaderAPI/ReaderSetOldChapterMessage'

const ReaderMain = () => {
    const [bookName, setBookName] = useState('')
    const [bookshelf, setBookshelf] = useState([])
    const [bookRanking, setBookRanking] = useState([])
    const [error] = useState('')
    const [success, setSuccess] = useState('')
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const history = useHistory()
    const [money, setMoney] = useState(0)
    const [allChapters, setAllChapters] = useState<BookChapters[]>([])
    const [newChapters, setNewChapters] = useState<NewChapters[]>([])
    const [showChapters, setShowChapters] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true // 标志位，指示组件是否挂载
        fetchBookshelf()
        fetchBookRanking()
        fetchMoney()

        return () => {
            isMounted = false // 在组件卸载时将标志位设为 false
        }
    }, [])

    useEffect(() => {
        fetchNewChapters()
        console.log('New chapters updated:', newChapters)
    }, [bookshelf])

    type Chapter = {
        chapter: number
        chaptername: string
        status: number
    }

    type BookChapters = {
        bookName: string
        chapters: Chapter[]
    }

    interface NewChapters {
        bookName: string
        newChapters: Chapter[]
    }

    const fetchOldChapters = async () => {
        try {
            const response = await axios.post(
                new ReaderGetOldChaptersMessage(username).getURL(),
                JSON.stringify(new ReaderGetOldChaptersMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            return response.data
        } catch (err) {
            console.error('Failed to fetch old chapters', err)
            return []
        }
    }

    const fetchAllChaptersForBooks = async (books: string[]): Promise<BookChapters[]> => {
        const fetchChapterPromises = books.map(async bookName => {
            const response = await axios.post(
                new ReaderGetChaptersMessage(bookName, username).getURL(),
                JSON.stringify(new ReaderGetChaptersMessage(bookName, username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            const chapters = response.data.map((item: any) => ({
                chapter: item.chapter,
                chaptername: item.chaptername,
                status: item.status,
            }))
            return {
                bookName,
                chapters,
            }
        })
        return await Promise.all(fetchChapterPromises)
    }

    const fetchNewChapters = async () => {
        try {
            const oldChaptersData = await fetchOldChapters()
            const oldChaptersMap = oldChaptersData.reduce(
                (
                    map: Record<string, Set<number>>,
                    { readerbook, readeroldchapters }: { readerbook: string; readeroldchapters: number[] },
                ) => {
                    map[readerbook] = new Set(readeroldchapters)
                    return map
                },
                {},
            )
            const allChaptersData = await fetchAllChaptersForBooks(bookshelf)
            const newChaptersData = allChaptersData
                .map(({ bookName, chapters }) => {
                    const newChapters = chapters.filter(chapter => {
                        return (
                            (chapter.status === 1 || chapter.status === 2) &&
                            !oldChaptersMap[bookName]?.has(chapter.chapter)
                        )
                    })
                    return {
                        bookName,
                        newChapters,
                    }
                })
                .filter(item => item.newChapters.length > 0)
            setAllChapters(allChaptersData)
            setNewChapters(newChaptersData)
        } catch (err) {
            console.error('Failed to fetch new chapters', err)
        }
    }

    const fetchBookshelf = async () => {
        try {
            const response = await axios.post(
                new ReaderBookshelfMessage(username).getURL(),
                JSON.stringify(new ReaderBookshelfMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].readerbook) {
                setBookshelf(response.data[0].readerbook)
            } else {
                setBookshelf([])
            }
        } catch (err) {
            console.error('Failed to fetch bookshelf', err)
        }
    }
    const fetchBookRanking = async () => {
        try {
            console.log('Fetching book ranking');
            const message = new NovelsRankingMessage();
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            if (data) {
                setBookRanking(data);
            } else {
                console.error('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching book ranking:', error);
        }
    }


    const fetchMoney = async () => {
        try {
            const response = await axios.post(
                new ReaderGetMoneyMessage(username).getURL(),
                JSON.stringify(new ReaderGetMoneyMessage(username)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setMoney(response.data)
        } catch (err) {
            console.error('Failed to fetch money', err)
        }
    }

    const handleSearch = () => {
        if (bookName.trim() !== '') {
            history.push(`/readersearchnovel?userName=${username}&bookName=${bookName}`)
        }
    }

    const isChapterNew = (bookName: string, chapterNumber: number): boolean => {
        const book = newChapters.find(b => b.bookName === bookName)
        return book?.newChapters.some(c => c.chapter === chapterNumber) || false
    }

    const handleDelete = async (bookItem: string) => {
        try {
            await axios.post(
                new ReaderDeleteNovelMessage(username, bookItem).getURL(),
                JSON.stringify(new ReaderDeleteNovelMessage(username, bookItem)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setSuccess('Deleted successfully')
            fetchBookshelf()
        } catch (err) {
            console.error('Failed to delete book', err)
        }
    }

    const isBookNew = (bookitem: string) => {
        const book = newChapters.find(b => b.bookName === bookitem)
        return book ? true : false
    }

    const handleBookClick = (bookItem: string, isAdded: boolean) => {
        console.log('Navigating to novelinfo with:', { isChapterNew })
        history.push({
            pathname: `/novelinfo`,
            search: `?userName=${username}&noveltitle=${bookItem}&isAdded=${isAdded}`,
            state: {
                isChapterNew,
                newChapters,
            },
        })
    }



    return (
        <div>
            <header>
                <h1>Welcome our precious reader——{username}!</h1>
                <input
                    type="text"
                    value={bookName}
                    onChange={e => setBookName(e.target.value)}
                    placeholder="Search book..."
                />
                <button onClick={handleSearch}>Search</button>
            </header>
            <main>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <section>
                    <h2>Bookshelf</h2>
                    <ul>
                        {bookshelf.length !== 0 ? (
                            bookshelf.map((bookItem: string, idx: number) => (
                                <li key={idx}>
                                    <Button
                                        onClick={() => handleBookClick(bookItem, true)}
                                        style={{ margin: '5px', padding: '10px 20px', textDecoration: 'underline' }}
                                        type="link"
                                    >
                                        {bookItem} {isBookNew(bookItem) && <span style={{ color: 'red' }}> new</span>}
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(bookItem)}
                                        style={{ padding: '10px 20px', marginTop: '20px', color: 'red' }}
                                        type="link"
                                    >
                                        Remove this book
                                    </Button>
                                </li>
                            ))
                        ) : (
                            <li>You haven't added any books</li>
                        )}
                    </ul>
                    {showChapters && (
                        <div>
                            <h3>章节:</h3>
                            <ul>
                                {allChapters.map((book: any) =>
                                    book.bookName === showChapters ? (
                                        book.chapters.map((chapter: any) => (
                                            <div key={chapter.chapter}>
                                                <li>
                                                    chapter {chapter.chapter}: {chapter.chaptername}
                                                    {chapter.status === 1 || chapter.status === 2 ? (
                                                        <span style={{ color: 'green' }}> 这个章节可以查看</span>
                                                    ) : (
                                                        <span style={{ color: 'orange' }}> 这个章节正在被审核</span>
                                                    )}
                                                    <Button
                                                        onClick={() =>
                                                            history.push(
                                                                `/readerreadnovel?userName=${username}&title=${showChapters}&chapter=${chapter.chapter}`,
                                                            )
                                                        }
                                                        style={{
                                                            margin: '5px',
                                                            padding: '10px 20px',
                                                            textDecoration: 'underline',
                                                        }}
                                                        type="link"
                                                        disabled={chapter.status === 0 || chapter.status === 3}
                                                    >
                                                        阅读
                                                    </Button>
                                                    {isChapterNew(showChapters, chapter.chapter) && (
                                                        <span style={{ color: 'red' }}> 更新</span>
                                                    )}
                                                </li>
                                            </div>
                                        ))
                                    ) : null,
                                )}
                            </ul>
                        </div>
                    )}
                </section>
                <section>
                    <h2>Book Ranking</h2>
                    <ul>
                        {bookRanking.map((book, idx) => (
                            <li key={idx}>
                                {idx + 1}.
                                <Button
                                    onClick={() => handleBookClick(book.title, false)}
                                    style={{ margin: '5px', padding: '10px 20px', textDecoration: 'underline' }}
                                    type="link"
                                >
                                    {book.title}
                                </Button>
                                - Rating: {book.rating !== null ? book.rating : '暂无评分'}
                            </li>
                        ))}
                    </ul>
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
            <div>
                <button
                    onClick={() => history.push(`/readeraddmoney?userName=${username}&money=${money}`)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    current money:{money}
                </button>
            </div>
        </div>
    )
}

export default ReaderMain
