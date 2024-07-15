import React from 'react'
import { useHistory } from 'react-router'
import styles from 'Styles/ReaderHomepage.module.css'; // 确保路径正确
import backgroundImage from '../../assets/images/readerhomepage.png';// 确保路径正确

const WriterHomepage = () => {
    const history = useHistory()

    const navigateToWriterLogin = () => {
        history.push('/writerlogin')
    }

    const navigateToWriterRegister = () => {
        history.push('/writerregister')
    }

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Welcome to the Novel Platform</h4>
                <p>Read amazing novels from various authors</p>
                <div className={styles.fn}>
                    <button onClick={navigateToWriterLogin} className={styles.submit}>
                        Writer Login
                    </button>
                    <button onClick={navigateToWriterRegister} className={styles.submit}>
                        Writer Register
                    </button>
                    <button onClick={() => history.push('/')} className={styles.submit}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WriterHomepage
