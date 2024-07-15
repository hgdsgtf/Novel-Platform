import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import { UserLoginMessage } from 'Plugins/BasicUserAPI/UserLoginMessage'
import styles from 'Styles/ReaderLogin.module.css'
import backgroundImage from '../../assets/images/login.jpg'
import { GetUserTypeByTokenMessage } from 'Plugins/BasicUserAPI/GetUserTypeByTokenMessage'

const Login: React.FC = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const history = useHistory()

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await axios.post(
                new UserLoginMessage(userName, password).getURL(),
                JSON.stringify(new UserLoginMessage(userName, password)),
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
                setSuccess('Login succeeded')
                setTimeout(async () => {
                    const type = await axios.post(
                        new GetUserTypeByTokenMessage(response.data.Right.value).getURL(),
                        JSON.stringify(new GetUserTypeByTokenMessage(response.data.Right.value)),
                        {
                            headers: { 'Content-Type': 'application/json' },
                        },
                    )
                    switch (type.data.Right.value) {
                        case 0:
                            history.push(`/adminmain?userName=${userName}`)
                            break
                        case 1:
                            history.push(`/readermain?userName=${userName}`)
                            break
                        case 2:
                            history.push(`/writermain?userName=${userName}`)
                            break
                        case 3:
                            history.push(`/auditormain?userName=${userName}`)
                            break
                        default:
                            history.push(`/editormain?userName=${userName}`)
                            break
                    }
                }, 1000)
            }
        } catch (err) {
            console.error('Login failed', err)
            setError('Unknown error')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Login</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={styles.inputWrapper}>
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
                    <div className={styles.inputWrapper}>
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
                        onClick={() => history.push('/forgottenpassword')}
                        className={styles.submit}
                    >
                        Forgotten?
                    </button>
                    <button
                        onClick={() => history.push('/')}
                        className={styles.submit}
                    >
                        Go Back
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
