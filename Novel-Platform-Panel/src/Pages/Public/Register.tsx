import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from 'Styles/Register.module.css'
import backgroundImage from '../../assets/images/register.jpg'
import { UserSendCodeMessage } from 'Plugins/BasicUserAPI/UserSendCodeMessage'
import { UserRegisterMessage } from 'Plugins/BasicUserAPI/UserRegisterMessage'

const Register = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isCodeResendAllowed, setIsCodeResendAllowed] = useState(true)
    const [timeLeft, setTimeLeft] = useState(60)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [userType, setUserType] = useState('1')
    const history = useHistory()

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (!isCodeResendAllowed) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 1) {
                        clearInterval(timer)
                        setIsCodeResendAllowed(true)
                        return 60
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [isCodeResendAllowed])

    const handleSendVerificationCode = async (email: string) => {
        if (!email) {
            setError('Please enter your email')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }
        try {
            const response = await axios.post(
                new UserSendCodeMessage(email).getURL(),
                JSON.stringify(new UserSendCodeMessage(email)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            console.log(response.data)
            if ('Left' in response.data) {
                setError(response.data.Left.value[0])
                setTimeout(() => {
                    setError('')
                }, 3000)
            } else {
                setSuccess(response.data.Right.value)
                setIsCodeResendAllowed(false)
                setTimeout(() => {
                    setSuccess('')
                }, 3000)
            }
        } catch (err) {
            console.error('Failed to send verification code', err)
            setError('Unknown error')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }
        if (password.length < 6 || password.length > 12) {
            setError('Password must be between 6 and 12 characters')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }
        if (!verificationCode) {
            setError('Please enter the verification code')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }
        try {
            const response = await axios.post(
                new UserRegisterMessage(userName, email, password, verificationCode, parseInt(userType)).getURL(),
                JSON.stringify(new UserRegisterMessage(userName, email, password, verificationCode, parseInt(userType))),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            console.log(response.data)
            if ('Left' in response.data) {
                const key = Object.keys(response.data.Left.value)[0]
                setError(response.data.Left.value[key].message)
                setTimeout(() => {
                    setError('')
                }, 3000)
            } else {
                setSuccess(response.data.Right.value)
                setTimeout(() => {
                    history.push('/login')
                }, 1000)
            }
        } catch (err) {
            console.error('Registration failed', err)
            setError('Unknown error')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    return (
        <div className={styles.box}>
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Register</h4>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '5px' }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <div
                        style={{
                            position: 'relative',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }}
                        className={styles.inputContainer}
                    >
                        <input
                            type="text"
                            value={userName}
                            onChange={e => {
                                setUserName(e.target.value)
                                setError('')
                            }}
                            placeholder="Name"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div
                        style={{
                            position: 'relative',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }}
                        className={styles.inputContainer}
                    >
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Password (6-12 characters)"
                            required
                            className={styles.inputField}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'relative',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }}
                        className={styles.inputContainer}
                    >
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Confirm Password"
                            required
                            className={styles.inputField}
                        />
                        <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'relative',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }}
                        className={styles.inputContainer}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={e => {
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
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '10px auto',
                            width: '120%',
                        }}
                        className={styles.inputContainer}
                    >
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={e => {
                                setVerificationCode(e.target.value)
                                setError('')
                            }}
                            placeholder="Verification Code"
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <select id="select-box" value={userType} onChange={e => {
                        setUserType(e.target.value)
                        setError('')
                    }}>
                        <option value="1">Reader</option>
                        <option value="2">Writer</option>
                        <option value="3">Auditor</option>
                        <option value="4">Editor</option>
                    </select>
                    <div>
                        <button type="submit" className={styles.fnButton}>
                            Register
                        </button>
                    </div>
                    <div>
                        <button onClick={() => history.push('/')} className={styles.fnButton}>
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
