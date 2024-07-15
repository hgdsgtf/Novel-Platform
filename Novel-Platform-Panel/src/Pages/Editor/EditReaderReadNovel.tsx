import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import styles from '../../styles/ReaderReadNovel.module.css';
import { GetPageStyleMessage } from 'Plugins/StyleAPI/GetPageStyleMessage';
import { SetPageStyleMessage } from 'Plugins/StyleAPI/SetPageStyleMessage';

const EditReaderReadNovel = () => {
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
            const message = new GetPageStyleMessage('ReaderReadNovel', parseInt(id));
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.length > 0) {
                const style = response.data[0];
                const updatedStyleSettings = {
                    styleName: style.styleName,
                    buttonColor: style.buttonColor,
                    buttonFontSize: style.buttonFontSize,
                    buttonWidth: style.buttonWidth,
                    paragraphColor: style.paragraphColor,
                    paragraphFontSize: style.paragraphFontSize,
                    headerFontSize: style.headerFontSize,
                    headerColor: style.headerColor
                };
                setStyleSettings(updatedStyleSettings);

                console.log('Updated style settings:', updatedStyleSettings);
            } else {
                console.log('No styles found for ReaderReadNovel');
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
            'ReaderReadNovel',
            newStyleName,
            styleSettings.buttonColor,
            styleSettings.buttonFontSize,
            styleSettings.buttonWidth,
            styleSettings.paragraphFontSize,
            styleSettings.paragraphColor,
            styleSettings.headerFontSize,
            styleSettings.headerColor
        );

        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            setTimeout(() => {
                setSuccess('Style settings updated successfully');
            }, 3000);
            history.push(`/stylelist?pageName=ReaderReadNovel&userName=${username}`);
        } catch (error) {
            console.error('Failed to update style settings:', error);
        }
    };

    const handleSubmit = () => {
        setShowStyleNameInput(true);
    };

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

            <div className={styles.readerReadNovelContainer}>
                <h4 style={{ fontSize: `${styleSettings.headerFontSize}rem`, color: styleSettings.headerColor }}>Read Novel</h4>
                <p style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>
                    Novel: 小说名称 - Chapter: 章节编号
                </p>
                <div className={styles.novelContent} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>
                    <p>Novel Content:</p>
                    小说内容
                </div>
                <div>
                    <p style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>Price: 价格</p>
                    <button className={styles.submitButton} style={{ backgroundColor: styleSettings.buttonColor, fontSize: `${styleSettings.buttonFontSize}rem`, width: `${styleSettings.buttonWidth}%` }}>
                        Purchase
                    </button>
                </div>
                <div>
                    <button className={styles.submitButton} style={{ backgroundColor: styleSettings.buttonColor, fontSize: `${styleSettings.buttonFontSize}rem`, width: `${styleSettings.buttonWidth}%` }}>
                        Check comment
                    </button>
                </div>
                <div>
                    <p style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>Chapter Rating: 章节评分</p>
                    <button className={styles.submitButton} style={{ backgroundColor: styleSettings.buttonColor, fontSize: `${styleSettings.buttonFontSize}rem`, width: `${styleSettings.buttonWidth}%` }}>
                        Rate Chapter
                    </button>
                    <div>
                        <h4 style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }}>Your Rating: 用户评分</h4>
                    </div>
                    <button className={styles.submitButton} style={{ backgroundColor: styleSettings.buttonColor, fontSize: `${styleSettings.buttonFontSize}rem`, width: `${styleSettings.buttonWidth}%` }}>
                        Report an issue
                    </button>
                    <div>
                        <textarea className={styles.issueTextarea} style={{ fontSize: `${styleSettings.paragraphFontSize}rem`, color: styleSettings.paragraphColor }} placeholder="Report your issues">
                        </textarea>
                        <button className={styles.submitButton} style={{ backgroundColor: styleSettings.buttonColor, fontSize: `${styleSettings.buttonFontSize}rem`, width: `${styleSettings.buttonWidth}%` }}>
                            Submit
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
            <button onClick={() => history.push(`/stylelist?pageName=ReaderReadNovel&userName=${username}`)}
                    className={styles.submit}>
                Go Back
            </button>
        </div>
    )
}

export default EditReaderReadNovel;
