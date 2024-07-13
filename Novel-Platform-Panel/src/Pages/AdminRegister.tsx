import React, { useEffect, useState } from 'react'
import axios, { isAxiosError } from 'axios'
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API } from 'Plugins/CommonUtils/API'
import { AdminRegisterMessage } from 'Plugins/AdminAPI/AdminRegisterMessage'
import { AdminSendCodeMessage } from 'Plugins/AdminAPI/AdminSendCodeMessage';
import styles from '../styles/ReaderRegister.module.css';
import backgroundImage from '../assets/images/register.jpg';
const AdminRegister = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCodeResendAllowed, setIsCodeResendAllowed] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const history = useHistory();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isCodeResendAllowed) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        setIsCodeResendAllowed(true);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCodeResendAllowed]);

    const handleSendVerificationCode = async (email:string) => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        try {
            const response = await axios.post((new AdminSendCodeMessage(email)).getURL(), JSON.stringify(new AdminSendCodeMessage(email)), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setIsCodeResendAllowed(false);
        } catch (err) {
            console.error('Failed to send verification code', err);
            const rExp : RegExp = /(?<=Body:).*/;
            setError(err.response.data.error.match(rExp));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6 || password.length > 12) {
            setError('Password must be between 6 and 12 characters');
            return;
        }
        if (!verificationCode) {
            setError('Please enter the verification code');
            return;
        }
        try {
            const response = await axios.post((new AdminRegisterMessage(name, email, password, verificationCode)).getURL(), JSON.stringify(new AdminRegisterMessage(name, email, password, verificationCode)), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setSuccess(response.data);
            setTimeout(() => {
                history.push('/adminlogin');}, 1000);
        } catch (err) {
            console.error('Registration failed', err);
            const rExp : RegExp = /(?<=Body:).*/;
            setError(err.response.data.error.match(rExp));
        }
    };

    return (
        <div className={styles.box}>
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                    <h4>Admin Register</h4>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '5px' }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px auto',
                        width: '120%',
                    }} className={styles.inputContainer}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('')
                            }}
                            placeholder="Name"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px auto',
                        width: '120%',
                    }} className={styles.inputContainer}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
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
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px auto',
                        width: '120%',
                    }} className={styles.inputContainer}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Confirm Password"
                            required
                            className={styles.inputField}
                        />
                        <div
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={styles.eyeIcon}
                        >
                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px auto',
                        width: '120%',
                    }} className={styles.inputContainer}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                            placeholder="Email"
                            required
                            className={styles.inputField}
                        />
                        <button
                            type="button"
                            onClick={() => handleSendVerificationCode(email)}
                            disabled={!isCodeResendAllowed}
                            className={styles.sendCodeButton}
                        >
                            {isCodeResendAllowed ? 'Send Verification Code' : `Resend Code in ${timeLeft}s`}
                        </button>
                    </div>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }} className={styles.inputContainer}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value);
                                    setError('')
                                }}
                                placeholder="Verification Code"
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <div>
                            <button type="submit" className={styles.fnButton}>
                                Register
                            </button>
                        </div>
                        <div>
                            <button onClick={() => history.push("/adminhomepage")}
                                    className={styles.fnButton}>
                                Go Back
                            </button>
                        </div>
                </form>
            </div>
        </div>
);
};

export default AdminRegister;