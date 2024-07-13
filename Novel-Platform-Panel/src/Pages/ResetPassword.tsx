import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { UserResetMessage } from 'Plugins/BasicUserAPI/UserResetMessage'
import { GetUserNameMessage } from 'Plugins/BasicUserAPI/GetUserNameMessage'

const ResetPassword: React.FC = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const email = query.get('email')

    useEffect(() => {
        FindUserNameByEmail()
    }, [])

    const FindUserNameByEmail = async () => {
        try {
            const response = await axios.post(
                new GetUserNameMessage(email).getURL(),
                JSON.stringify(new GetUserNameMessage(email)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setName(response.data)
        } catch (err) {
            console.error('Failed to send verification code', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
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
        try {
            const response = await axios.post(
                new UserResetMessage(name, password).getURL(),
                JSON.stringify(new UserResetMessage(name, password)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            console.log('Response status:', response.status)
            console.log('Response body:', response.data)
            setSuccess(response.data)
            setTimeout(() => {
                history.push('/login')
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
                type="text"
                value={name}
                onChange={e => {
                    setName(e.target.value)
                    setError('')
                }}
                placeholder="Name"
                required
                style={{ display: 'block', margin: '10px auto', padding: '10px', width: '77%' }}
                disabled={true}
            />
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '10px auto',
                    width: '80%',
                }}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
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
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '10px auto',
                    width: '80%',
                }}
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

export default ResetPassword
