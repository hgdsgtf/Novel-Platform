import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { AdminLoginMessage } from 'Plugins/AdminAPI/AdminLoginMessage';
import styles from 'Styles/ReaderLogin.module.css'; // 使用ReaderLogin的样式
import backgroundImage from '../../assets/images/login.jpg';


const AdminLogin: React.FC = () => {
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
                new AdminLoginMessage(username, password).getURL(),
                JSON.stringify(new AdminLoginMessage(username, password)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess('Login succeeded');
            setTimeout(() => {
                history.push(`/adminmain?userName=${username}`);
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
                <h4>Admin Login</h4>
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
                        onClick={() => history.push('/adminforgotpassword')}
                        className={styles.submit}
                    >
                        Forgot?
                    </button>
                    <button
                        onClick={() => history.push('/adminhomepage')}
                        className={styles.submit}
                    >
                        Go Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
