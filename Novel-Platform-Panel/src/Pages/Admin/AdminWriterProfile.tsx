import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import { WriterBookshelfMessage } from 'Plugins/WriterAPI/WriterBookshelfMessage'

const AdminWriterProfile: React.FC = () => {
    const location = useLocation();
    const [bookshelf, setBookshelf] = useState([]);
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const encodedWriterName = searchParams.get('writername');
    const writerName = encodedWriterName ? decodeURIComponent(encodedWriterName) : '';
    const history = useHistory();

    useEffect(() => {
        // Fetch bookshelf and rates from API
        fetchBookshelf();
    }, []);

    const fetchBookshelf = async () => {
        try {
            const response = await axios.post((new WriterBookshelfMessage(writerName)).getURL(), JSON.stringify(new WriterBookshelfMessage(writerName)), {
                headers: { 'Content-Type': 'application/json' },
            });
            setBookshelf(response.data);
        } catch (err) {
            console.error('Failed to fetch bookshelf', err);
        }
    };

    return (
        <div>
            <header>
                <h1>Writer Profile</h1>
                <h2>{writerName}'s Profile</h2>
            </header>
            {/* Display other content of writer profile */}
            <section>
                <h2>Bookshelf</h2>
                <ul>
                    {bookshelf.map((book, index) => (
                        <li key={index}>
                            <ul>
                                {book.writerbook.map((bookItem: string, idx: number) => (
                                    <li key={idx}>
                                        {bookItem}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

            </section>
            <button onClick={() => history.push(`/adminmanagewriter?userName=${username}`)}
                    style={{ padding: '10px 20px', marginTop: '20px' }}>
                Go Back
            </button>
        </div>
    );
};

export default AdminWriterProfile;