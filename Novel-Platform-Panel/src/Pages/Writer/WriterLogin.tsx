import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { WriterLoginMessage } from 'Plugins/WriterAPI/WriterLoginMessage';
import styles from 'Styles/ReaderLogin.module.css'; // 使用ReaderLogin的样式
import backgroundImage from '../../assets/images/login.jpg';

const WriterLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const history = useHistory();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.post(
                new WriterLoginMessage(username, password).getURL(),
                JSON.stringify(new WriterLoginMessage(username, password)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess('Login succeeded');
            setTimeout(() => {
                history.push(`/writermain?userName=${username}`);
            }, 1000);
        } catch (err) {
            console.error('Login failed', err);
            const rExp: RegExp = /(?<=Body:).*/;
            setError(err.response.data.error.match(rExp));
        }
    };

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Writer Login</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                            placeholder="Username"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Password (6-12 characters)"
                            required
                            className={styles.inputField}
                        />
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.eyeIcon}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>
                    <button type="submit" className={styles.submit}>
                        Login
                    </button>
                    <button
                        onClick={() => history.push('/writerforgotpassword')}
                        className={styles.submit}
                    >
                        Forgot?
                    </button>
                    <button
                        onClick={() => history.push('/writerhomepage')}
                        className={styles.submit}
                    >
                        Go Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriterLogin;

