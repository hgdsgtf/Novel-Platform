import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GetAllStylesMessage } from 'Plugins/StyleAPI/GetAllStylesMessage';
import { DeletePageStyleMessage } from 'Plugins/StyleAPI/DeletePageStyleMessage';

interface StyleListProps {
    pageName: string;
}

const StyleList: React.FC<StyleListProps> = ({pageName:string}) => {
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const pageName = query.get('pageName')

    const [styles, setStyles] = useState<any[]>([]);

    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem(`currentStyleId_${pageName}`)
            return storedStyleId ? parseInt(storedStyleId) : 1; // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e);
            return 1; // Default to 1 in case of any error
        }
    };

    const [currentStyleId, setCurrentStyleId] = useState<number>(getCurrentStyleId());

    useEffect(() => {
        fetchStyles();
    }, []);

    useEffect(() => {
        setCurrentStyleId(getCurrentStyleId());
    }, [styles]);

    const fetchStyles = async () => {
        try {
            const message = new GetAllStylesMessage(pageName);
            const response = await axios.post(
                message.getURL(),
                JSON.stringify(message),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log('Response from /stylelist:', response); // 输出响应内容
            setStyles(response.data);
        } catch (err) {
            console.error('Failed to get styles', err); // 输出错误信息
        }
    };

    const deleteStyle = async (id: number) => {
        try {
            await axios.post(
                new DeletePageStyleMessage(pageName,id).getURL(),
                JSON.stringify(new DeletePageStyleMessage(pageName,id)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );
            fetchStyles(); // Refresh styles after deletion
        } catch (err) {
            console.error('Failed to delete style', err);
        }
    };

    const goToEdit = (id: number) => {
        const lowerCasePageName = pageName.toLowerCase();
        console.log(`Navigating to edit page for style ID: ${id}, pageName: ${lowerCasePageName}`); // 添加日志
        history.push(`/edit${lowerCasePageName}?id=${id}`);
    };

    const handleApplyStyle = (styleId: number) => {
        setCurrentStyleId(styleId);
        localStorage.setItem(`currentStyleId_${pageName}`, styleId.toString());
    };

    return (
        <div>
            <h2>{pageName} Styles List</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Style Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {styles.map((style) => (
                    <tr key={style.id}>
                        <td>{style.id}</td>
                        <td>{style.styleName}</td>
                        <td>
                            <button onClick={() => goToEdit(style.id)}>Edit</button>
                            {style.id !== 1 && style.id !== currentStyleId && (
                                <button onClick={() => deleteStyle(style.id)}>Delete</button>
                            )}
                            {style.id !== currentStyleId && (
                                <button onClick={() => handleApplyStyle(style.id)}>Apply</button>
                            )}
                            {style.id === currentStyleId && <span>Applied</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => history.push('/editormain')}>Go Back</button>
        </div>
    );
};

export default StyleList;
