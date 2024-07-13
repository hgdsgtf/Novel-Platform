import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { WriterSendCodeMessage } from 'Plugins/WriterAPI/WriterSendCodeMessage'
import { WriterVerifyMessage } from 'Plugins/WriterAPI/WriterVerifyMessage'

const WriterForgotPassword: React.FC = () => {
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
            return
        }
        try {
            const response = await axios.post(
                new WriterSendCodeMessage(email).getURL(),
                JSON.stringify(new WriterSendCodeMessage(email)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            console.log('Response status:', response.status)
            console.log('Response body:', response.data)
            setIsCodeResendAllowed(false)
        } catch (err) {
            console.error('Failed to send verification code', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
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
                new WriterVerifyMessage(email, verificationCode).getURL(),
                JSON.stringify(new WriterVerifyMessage(email, verificationCode)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            console.log('Response status:', response.status)
            console.log('Response body:', response.data)
            setSuccess(response.data)
            setTimeout(() => {
                history.push(`/writerresetpassword?email=${email}`)
            }, 1000)
        } catch (err) {
            console.error('Reset failed', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
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
                    onClick={() => history.push('/writerlogin')}
                    style={{ padding: '10px 20px', marginTop: '20px' }}
                >
                    Go Back
                </button>
            </div>
        </form>
    )
}

export default WriterForgotPassword
