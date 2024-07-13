import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AdminSendCodeMessage } from 'Plugins/AdminAPI/AdminSendCodeMessage'
import { AdminResetMessage } from 'Plugins/AdminAPI/AdminResetMessage'
import { dialog } from 'electron'

const AdminForgotPassword: React.FC = () => {
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
            const response = await axios.post((new AdminResetMessage(name, email, password, verificationCode)).getURL(), JSON.stringify(new AdminResetMessage(name, email, password, verificationCode)), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setSuccess(response.data);
            setTimeout(() => {
                history.push('/adminlogin');}, 1000);
        } catch (err) {
            console.error('Reset failed', err);
            const rExp : RegExp = /(?<=Body:).*/;
            setError(err.response.data.error.match(rExp));
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Reset Password</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError('')
                }}
                placeholder="Email"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <button
                type="button"
                onClick={() => handleSendVerificationCode(email)}
                disabled={!isCodeResendAllowed}
                style={{ margin: '10px', padding: '10px 20px' }}
            >
                {isCodeResendAllowed ? 'Send Verification Code' : `Resend Code in ${timeLeft}s`}
            </button>
            <input
                type="text"
                value={verificationCode}
                onChange={(e) => {setVerificationCode(e.target.value); setError('')}}
                placeholder="Verification Code"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <input
                type="text"
                value={name}
                onChange={(e) => {setName(e.target.value); setError('')}}
                placeholder="New Name"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                margin: '10px auto',
                width: '80%'
            }}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('')
                    }}
                    placeholder="New Password (6-12 characters)"
                    required
                    style={{ flex: 1, padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                />
                <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                margin: '10px auto',
                width: '80%'
            }}>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("")
                    }}
                    placeholder="Confirm Password"
                    required
                    style={{ flex: 1, padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
                />
                <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
                >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            <div>
                <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Reset
                </button>
            </div>
            <div>
                <button onClick={() => history.push("/adminlogin")} style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Go Back
                </button>
            </div>
        </form>
    );
};

export default AdminForgotPassword;