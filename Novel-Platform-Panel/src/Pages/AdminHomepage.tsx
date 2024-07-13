import React from 'react';
import { useHistory } from 'react-router';
import styles from '../styles/ReaderHomepage.module.css'; // 确保路径正确
import backgroundImage from '../assets/images/readerhomepage.png';// 确保路径正确

const AdminHomepage = () => {
    const history = useHistory();

    const navigateToAdminLogin = () => {
        history.push('/adminlogin');
    };

    const navigateToAdminRegister = () => {
        history.push('/adminregister');
    };

    return (
        <div className={styles.box} id="clickEffectContainer">
            <div className={styles.left} style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className={styles.right}>
                <h4>Welcome to the Novel Platform Backstage</h4>
                <div className={styles.fn}>
                    <button onClick={navigateToAdminLogin} className={styles.submit}>
                        Admin Login
                    </button>
                    <button onClick={navigateToAdminRegister} className={styles.submit}>
                        Admin Register
                    </button>
                    <button onClick={() => history.push('/otherhomepage')} className={styles.submit}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHomepage;
