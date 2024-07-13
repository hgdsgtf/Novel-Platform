import React from 'react'
import { useHistory } from 'react-router'
import styles from '../styles/ReaderHomepage.module.css'; // 确保路径正确
import backgroundImage from '../assets/images/readerhomepage.png'; // 确保路径正确

const AuditorHomepage = () => {
    const history = useHistory()

    const navigateToAuditorRegister = () => {
        history.push('/auditorregister')
    }

    const navigateToAuditorLogin = () => {
        history.push('/auditorlogin')
    }

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Welcome to the Novel Platform Backstage</h4>
                <div className={styles.fn}>
                    <button onClick={navigateToAuditorLogin} className={styles.submit}>
                        Auditor Login
                    </button>
                    <button onClick={navigateToAuditorRegister} className={styles.submit}>
                        Auditor Register
                    </button>
                    <button onClick={() => history.push('/otherhomepage')} className={styles.submit}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AuditorHomepage

