import React from 'react'
import { useHistory } from 'react-router'
import styles from 'Styles/HomePage.module.css';
import backgroundImage from '../../assets/images/homepage.png';

const OtherHomepage = () => {
    const history = useHistory()

    const navigateToAuditor = () => {
        history.push('/auditorhomepage')
    }

    const navigateToAdministrator = () => {
        history.push('/adminhomepage')
    }

    return (
        <div className={styles.box}>
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Welcome to the Novel Platform</h4>
                <p>Read amazing novels from various authors</p>
                <p>Please choose your character</p>
                <div className={styles.fn}>
                    <button onClick={navigateToAuditor} className={styles.fnButton}>
                        Auditor
                    </button>

                    <button onClick={navigateToAdministrator} className={styles.fnButton}>
                        Administrator
                    </button>
                </div>
                <div className={`${styles.fn} ${styles.centeredFn}`}>
                    <button onClick={() => history.push('/')} className={styles.fnButton}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OtherHomepage

