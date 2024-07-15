import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import styles from '../../styles/HomePage.module.css' // 确保路径正确
import backgroundImage from '../../assets/images/homepage.png'
import { GetHomepageStyleMessage } from 'Plugins/StyleAPI/GetHomepageStyleMessage'
import axios from 'axios' // 确保路径正确


const Homepage = () => {

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId')
            return storedStyleId ? parseInt(storedStyleId) : 1 // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e)
            return 1 // Default to 1 in case of any error
        }
    }
    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId())
    useEffect(() => {
        fetchStyle()
    }, [])

    const fetchStyle = async () => {
        const message = new GetHomepageStyleMessage(currentStyleId)
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.data.length > 0) {
            document.documentElement.style.setProperty('--button-color', response.data[0].buttoncolor)
            document.documentElement.style.setProperty('--button-fontSize', response.data[0].buttonfontsize.toString() + 'rem')
            document.documentElement.style.setProperty('--button-width', response.data[0].buttonwidth.toString() + '%')
            document.documentElement.style.setProperty('--paragraph-fontSize', response.data[0].paragraphfontsize.toString() + 'rem')
            document.documentElement.style.setProperty('--paragraph-color', response.data[0].paragraphcolor)
            document.documentElement.style.setProperty('--header-fontSize', response.data[0].headerfontsize.toString() + 'rem')
            document.documentElement.style.setProperty('--header-color', response.data[0].headercolor)
        }
    }

    const history = useHistory()

    const navigateToLogin = () => {
        history.push('/login')
    }

    const navigateToRegister = () => {
        history.push('/register')
    }

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Welcome to the Novel Platform</h4>
                <p></p>
                <p>Read amazing novels from various authors</p>
                <h4></h4>
                <p></p>
                <div>
                    <button onClick={navigateToLogin} className={styles.submit}>
                        Login
                    </button>
                    <button onClick={navigateToRegister} className={styles.submit}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Homepage
