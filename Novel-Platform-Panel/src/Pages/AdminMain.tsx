import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom'
import { AdminLoginMessage } from 'Plugins/AdminAPI/AdminLoginMessage'

const AdminMain = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');
    const history = useHistory();

    return (
        <div>
            <header>
                <h1>Welcome our respected admin——{username}!</h1>
            </header>
            <div>
                <button onClick={() => history.push('/login')}
                        style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Log out
                </button>
            </div>
            <div>
                <button onClick={() => history.push(`/adminmanagewriter?userName=${username}`)}
                        style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Manage writer
                </button>
            </div>
            <div>
                <button onClick={() => history.push(`/adminmanageauditor?userName=${username}`)}
                        style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Manage auditor
                </button>
            </div>
        </div>
    );
};

export default AdminMain;