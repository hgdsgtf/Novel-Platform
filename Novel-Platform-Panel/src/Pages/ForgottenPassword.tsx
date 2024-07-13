import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { UserSendCodeMessage } from 'Plugins/BasicUserAPI/UserSendCodeMessage'
import { UserVerifyMessage } from 'Plugins/BasicUserAPI/UserVerifyMessage'

const ForgottenPassword: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isCodeResendAllowed, setIsCodeResendAllowed] = useState(true)
    const [timeLeft, setTimeLeft] = useState(60)
    const [email, setEmail] = useState('')
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
                const key = Object.keys(response.data.Left.value)[0]
                setError(response.data.Left.value[key].message)
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
        if (!verificationCode) {
            setError('Please enter the verification code')
            return
        }
        try {
            const response = await axios.post(
                new UserVerifyMessage(email, verificationCode).getURL(),
                JSON.stringify(new UserVerifyMessage(email, verificationCode)),
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
                    history.push(`/resetpassword?email=${email}`)
                }, 1000)
            }
        } catch (err) {
            console.error('Verification failed', err)
            setError('Unknown error')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Reset Password</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="email"
                value={email}
                onChange={e => {
                    setEmail(e.target.value)
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
                onChange={e => {
                    setVerificationCode(e.target.value)
                    setError('')
                }}
                placeholder="Verification Code"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
            />
            <div>
                <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Reset password
                </button>
            </div>
            <div>
                <button
                    onClick={() => history.push('/login')}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Go Back
                </button>
            </div>
        </form>
    )
}

export default ForgottenPassword
