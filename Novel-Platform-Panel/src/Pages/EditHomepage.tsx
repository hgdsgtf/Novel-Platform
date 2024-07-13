import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import styles from '../styles/HomePage.module.css'
import { GetHomepageStyleMessage } from 'Plugins/StyleAPI/GetHomepageStyleMessage'
import axios from 'axios'
import { SetHomepageStyleMessage } from 'Plugins/StyleAPI/SetHomepageStyleMessage'
import backgroundImage from '../assets/images/homepage.png'
import { useLocation } from 'react-router-dom'

const EditHomepage = () => {
    const history = useHistory()
    const [styleName, setStyleName] = useState('')
    const [showStyleNameInput, setShowStyleNameInput] = useState(false)
    const [buttonColor, setButtonColor] = useState('')
    const [buttonFontSize, setButtonFontSize] = useState(0)
    const [buttonWidth, setButtonWidth] = useState(0)
    const [paragraphColor, setParagraphColor] = useState('')
    const [paragraphFontSize, setParagraphFontSize] = useState(0)
    const [headerFontSize, setHeaderFontSize] = useState(0)
    const [headerColor, setHeaderColor] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [newstyleName, setnewStyleName] = useState('')
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const id = query.get('id')
    const username = query.get('userName')
    useEffect(() => {
        fetchStyle()
    }, [])

    const fetchStyle = async () => {
        const message = new GetHomepageStyleMessage(parseInt(id))
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.data.length > 0) {
            console.log(response.data)
            setStyleName(response.data[0].stylename)
            setButtonColor(response.data[0].buttoncolor)
            setButtonFontSize(response.data[0].buttonfontsize)
            setButtonWidth(response.data[0].buttonwidth)
            setParagraphColor(response.data[0].paragraphcolor)
            setParagraphFontSize(response.data[0].paragraphfontsize)
            setHeaderFontSize(response.data[0].headerfontsize)
            setHeaderColor(response.data[0].headercolor)
        }
    }

    const setStyle = async () => {
        if (!styleName) {
            setError('Please enter your style name')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        }

        const message = new SetHomepageStyleMessage(newstyleName, buttonColor, buttonFontSize, buttonWidth, paragraphFontSize, paragraphColor, headerFontSize, headerColor)
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            })
            setTimeout(() => {
                setSuccess('Style settings updated successfully')
            }, 3000)
            history.push(`/homepagestylelist?userName=${username}`)
        } catch (error) {
            console.error('Failed to update style settings:', error)
        }
    }

    const handleSubmit = () => {
        setShowStyleNameInput(true)
    }

    return (
        <div>
            <label>Button Color</label>
            <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
            />
            <label>Button Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={buttonFontSize}
                onChange={(e) => setButtonFontSize(parseFloat(e.target.value))}
            />
            <label>Button Width</label>
            <input
                type="range"
                min="10"
                max="100"
                value={buttonWidth}
                onChange={(e) => setButtonWidth(parseInt(e.target.value))}
            />
            <label>Paragraph Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={paragraphFontSize}
                onChange={(e) => setParagraphFontSize(parseFloat(e.target.value))}
            />
            <label>Paragraph Color</label>
            <input
                type="color"
                value={paragraphColor}
                onChange={(e) => setParagraphColor(e.target.value)}
            />
            <label>Header Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={headerFontSize}
                onChange={(e) => setHeaderFontSize(parseFloat(e.target.value))}
            />
            <label>Header Color</label>
            <input
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
            />

            <div className={styles.box} id="clickEffectContainer">
                <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
                <div className={styles.right}>
                    <h4 style={{ fontSize: `${headerFontSize}rem`, color: headerColor }}>Welcome to the Novel
                        Platform</h4>
                    <p style={{ fontSize: `${paragraphFontSize}rem`, color: paragraphColor }}>Read amazing novels from
                        various authors</p>
                    <div>
                        <button className={styles.submit} style={{
                            backgroundColor: buttonColor,
                            fontSize: `${buttonFontSize}rem`,
                            width: `${buttonWidth}%`,
                        }}>
                            Login
                        </button>
                        <button className={styles.submit} style={{
                            backgroundColor: buttonColor,
                            fontSize: `${buttonFontSize}rem`,
                            width: `${buttonWidth}%`,
                        }}>
                            Register
                        </button>
                    </div>
                </div>
            </div>

            {showStyleNameInput && (
                <>
                    <label>New Style Name</label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <input
                        type="text"
                        value={newstyleName}
                        onChange={(e) => {
                            setnewStyleName(e.target.value)
                            setError('')
                        }
                        }
                        placeholder="New Style Name" required
                    />
                    <button
                        onClick={setStyle}
                        className={styles.submit}
                    >
                        Confirm Submit
                    </button>
                </>
            )}

            {
                !showStyleNameInput && (
                    <button
                        onClick={handleSubmit}
                        className={styles.submit}
                    >
                        Submit
                    </button>
                )}

            <button
                onClick={() => history.push(`/homepagestylelist?userName=${username}`)}
                className={styles.submit}
            >
                Go Back
            </button>
        </div>
    )
}

export default EditHomepage


