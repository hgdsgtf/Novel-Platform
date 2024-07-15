import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Select, Form } from 'antd';

const { Option } = Select;

const EditorMain = () => {
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');

    const [selectedPage, setSelectedPage] = useState('');

    const handlePageSelect = (value:string) => {
        setSelectedPage(value);
        history.push(`/stylelist?pageName=${value}&userName=${username}`);
    };

    return (
        <div>
            <h1>Welcome our outstanding editor——{username}!</h1>
            <div>
                <label>Select Page to Edit Styles: </label>
                <Select
                    value={selectedPage}
                    onChange={handlePageSelect}
                    style={{ width: 200 }}
                >
                    <Option value="Novelinfo">Novel Info</Option>
                    <Option value="CommentItem">Comment Item</Option>
                    <Option value="NovelComments">Novel Comments</Option>
                    <Option value="WriterNovelInfo">Writer Novel Info</Option>
                    <Option value="WriterReadNovel">Writer Read Novel</Option>
                    <Option value="ReaderReadNovel">Reader Read Novel</Option>
                    <Option value="AuditorViewNovel">Auditor View Novel</Option>
                </Select>
            </div>
            <div>
                <button
                    onClick={() => history.push('/homepagestylelist')}
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
    );
};

export default EditorMain;
