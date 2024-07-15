import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import styles from '../../styles/NovelInfo.module.css';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import { SetPageStyleMessage } from 'Plugins/StyleAPI/SetPageStyleMessage';
import backgroundImage from '../../assets/images/homepage.png';

const EditNovelInfo = () => {
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    const username = query.get('userName');

    // 集中管理状态的对象
    const [styleSettings, setStyleSettings] = useState({
        styleName: '',
        buttonColor: '',
        buttonFontSize: 1,
        buttonWidth: 100,
        paragraphColor: '',
        paragraphFontSize: 1,
        headerFontSize: 1.5,
        headerColor: '',
    });

    const [showStyleNameInput, setShowStyleNameInput] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newStyleName, setNewStyleName] = useState('');

    useEffect(() => {
        fetchStyle();
    }, []);

    const fetchStyle = async () => {
        try {
            console.log('Fetching style for page: NovelInfo with style ID:', id); // 添加日志
            const message = new GetPageStyleMessage('NovelInfo', parseInt(id));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response data:', response.data); // 添加日志

            if (response.data.length > 0) {
                const style = response.data[0];
                console.log('Fetched style:', style);

                const styleSettings = {
                    styleName: style.styleName,
                    buttonColor: style.buttonColor,
                    buttonFontSize: style.buttonFontSize,
                    buttonWidth: style.buttonWidth,
                    paragraphColor: style.paragraphColor,
                    paragraphFontSize: style.paragraphFontSize,
                    headerFontSize: style.headerFontSize,
                    headerColor: style.headerColor
                };

                setStyleSettings(styleSettings); // 更新状态
                // 设置 CSS 变量
                document.documentElement.style.setProperty('--button-color', style.buttoncolor);
                document.documentElement.style.setProperty('--button-fontSize', `${style.buttonfontsize}rem`);
                document.documentElement.style.setProperty('--button-width', `${style.buttonwidth}%`);
                document.documentElement.style.setProperty('--paragraph-fontSize', `${style.paragraphfontsize}rem`);
                document.documentElement.style.setProperty('--paragraph-color', style.paragraphcolor);
                document.documentElement.style.setProperty('--header-fontSize', `${style.headerfontsize}rem`);
                document.documentElement.style.setProperty('--header-color', style.headercolor);

            } else {
                console.log('No styles found for NovelInfo');
            }
        } catch (error) {
            console.error('Error fetching styles:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };



    const setStyle = async () => {
        if (!newStyleName) {
            setError('Please enter your style name');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }
        const message = new SetPageStyleMessage(
            'NovelInfo',
            newStyleName,
            styleSettings.buttonColor,
            styleSettings.buttonFontSize,
            styleSettings.buttonWidth,
            styleSettings.paragraphFontSize,
            styleSettings.paragraphColor,
            styleSettings.headerFontSize,
            styleSettings.headerColor
        );
        console.log(message);
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setTimeout(() => {
                setSuccess('Style settings updated successfully');
            }, 3000);
            history.push(`/stylelist?pageName=NovelInfo&userName=${username}`);
        } catch (error) {
            console.error('Failed to update style settings:', error);
        }
    };
    const handleSubmit = () => {
        setShowStyleNameInput(true)
    }
    const handleInputChange = (field: keyof typeof styleSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStyleSettings(prevSettings => {
            const updatedValue = typeof prevSettings[field] === 'number' ? parseFloat(value) : value;
            console.log(`Updating field ${field} to value:`, updatedValue);
            return {
                ...prevSettings,
                [field]: updatedValue
            };
        });
    };


    return (
        <div>
            <label>Button Color</label>
            <input
                type="color"
                value={styleSettings.buttonColor || ''} // 确保有默认值
                onChange={handleInputChange('buttonColor')}
            />
            <label>Button Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.buttonFontSize || 1} // 确保有默认值
                onChange={handleInputChange('buttonFontSize')}
            />
            <label>Button Width</label>
            <input
                type="range"
                min="10"
                max="100"
                value={styleSettings.buttonWidth || 100} // 确保有默认值
                onChange={handleInputChange('buttonWidth')}
            />
            <label>Paragraph Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.paragraphFontSize || 1} // 确保有默认值
                onChange={handleInputChange('paragraphFontSize')}
            />
            <label>Paragraph Color</label>
            <input
                type="color"
                value={styleSettings.paragraphColor || ''} // 确保有默认值
                onChange={handleInputChange('paragraphColor')}
            />
            <label>Header Font Size</label>
            <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={styleSettings.headerFontSize || 1.5} // 确保有默认值
                onChange={handleInputChange('headerFontSize')}
            />
            <label>Header Color</label>
            <input
                type="color"
                value={styleSettings.headerColor || ''} // 确保有默认值
                onChange={handleInputChange('headerColor')}
            />

            <div>
                <div className={styles.novelInfoContainer}>
                    <div className={styles.right}>
                        <h4 className={styles.title}>小说信息</h4>
                        <p className={styles.subtitle}
                           style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>标题: 小说</p>
                        <p className={styles.author}
                           style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>作者: 作者</p>
                        <p className={styles.rating}
                           style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>作品评分: 暂无评分</p>
                        <div>
                            <ul className={styles.chapterList}>
                                <li className={styles.chapterItem}
                                    style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>
                                    chapter 1: Chapter 1
                                    <span className={styles.chapterAvailable}> 这个章节可以查看</span>
                                </li>
                            </ul>
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
                            value={newStyleName}
                            onChange={(e) => {
                                setNewStyleName(e.target.value);
                                setError('');
                            }}
                            placeholder="New Style Name" required
                        />
                        <button onClick={setStyle} className={styles.submit}>
                            Confirm Submit
                        </button>
                    </>
                )}
                {!showStyleNameInput && (
                    <button onClick={handleSubmit} className={styles.submit}>
                        Submit
                    </button>
                )}
                <button onClick={() => history.push(`/stylelist?pageName=NovelInfo&userName=${username}`)}
                        className={styles.submit}>
                    Go Back
                </button>
            </div>
        </div>
    )
}

export default EditNovelInfo
